import random
from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from salary_api.models import Employee, SalaryRecord, SalaryRevision
from salary_api.payroll import calculate_salary

FIRST_NAMES = ["Aarav","Sarah","Liam","Olivia","Noah","Emma","Ethan","Mia","Lucas","Sophia","Daniel","Ava","James","Isabella","Arjun","Ananya","William","Charlotte","Henry","Amelia"]
LAST_NAMES = ["Johnson","Smith","Brown","Patel","Sharma","Williams","Miller","Wilson","Davis","Anderson","Taylor","Thomas","Moore","Martin","Clark","Lewis","Lee","Walker","Hall","Allen"]
COUNTRIES = [
    ("India","INR",800000,3200000,["HDFC Bank","ICICI Bank","Axis Bank"]),
    ("USA","USD",65000,160000,["Chase","Bank of America","Wells Fargo"]),
    ("UK","GBP",45000,100000,["Barclays","HSBC","Lloyds"]),
    ("Germany","EUR",48000,110000,["Deutsche Bank","Commerzbank","ING"]),
    ("Canada","CAD",55000,120000,["RBC","TD Canada Trust","Scotiabank"]),
    ("Australia","AUD",60000,140000,["ANZ","Commonwealth Bank","Westpac"]),
    ("Japan","JPY",5000000,12000000,["MUFG Bank","SMBC","Mizuho"]),
    ("France","EUR",42000,95000,["BNP Paribas","Crédit Agricole","Société Générale"]),
]
DEPARTMENTS = ["Engineering","Sales","HR","Finance","Marketing","Operations","Product","Legal","IT","Customer Success","Data","Administration"]
TITLES = ["Software Engineer","Senior Software Engineer","Product Manager","HR Manager","Financial Analyst","Sales Manager","Data Analyst","Operations Lead","Marketing Specialist","Recruiter"]


class Command(BaseCommand):
    help = "Create deterministic sample employees, salary history and recent monthly payroll records."

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=10000)
        parser.add_argument("--clear", action="store_true")

    def handle(self, *args, **options):
        count = options["count"]
        if options["clear"]:
            SalaryRecord.objects.all().delete(); SalaryRevision.objects.all().delete(); Employee.objects.all().delete()
        existing = Employee.objects.count()
        rng = random.Random(2025)
        batch = []
        for number in range(existing + 1, count + 1):
            country, currency, low, high, banks = rng.choice(COUNTRIES)
            first, last = rng.choice(FIRST_NAMES), rng.choice(LAST_NAMES)
            salary = Decimal(rng.randint(low // 100, high // 100) * 100)
            hire_date = date(2016, 1, 1) + timedelta(days=rng.randint(0, 3500))
            status = rng.choices([Employee.Status.ACTIVE, Employee.Status.ON_LEAVE, Employee.Status.INACTIVE], weights=[90,6,4])[0]
            bank = rng.choice(banks)
            batch.append(Employee(
                employee_id=f"EMP{number:05d}", first_name=first, last_name=last,
                email=f"employee{number:05d}@acme.example", phone=f"+1 555 {number % 1000:03d} {number % 10000:04d}",
                job_title=rng.choice(TITLES), department=rng.choice(DEPARTMENTS), country=country, currency=currency,
                annual_salary=salary, hire_date=hire_date, status=status, source=Employee.Source.SEEDED,
                bank_name=bank, bank_branch=f"{country} Central Branch", bank_account_last4=f"{rng.randint(0,9999):04d}",
            ))
            if len(batch) == 1000:
                Employee.objects.bulk_create(batch, ignore_conflicts=True); batch.clear()
        if batch: Employee.objects.bulk_create(batch, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Seeded up to {count} employees."))

        # Backfill one initial salary-history entry for every seeded employee.
        if SalaryRevision.objects.count() < Employee.objects.count():
            revisions = []
            existing_revision_ids = set(SalaryRevision.objects.values_list("employee_id", flat=True))
            for employee in Employee.objects.all().iterator(chunk_size=1000):
                if employee.id not in existing_revision_ids:
                    revisions.append(SalaryRevision(employee=employee, effective_date=employee.hire_date, previous_ctc=0, new_ctc=employee.annual_salary, currency=employee.currency, reason="Initial salary"))
                if len(revisions) == 1000:
                    SalaryRevision.objects.bulk_create(revisions, ignore_conflicts=True); revisions.clear()
            if revisions: SalaryRevision.objects.bulk_create(revisions, ignore_conflicts=True)

        # Give the demo an immediately useful payroll history for the latest three months.
        if SalaryRecord.objects.exists():
            self.stdout.write(self.style.SUCCESS(f"Payroll history already exists: {SalaryRecord.objects.count()} salary records."))
            return
        today = date.today().replace(day=1)
        months = []
        y, m = today.year, today.month
        for _ in range(3):
            months.append(date(y, m, 1)); m -= 1
            if m == 0: m = 12; y -= 1
        existing_keys = set(SalaryRecord.objects.values_list("employee_id", "pay_month"))
        records = []
        for employee in Employee.objects.filter(status__in=[Employee.Status.ACTIVE, Employee.Status.ON_LEAVE]).iterator(chunk_size=1000):
            for pay_month in months:
                if (employee.id, pay_month) in existing_keys: continue
                values = calculate_salary(employee, pay_month.year, pay_month.month)
                records.append(SalaryRecord(
                    employee=employee, pay_month=pay_month, employee_id_snapshot=employee.employee_id,
                    employee_name_snapshot=employee.full_name, department=employee.department, currency=employee.currency,
                    bank_name=employee.bank_name, bank_branch=employee.bank_branch, bank_account_last4=employee.bank_account_last4,
                    **values, payment_status=SalaryRecord.PaymentStatus.PAID if pay_month < today else SalaryRecord.PaymentStatus.UNPAID,
                    paid_date=pay_month.replace(day=min(calendar_month_last(pay_month), 28)) if pay_month < today else None,
                ))
                if len(records) == 1000:
                    SalaryRecord.objects.bulk_create(records, ignore_conflicts=True); records.clear()
        if records: SalaryRecord.objects.bulk_create(records, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Payroll history ready: {SalaryRecord.objects.count()} salary records."))


def calendar_month_last(d):
    import calendar
    return calendar.monthrange(d.year, d.month)[1]
