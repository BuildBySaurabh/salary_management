from django.core.validators import MinValueValidator
from django.db import models


class Employee(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ON_LEAVE = "on_leave", "On Leave"
        INACTIVE = "inactive", "Inactive"

    class Source(models.TextChoices):
        MANUAL = "manual", "Manual"
        IMPORT = "import", "Excel Import"
        SEEDED = "seeded", "Seed Data"

    employee_id = models.CharField(max_length=20, unique=True, db_index=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    job_title = models.CharField(max_length=120)
    department = models.CharField(max_length=80, db_index=True)
    country = models.CharField(max_length=80, db_index=True)
    currency = models.CharField(max_length=3, db_index=True)
    annual_salary = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    hire_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE, db_index=True)
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.MANUAL, db_index=True)
    bank_name = models.CharField(max_length=120, blank=True)
    bank_branch = models.CharField(max_length=120, blank=True)
    bank_account_last4 = models.CharField(max_length=4, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["employee_id"]
        indexes = [
            models.Index(fields=["country", "department"]),
            models.Index(fields=["currency", "annual_salary"]),
        ]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"


class SalaryRevision(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="salary_revisions")
    effective_date = models.DateField()
    previous_ctc = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    new_ctc = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    currency = models.CharField(max_length=3)
    reason = models.CharField(max_length=200, default="Salary revision")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-effective_date", "-id"]
        indexes = [models.Index(fields=["employee", "effective_date"])]


class SalaryRecord(models.Model):
    class PaymentStatus(models.TextChoices):
        PAID = "paid", "Paid"
        UNPAID = "unpaid", "Unpaid"
        PROCESSING = "processing", "Processing"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="salary_records")
    pay_month = models.DateField(db_index=True)
    employee_id_snapshot = models.CharField(max_length=20)
    employee_name_snapshot = models.CharField(max_length=170)
    ctc = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    department = models.CharField(max_length=80)
    currency = models.CharField(max_length=3)
    bank_name = models.CharField(max_length=120, blank=True)
    bank_branch = models.CharField(max_length=120, blank=True)
    bank_account_last4 = models.CharField(max_length=4, blank=True)
    working_days = models.PositiveSmallIntegerField(default=0)
    paid_days = models.PositiveSmallIntegerField(default=0)
    basic_pay = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    hra = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    allowances = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    overtime = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    gross_pay = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    pf_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    professional_tax = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    income_tax = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    other_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    net_pay = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.UNPAID, db_index=True)
    paid_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-pay_month", "employee_id_snapshot"]
        constraints = [models.UniqueConstraint(fields=["employee", "pay_month"], name="unique_employee_pay_month")]
        indexes = [
            models.Index(fields=["pay_month", "payment_status"]),
            models.Index(fields=["employee", "pay_month"]),
        ]
