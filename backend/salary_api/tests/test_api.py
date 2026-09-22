from datetime import date
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from salary_api.models import Employee, SalaryRecord, SalaryRevision

User = get_user_model()


class EmployeeApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="hr@example.com", email="hr@example.com", password="StrongPass123", first_name="Sarah", last_name="Johnson")
        self.employee = Employee.objects.create(employee_id="EMP00001", first_name="Aarav", last_name="Patel", email="aarav@example.com", phone="+91 9876543210", job_title="Software Engineer", department="Engineering", country="India", currency="INR", annual_salary=1200000, hire_date=date(2024,1,10), bank_name="HDFC Bank", bank_branch="Pune", bank_account_last4="1234")

    def auth(self):
        response = self.client.post("/api/token/", {"username":"hr@example.com","password":"StrongPass123"}, format="json")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_register_creates_account_and_returns_tokens(self):
        response = self.client.post("/api/auth/register/", {"name":"Sarah Johnson","email":"sarah@acme.com","password":"StrongPass123!"}, format="json")
        self.assertEqual(response.status_code, 201); self.assertIn("access", response.data); self.assertIn("refresh", response.data)

    def test_unauthenticated_employee_list_is_blocked(self):
        self.assertEqual(self.client.get("/api/employees/").status_code, 401)

    def test_authenticated_employee_list(self):
        self.auth(); response = self.client.get("/api/employees/")
        self.assertEqual(response.status_code, 200); self.assertEqual(response.data["count"], 1)

    def test_search_employee_by_name_and_phone(self):
        self.auth()
        self.assertEqual(self.client.get("/api/employees/?search=Aarav").data["count"], 1)
        self.assertEqual(self.client.get("/api/employees/?search=9876543210").data["count"], 1)

    def test_create_employee_creates_initial_salary_history(self):
        self.auth(); payload = {"employee_id":"EMP00002","first_name":"Sarah","last_name":"Lee","email":"sarah.lee@example.com","job_title":"HR Specialist","department":"HR","country":"USA","currency":"USD","salary":"85000","hire_date":"2025-03-01","status":"active","source":"manual"}
        response = self.client.post("/api/employees/", payload, format="json")
        self.assertEqual(response.status_code, 201); self.assertEqual(SalaryRevision.objects.filter(employee_id=response.data["id"]).count(), 1)

    def test_salary_generation_calculates_monthly_payroll(self):
        self.auth(); response = self.client.post("/api/salary-records/generate/", {"month":"2026-09"}, format="json")
        self.assertEqual(response.status_code, 200); record = SalaryRecord.objects.get(employee=self.employee, pay_month=date(2026,9,1))
        self.assertGreater(record.gross_pay, 0); self.assertGreater(record.net_pay, 0); self.assertEqual(record.payment_status, "unpaid")

    def test_employee_detail_contains_salary_history_and_records(self):
        self.auth(); self.client.post("/api/salary-records/generate/", {"month":"2026-09"}, format="json")
        response = self.client.get(f"/api/employees/{self.employee.id}/")
        self.assertEqual(response.status_code, 200); self.assertEqual(len(response.data["salary_history"]), 1); self.assertEqual(len(response.data["recent_salary_records"]), 1)

    def test_salary_slip_returns_pdf(self):
        self.auth(); self.client.post("/api/salary-records/generate/", {"month":"2026-09"}, format="json")
        record = SalaryRecord.objects.get(employee=self.employee, pay_month=date(2026,9,1))
        response = self.client.get(f"/api/salary-records/{record.id}/slip/")
        self.assertEqual(response.status_code, 200); self.assertEqual(response["Content-Type"], "application/pdf")

    def test_dashboard_summary(self):
        self.auth(); response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, 200); self.assertEqual(response.data["kpis"]["total_employees"], 1)
