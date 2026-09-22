from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Employee, SalaryRecord, SalaryRevision

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField(write_only=True, max_length=150)
    class Meta:
        model = User
        fields = ("name", "email", "password")
    def validate_name(self, value):
        value = " ".join(value.strip().split())
        if len(value) < 2: raise serializers.ValidationError("Please enter your full name.")
        return value
    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(username__iexact=email).exists() or User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email already exists. Please sign in.")
        return email
    def validate_password(self, value):
        validate_password(value); return value
    def create(self, validated_data):
        name = validated_data.pop("name"); first, *rest = name.split(); last = " ".join(rest)
        email = validated_data["email"]
        return User.objects.create_user(username=email, email=email, password=validated_data["password"], first_name=first, last_name=last)


class MeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ("id", "email", "name")
    def get_name(self, obj): return obj.get_full_name() or obj.email.split("@")[0]


class SalaryRevisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryRevision
        fields = ["id", "effective_date", "previous_ctc", "new_ctc", "currency", "reason", "created_at"]


class SalaryRecordSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee_name_snapshot", read_only=True)
    employee_code = serializers.CharField(source="employee_id_snapshot", read_only=True)
    class Meta:
        model = SalaryRecord
        fields = [
            "id", "employee", "employee_code", "employee_name", "pay_month", "ctc", "department", "currency",
            "bank_name", "bank_branch", "bank_account_last4", "working_days", "paid_days", "basic_pay", "hra",
            "allowances", "bonus", "overtime", "gross_pay", "pf_amount", "professional_tax", "income_tax",
            "other_deductions", "total_deductions", "net_pay", "payment_status", "paid_date", "created_at", "updated_at",
        ]


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    salary = serializers.DecimalField(source="annual_salary", max_digits=14, decimal_places=2)
    salary_history = SalaryRevisionSerializer(source="salary_revisions", many=True, read_only=True)
    recent_salary_records = serializers.SerializerMethodField()
    class Meta:
        model = Employee
        fields = [
            "id", "employee_id", "first_name", "last_name", "full_name", "email", "phone", "job_title", "department",
            "country", "currency", "salary", "hire_date", "status", "source", "bank_name", "bank_branch",
            "bank_account_last4", "notes", "salary_history", "recent_salary_records", "created_at", "updated_at",
        ]
    def get_recent_salary_records(self, obj):
        return SalaryRecordSerializer(obj.salary_records.all()[:12], many=True).data
    def validate_email(self, value):
        qs = Employee.objects.filter(email__iexact=value)
        if self.instance: qs = qs.exclude(pk=self.instance.pk)
        if qs.exists(): raise serializers.ValidationError("An employee with this email already exists.")
        return value.lower()
    def validate_employee_id(self, value):
        qs = Employee.objects.filter(employee_id__iexact=value)
        if self.instance: qs = qs.exclude(pk=self.instance.pk)
        if qs.exists(): raise serializers.ValidationError("Employee ID already exists.")
        return value.upper()
    def create(self, validated_data):
        employee = super().create(validated_data)
        SalaryRevision.objects.create(
            employee=employee, effective_date=employee.hire_date, previous_ctc=0,
            new_ctc=employee.annual_salary, currency=employee.currency, reason="Initial salary",
        )
        return employee
    def update(self, instance, validated_data):
        old_salary = instance.annual_salary
        old_currency = instance.currency
        employee = super().update(instance, validated_data)
        if employee.annual_salary != old_salary or employee.currency != old_currency:
            SalaryRevision.objects.create(
                employee=employee, effective_date=employee.updated_at.date(), previous_ctc=old_salary,
                new_ctc=employee.annual_salary, currency=employee.currency, reason="Salary revision",
            )
        return employee


class EmployeeImportSerializer(serializers.Serializer):
    file = serializers.FileField()
