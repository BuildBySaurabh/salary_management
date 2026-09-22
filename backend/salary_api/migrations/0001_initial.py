from django.db import migrations, models
import django.core.validators

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Employee",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("employee_id", models.CharField(db_index=True, max_length=20, unique=True)),
                ("first_name", models.CharField(max_length=80)),
                ("last_name", models.CharField(max_length=80)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("phone", models.CharField(blank=True, max_length=30)),
                ("job_title", models.CharField(max_length=120)),
                ("department", models.CharField(db_index=True, max_length=80)),
                ("country", models.CharField(db_index=True, max_length=80)),
                ("currency", models.CharField(db_index=True, max_length=3)),
                ("annual_salary", models.DecimalField(decimal_places=2, max_digits=14, validators=[django.core.validators.MinValueValidator(0)])),
                ("hire_date", models.DateField()),
                ("status", models.CharField(choices=[("active","Active"),("on_leave","On Leave"),("inactive","Inactive")], db_index=True, default="active", max_length=20)),
                ("source", models.CharField(choices=[("manual","Manual"),("import","Excel Import"),("seeded","Seed Data")], db_index=True, default="manual", max_length=20)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering":["employee_id"]},
        ),
        migrations.AddIndex(
            model_name="employee",
            index=models.Index(fields=["country","department"], name="salary_api_country_7d9c0f_idx"),
        ),
        migrations.AddIndex(
            model_name="employee",
            index=models.Index(fields=["currency","annual_salary"], name="salary_api_currency_7b6d0a_idx"),
        ),
    ]
