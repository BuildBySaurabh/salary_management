from django_filters import rest_framework as filters
from .models import Employee

class EmployeeFilter(filters.FilterSet):
    country = filters.CharFilter(field_name="country", lookup_expr="iexact")
    department = filters.CharFilter(field_name="department", lookup_expr="iexact")
    currency = filters.CharFilter(field_name="currency", lookup_expr="iexact")
    status = filters.CharFilter(field_name="status", lookup_expr="iexact")
    source = filters.CharFilter(field_name="source", lookup_expr="iexact")
    min_salary = filters.NumberFilter(field_name="annual_salary", lookup_expr="gte")
    max_salary = filters.NumberFilter(field_name="annual_salary", lookup_expr="lte")

    class Meta:
        model = Employee
        fields = ["country","department","currency","status","source","min_salary","max_salary"]
