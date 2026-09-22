# ACME Salary Manager

HR-friendly employee and salary management software for the ACME assessment.

## What this version contains

This version keeps the existing JSX/CSS split UI and employee functionality while adding a complete HR compensation workflow:

- 10,000 deterministic employee records from the existing project data/seed structure.
- Employee search by name, phone, employee ID, email, job title, department and country.
- Employee detail page with current CTC, bank information, salary revision history and monthly salary history.
- Previous salary details are automatically recorded when an employee's CTC changes.
- Monthly Salary Sheets section for HR.
- One-click monthly payroll generation for active/on-leave employees.
- Automatic calculation of monthly CTC, basic pay, HRA, allowances, gross pay, deductions and net pay.
- Bank name, branch and masked account last four digits on payroll rows.
- Paid / Unpaid / Processing status.
- Individual salary-slip PDF generation and download from employee detail.
- Salary-sheet Excel import and export.
- Existing employee Excel import and CSV export.
- Existing dashboard, pagination, world map and current sidebar/visual style.
- PostgreSQL-ready backend and Render deployment configuration.

## Payroll calculation used in the assessment

The demo uses a transparent standard formula so the salary sheet is calculated automatically:

- Monthly CTC = annual CTC / 12.
- Basic pay = 50% of monthly CTC.
- HRA = 40% of basic pay.
- Allowances = remaining monthly CTC after basic + HRA.
- Gross pay = basic + HRA + allowances + bonus + overtime.
- INR employees: PF is 12% of basic, capped at ₹1,800 for this demo; professional tax is ₹200 when gross pay exists; income-tax/withholding is 5% of gross.
- Other currencies: retirement contribution is 5% of basic and income-tax/withholding is 5% of gross.
- Net pay = gross pay - total deductions.

This is an assessment/demo payroll policy, not a statutory payroll engine. Actual production payroll should configure country-specific tax, social-security, benefits, attendance, leave and compliance rules.

## Local setup

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data --count 10000
python manage.py createsuperuser
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000/api`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Main HR workflow

1. Open **Employees** and search for an employee.
2. Select **View** to open the employee detail page.
3. Review current CTC, bank information and **Previous salary details**.
4. Review the employee's monthly salary records.
5. Select a payroll month and click **Generate & Download Slip**.
6. Open **Salary Sheets** to generate the full monthly payroll sheet.
7. Review gross pay, deductions, net pay and payment status.
8. Import or export the monthly sheet as Excel when HR needs to work with a spreadsheet.

## Employee Excel import

The existing employee import supports:

```text
employee_id
first_name
last_name
email
phone
job_title
department
country
currency
salary
hire_date
status
bank_name
bank_branch
bank_account_last4
```

## Salary sheet Excel import

Salary sheet import requires:

```text
employee_id
pay_month
payment_status
```

It can also accept calculated payroll columns such as:

```text
paid_date
paid_days
basic_pay
hra
allowances
bonus
overtime
gross_pay
pf_amount
professional_tax
income_tax
other_deductions
total_deductions
net_pay
```

Rows are matched to employees by Employee ID and to payroll periods by Pay Month.

## Database recommendation

Use PostgreSQL for hosted deployment. SQLite is suitable for local development. The existing Render configuration uses an external PostgreSQL `DATABASE_URL` so employee and payroll data are not tied to an ephemeral web-service filesystem.

## Render deployment

The repository includes `render.yaml`.

Backend environment variables:

```text
DATABASE_URL=<PostgreSQL connection string>
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND.onrender.com
CSRF_TRUSTED_ORIGINS=https://YOUR-FRONTEND.onrender.com
```

Frontend:

```text
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

The backend build command runs migrations, seeds the 10,000 employee demo dataset and collects static files.

## Tests

Backend:

```powershell
cd backend
python manage.py test
```

Frontend:

```powershell
cd frontend
npm test
```
