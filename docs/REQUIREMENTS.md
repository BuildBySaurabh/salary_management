# ACME Salary Manager — Requirements

## Goal
Give an HR Manager one place to manage employee compensation, review previous salary changes, prepare monthly payroll sheets, track paid/unpaid salary, import/export Excel sheets, and generate individual salary slips.

## In scope
- Employee directory for 10,000 seeded employees.
- Employee search by name, phone, ID, email, department and country.
- Employee detail page with current compensation, bank information, salary revision history and monthly salary records.
- Monthly salary sheet generation for active/on-leave employees.
- Automatic payroll calculation: CTC/month, basic, HRA, allowances, gross pay, deductions and net pay.
- Payment status: Paid, Unpaid, Processing.
- Individual salary-slip PDF generation and download.
- Excel import/export for employees and monthly salary sheets.
- Salary history created when an employee's CTC changes.
- Existing dashboard, world map, employee pagination and current UI structure.

## Deliberate exclusions
- No direct bank payment integration: payment execution belongs to the organization's banking/payroll provider.
- No statutory tax engine: tax, social-security and local payroll rules differ by country and require organization-specific configuration.
- No full attendance/leave engine: the salary sheet supports working/paid days, but attendance remains outside this assessment scope.
- No storage of full bank account numbers: the demo stores bank name, branch and last four digits only.
