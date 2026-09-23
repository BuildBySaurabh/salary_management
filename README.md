# Salary Management System

A full-stack employee salary management platform built for an organization with 10,000 employees across multiple countries.

The application helps HR managers move away from Excel-based salary management and manage employee salary information, payroll records, salary history, salary sheets, and salary slips through a centralized web application.

The project was developed with a focus on **product thinking, clean architecture, maintainability, performance, testing, and intentional use of AI-assisted development**.

---

## Live Application

### Frontend

https://salary-management-frontend-1h1y.onrender.com

### Backend API

https://salary-management-bnhw.onrender.com

The application is deployed and can be accessed online through the frontend.

---

## Problem

HR team manages salary information for approximately **10,000 employees across multiple countries** using Excel files.

This creates several challenges:

* Salary information is spread across Excel files.
* Finding employee salary information is time-consuming.
* Maintaining historical salary information is difficult.
* Creating monthly salary sheets requires manual work.
* Generating individual salary slips is inconvenient.
* HR needs a centralized way to understand how the organization pays employees.
* Employee and salary data can become difficult to search and manage as the organization grows.

The goal of this application is to provide HR with a centralized salary management system instead of relying primarily on Excel-based workflows.

---

## User Persona

### HR Manager

The primary user is an HR Manager who needs to:

* Manage employee records.
* Search and filter employees.
* View employee salary information.
* Maintain salary history.
* Create monthly salary sheets.
* Import salary information from Excel.
* Track paid and unpaid salary records.
* Generate individual salary slips.
* Understand salary distribution across departments and countries.

---

## Product Goal

Build a simple, reliable web-based salary management platform that allows an HR Manager to manage employee and salary information for a large organization from one centralized system.

The application prioritizes the most common HR workflows instead of attempting to build a complete enterprise payroll platform.

---

# Core Features

## 1. HR Dashboard

The dashboard provides an overview of the organization's employee and salary data.

It includes:

* Total employee count
* Department information
* Salary-related information
* Employee data distribution
* Data source information
* Country/global distribution
* Search and filtering capabilities

The dashboard is designed to help HR quickly understand the organization's employee and salary data.

---

## 2. Employee Management

HR can manage employee information through the application.

Employee information includes fields such as:

* Employee ID
* First name
* Last name
* Full name
* Email
* Phone
* Job title
* Department
* Country
* Currency
* Salary
* Hire date
* Employment status

The application is seeded with approximately **10,000 employee records** for demonstration and testing.

---

## 3. Employee Search & Filtering

HR can search employees using information such as:

* Employee name
* Employee ID
* Email
* Phone
* Job title
* Department
* Country

Employees can also be filtered based on available employee and salary attributes.

Pagination is used to handle large employee datasets without attempting to load the entire dataset into the UI at once.

---

## 4. Employee Details

HR can open an individual employee record to view detailed information.

The employee detail view provides:

* Employee information
* Salary information
* Salary history
* Bank information
* Payroll information
* Salary slip generation

This provides HR with a single place to review an employee's salary-related information.

---

## 5. Salary Management

The application extends employee management with salary-specific information.

Salary records can include:

* Employee ID
* Employee name
* Department
* CTC
* Salary amount
* Currency
* Bank
* Branch
* Account-related information
* Salary month
* Payment status
* Paid amount
* Salary components where applicable

The structure is designed around common HR salary-management workflows rather than attempting to implement every possible payroll rule.

---

## 6. Salary History

The system maintains previous salary information for employees.

HR can use the employee detail page to review salary-related history instead of maintaining separate historical Excel files.

This makes it easier to understand changes in an employee's salary over time.

---

## 7. Monthly Salary Sheet

HR can create and manage a monthly salary sheet.

The salary sheet contains employee-level payroll information such as:

| Field          | Description                     |
| -------------- | ------------------------------- |
| Employee ID    | Unique employee identifier      |
| Employee Name  | Employee name                   |
| Department     | Employee department             |
| CTC            | Annual compensation information |
| Salary Amount  | Salary for the selected period  |
| Currency       | Salary currency                 |
| Bank           | Employee bank                   |
| Branch         | Bank branch                     |
| Paid Amount    | Amount processed                |
| Payment Status | Paid / Unpaid                   |
| Salary Month   | Payroll period                  |

This provides HR with a centralized monthly payroll view.

---

## 8. Excel Import

Since the original HR workflow is based on Excel, the application supports importing employee and salary information from Excel files.

The import workflow allows HR to move data from existing Excel-based processes into the web application.

Supported employee import fields include information such as:

* Employee ID
* First name
* Last name
* Email
* Phone
* Job title
* Department
* Country
* Currency
* Salary
* Hire date
* Status

Salary-related Excel data can also be imported into the salary management workflow.

---

## 9. Salary Slip Generation

HR can generate an individual salary slip for an employee.

The salary slip contains relevant employee and salary information and can be downloaded for use outside the application.

This provides an alternative to manually preparing individual salary documents.

### Salary Slip Portal

The application includes an HR workflow for generating and downloading individual salary slips.

---

## 10. Global Employee Distribution

The dashboard provides a global distribution view of employees.

Countries with employee records are represented on the world map.

The map can provide information such as:

* Employee count by country
* Percentage distribution by country

This helps HR understand the geographical distribution of the workforce.

---

# Product Scope

### Included

* Employee management
* Employee search
* Employee filtering
* Employee pagination
* Employee details
* Salary information
* Salary history
* Monthly salary sheets
* Salary payment status
* Excel import
* Salary slip generation
* Salary slip download
* Country/global distribution
* Dashboard analytics
* Seed data for 10,000 employees
* REST APIs
* Automated tests
* Production deployment

### Deliberately Left Out

The following features are intentionally outside the current scope:

* Full accounting system
* Tax filing
* Statutory compliance automation
* Direct bank payment processing
* Attendance management
* Leave management
* Recruitment/ATS workflows
* Performance management
* Employee self-service mobile application
* Complex multi-country tax calculation
* Real-time banking integrations

### Reasoning

The assessment focuses on solving the core problem of **salary data management for HR**.

Implementing a complete payroll, accounting, banking, tax, attendance, and HRMS platform would significantly increase complexity without directly improving the primary workflow being evaluated.

The current scope therefore focuses on the highest-value HR salary-management workflows while leaving complex integrations and compliance systems outside the initial product boundary.

---

# Technical Architecture

```text
                    ┌──────────────────────────┐
                    │        HR Manager        │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       React.js UI        │
                    │                          │
                    │ Dashboard                │
                    │ Employees                │
                    │ Salary Management        │
                    │ Salary Sheets            │
                    │ Salary Slips             │
                    │ Excel Import             │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Django + DRF        │
                    │                          │
                    │ API Layer                │
                    │ Business Logic           │
                    │ Validation               │
                    │ Authentication           │
                    │ Salary Management        │
                    └────────────┬─────────────┘
                                 │
                             Django ORM
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       PostgreSQL         │
                    │                          │
                    │ Employees                │
                    │ Salary Records           │
                    │ Salary History           │
                    │ Payroll Records          │
                    └──────────────────────────┘
```

---

# Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* Responsive UI
* Reusable React components

## Backend

* Python
* Django
* Django REST Framework
* REST APIs
* Django ORM

## Database

* PostgreSQL
* Supabase PostgreSQL for hosted deployment

SQLite can be used for local development when a PostgreSQL connection is not configured.

## Data & Documents

* Excel import/export
* Salary sheet processing
* Salary slip generation

## Deployment

* Render
* Supabase PostgreSQL

## Development Tools

* Git
* GitHub
* Postman
* VS Code
* AI-assisted development tools

---

# Project Structure

```text
acme-salary-manager/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   └── employees/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── tests.py
│       └── management/
│           └── commands/
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── public/
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── ai-usage.md
│   ├── tradeoffs.md
│   └── performance.md
│
└── README.md
```

---

# API Architecture

The frontend communicates with Django through REST APIs.

Example API areas include:

```text
/api/employees/
/api/employees/<id>/
/api/dashboard/
/api/salary/
/api/payroll/
/api/salary-slips/
/api/import/
```

The API layer is responsible for:

* Request validation
* Business logic
* Database operations
* Serialization
* Error handling
* Data retrieval and updates

---

# Environment Configuration

Sensitive configuration is stored using environment variables rather than committed to source control.

## Backend

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=your-postgresql-database-url
ALLOWED_HOSTS=your-backend-domain
CORS_ALLOWED_ORIGINS=your-frontend-domain
CSRF_TRUSTED_ORIGINS=your-frontend-domain
```

## Frontend

Example:

```env
VITE_API_URL=https://your-backend-domain/api
```

Environment files containing credentials are excluded from Git.

---

# Database Design

The application uses a relational database because employee and salary information has clear relationships.

The database is designed around entities such as:

```text
Employee
   │
   ├──────── Salary Records
   │
   ├──────── Salary History
   │
   └──────── Payroll Records
```

A relational database provides:

* Structured relationships
* Data consistency
* Querying and filtering
* Transaction support
* Scalability for the target dataset

The application is seeded with **10,000 employees** to demonstrate behavior against a realistic dataset size.

---

# Seeding

The project includes a Django seed command for generating employee data.

Example:

```bash
python manage.py seed_employees --count 10000
```

The seed data is deterministic so that development and testing can use repeatable data.

The seed process is designed to support development and demonstration without requiring manual entry of thousands of employees.

---

# Testing

The project includes automated tests covering important application behavior.

Testing focuses on:

* Employee creation
* Employee retrieval
* API validation
* Employee search
* Employee filtering
* Salary-related operations
* Core business logic
* API responses

Tests are designed to be:

* Fast
* Deterministic
* Easy to understand
* Independent where possible

Backend tests can be executed using:

```bash
pytest
```

Frontend tests can be executed using:

```bash
npm run test
```

---

# Performance Considerations

The application is designed around the target dataset of approximately **10,000 employees**.

Key considerations include:

### Pagination

Employee data is paginated rather than loading all employee records into the browser at once.

### Filtering

Search and filtering are used to reduce the amount of data returned to the UI.

### Database Queries

Database access is handled through Django ORM and can be optimized using appropriate filtering, indexing, and query patterns.

### Frontend Components

The React application uses reusable components so individual UI sections can be maintained independently.

### Salary Analytics

Salary information across multiple countries requires care when dealing with currencies. Raw salary amounts in different currencies should not be directly averaged or treated as the same unit.

---

# AI-Assisted Development

AI tools were intentionally used throughout development to accelerate implementation while keeping engineering decisions under human review.

AI assistance was used for areas such as:

* Initial project planning
* Architecture discussions
* Component design
* API implementation
* Debugging
* Test generation
* Refactoring
* Documentation
* Deployment troubleshooting
* Reviewing trade-offs

The development process involved validating generated code, testing functionality locally, debugging issues, and making implementation decisions based on the application's requirements.

Supporting AI prompts and development notes are included in the project artifacts.

---

# Engineering & Product Decisions

## Why React + Django?

React provides a component-based UI suitable for a dashboard-heavy HR application.

Django and Django REST Framework provide:

* Strong Python ecosystem
* ORM support
* API development
* Validation
* Mature backend architecture

This combination also aligns with the Python Full Stack development role.

## Why PostgreSQL?

Employee and salary information is relational and requires consistent relationships between employees, salary records, payroll records, and historical data.

PostgreSQL provides a reliable relational database for the deployed application.

## Why Excel Import?

Excel is part of the existing HR workflow described in the problem statement.

Supporting Excel import allows HR to transition existing data into the web application without manually entering thousands of records.

## Why Not Build a Complete Payroll System?

The assessment is focused on salary data management.

A complete payroll system would require substantial additional functionality such as tax calculations, statutory compliance, payment processing, attendance, leave, and country-specific payroll rules.

Those areas are intentionally outside the initial scope.

---

# Deployment

The application is deployed using Render and Supabase PostgreSQL.

## Backend

Typical Render build configuration:

```text
Build Command:

pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

The Django application is deployed as a Render web service.

## Frontend

Typical build configuration:

```text
Build Command:

npm install && npm run build
```

The React application is deployed as a Render static site.

## Database

Production database:

```text
Supabase PostgreSQL
```

The database connection is configured using the `DATABASE_URL` environment variable.

---

# Application Flow

```text
                    HR Manager
                         │
                         ▼
                 React Web Application
                         │
             ┌───────────┼────────────┐
             │           │            │
             ▼           ▼            ▼
        Employees     Salaries    Salary Sheets
             │           │            │
             └───────────┼────────────┘
                         ▼
                  Django REST API
                         │
                         ▼
                    PostgreSQL
                         │
             ┌───────────┼────────────┐
             │           │            │
             ▼           ▼            ▼
        Employee Data  Salary Data  Payroll Data
                         │
                         ▼
                   Salary Slip
                    Generation
```

---

# Development Approach

The project was developed incrementally rather than building the entire application as one large change.

The development process includes incremental commits covering areas such as:

```text
Project setup
    ↓
Employee model
    ↓
Employee APIs
    ↓
Seed 10,000 employees
    ↓
Employee tests
    ↓
Dashboard
    ↓
Employee management UI
    ↓
Salary management
    ↓
Salary sheets
    ↓
Salary slip generation
    ↓
Excel import
    ↓
Performance improvements
    ↓
Deployment
    ↓
Documentation
```

This approach makes the evolution of the solution easier to review through Git history.

---

# Assessment Artifacts

The repository includes supporting artifacts describing the development approach.

Recommended artifacts:

```text
docs/
├── requirements.md
├── architecture.md
├── ai-usage.md
├── tradeoffs.md
└── performance.md
```
---

# Screenshots

## Salary Slip

![Salary Slip](https://github.com/user-attachments/assets/34c620a8-aec2-4013-b211-2990d10eeed4)

## Application Dashboard

![Dashboard](https://github.com/user-attachments/assets/fd2ca182-3d72-44c0-8d34-6efe16558d05)

## Employee Management

![Employee Management](https://github.com/user-attachments/assets/14d95180-bc16-41af-b9ea-657eb8854a60)

## Add Employee 

![Salary Management](https://github.com/user-attachments/assets/245948b9-5cb7-46df-969d-5a23d65912fc)

## Salary Sheet

![Salary Sheet](https://github.com/user-attachments/assets/a4b5929e-ad08-438f-94e9-be3a59fbf7b3)

## Employee Report

![Employee Details](https://github.com/user-attachments/assets/fc13f3a2-9c3f-4841-9269-fcd52d6cf84d)

## Employee Details

![Global Distribution](https://github.com/user-attachments/assets/ab45cbdf-362d-4cd4-9172-4f1aa3402d19)

## Settings

![Salary Slip Generation](https://github.com/user-attachments/assets/d37e8e31-0c90-40cb-a429-13299b2bede8)

---

# Future Improvements

The following improvements could be considered in future iterations:

* Advanced payroll rules
* Country-specific tax calculations
* Role-based HR permissions
* Audit logs
* Bulk salary updates
* Scheduled payroll processing
* Advanced salary analytics
* Employee self-service portal
* Notifications
* Automated CI/CD
* Monitoring and observability
* Background processing for large imports
* More advanced reporting

These are intentionally not part of the current assessment scope to keep the solution focused on the core HR salary-management problem.

---

# Author

**Saurabh Waghmare**

Python Full Stack Developer

---
