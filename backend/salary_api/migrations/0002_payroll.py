from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):
    dependencies = [("salary_api", "0001_initial")]
    operations = [
        migrations.AddField(model_name="employee", name="bank_name", field=models.CharField(blank=True, max_length=120)),
        migrations.AddField(model_name="employee", name="bank_branch", field=models.CharField(blank=True, max_length=120)),
        migrations.AddField(model_name="employee", name="bank_account_last4", field=models.CharField(blank=True, max_length=4)),
        migrations.CreateModel(
            name="SalaryRevision",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("effective_date", models.DateField()),
                ("previous_ctc", models.DecimalField(decimal_places=2, max_digits=14, validators=[django.core.validators.MinValueValidator(0)])),
                ("new_ctc", models.DecimalField(decimal_places=2, max_digits=14, validators=[django.core.validators.MinValueValidator(0)])),
                ("currency", models.CharField(max_length=3)),
                ("reason", models.CharField(default="Salary revision", max_length=200)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("employee", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="salary_revisions", to="salary_api.employee")),
            ],
            options={"ordering": ["-effective_date", "-id"]},
        ),
        migrations.AddIndex(model_name="salaryrevision", index=models.Index(fields=["employee", "effective_date"], name="salary_api_salaryre_employee_3c3bb4_idx")),
        migrations.CreateModel(
            name="SalaryRecord",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("pay_month", models.DateField(db_index=True)),
                ("employee_id_snapshot", models.CharField(max_length=20)),
                ("employee_name_snapshot", models.CharField(max_length=170)),
                ("ctc", models.DecimalField(decimal_places=2, max_digits=14, validators=[django.core.validators.MinValueValidator(0)])),
                ("department", models.CharField(max_length=80)),
                ("currency", models.CharField(max_length=3)),
                ("bank_name", models.CharField(blank=True, max_length=120)),
                ("bank_branch", models.CharField(blank=True, max_length=120)),
                ("bank_account_last4", models.CharField(blank=True, max_length=4)),
                ("working_days", models.PositiveSmallIntegerField(default=0)),
                ("paid_days", models.PositiveSmallIntegerField(default=0)),
                ("basic_pay", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("hra", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("allowances", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("bonus", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("overtime", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("gross_pay", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("pf_amount", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("professional_tax", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("income_tax", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("other_deductions", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("total_deductions", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("net_pay", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("payment_status", models.CharField(choices=[("paid","Paid"),("unpaid","Unpaid"),("processing","Processing")], db_index=True, default="unpaid", max_length=20)),
                ("paid_date", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("employee", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="salary_records", to="salary_api.employee")),
            ],
            options={"ordering": ["-pay_month", "employee_id_snapshot"]},
        ),
        migrations.AddConstraint(model_name="salaryrecord", constraint=models.UniqueConstraint(fields=("employee", "pay_month"), name="unique_employee_pay_month")),
        migrations.AddIndex(model_name="salaryrecord", index=models.Index(fields=["pay_month", "payment_status"], name="salary_api_pay_month_7c6f2d_idx")),
        migrations.AddIndex(model_name="salaryrecord", index=models.Index(fields=["employee", "pay_month"], name="salary_api_employee_0d4c36_idx")),
    ]
