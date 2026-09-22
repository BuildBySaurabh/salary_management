# Architecture

```text
React + Vite
    |
    | JWT REST
    v
Django + Django REST Framework
    |
    +-- Authentication
    +-- Employee CRUD / filtering / pagination
    +-- Dashboard database aggregations
    +-- Report aggregations
    +-- Excel import / CSV export
    |
    v
PostgreSQL in production / SQLite locally
```

### Important decisions
- Django + DRF matches the Python full-stack role and gives a mature ORM, validation and testing stack.
- Salary records live in a relational database because filtering and aggregation are core workflows.
- Employee lists use server-side pagination so the browser does not load all 10,000 records.
- Dashboard and report values are calculated from the database rather than hard-coded in React.
- JWT is used because React and Django are separate applications.
- Excel is previewed in the browser before upload; the API validates again.
