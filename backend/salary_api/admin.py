from django.contrib import admin
from .models import Employee, SalaryRecord, SalaryRevision

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("employee_id", "full_name", "department", "country", "currency", "annual_salary", "status")
    search_fields = ("employee_id", "first_name", "last_name", "email", "phone")
    list_filter = ("department", "country", "currency", "status", "source")

@admin.register(SalaryRevision)
class SalaryRevisionAdmin(admin.ModelAdmin):
    list_display = ("employee", "effective_date", "previous_ctc", "new_ctc", "currency", "reason")
    search_fields = ("employee__employee_id", "employee__first_name", "employee__last_name")
    list_filter = ("currency",)

@admin.register(SalaryRecord)
class SalaryRecordAdmin(admin.ModelAdmin):
    list_display = ("pay_month", "employee_id_snapshot", "employee_name_snapshot", "ctc", "gross_pay", "net_pay", "payment_status")
    search_fields = ("employee_id_snapshot", "employee_name_snapshot", "department")
    list_filter = ("payment_status", "currency", "department", "pay_month")
