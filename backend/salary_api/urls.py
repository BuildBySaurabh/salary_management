from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, SalaryRecordViewSet, dashboard_summary, me, register, report_summary

router = DefaultRouter()
router.register("employees", EmployeeViewSet, basename="employee")
router.register("salary-records", SalaryRecordViewSet, basename="salary-record")

urlpatterns = [
    path("auth/register/", register),
    path("auth/me/", me),
    path("dashboard/", dashboard_summary),
    path("reports/", report_summary),
    path("", include(router.urls)),
]
