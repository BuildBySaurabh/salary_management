import calendar
from datetime import date
from decimal import Decimal, ROUND_HALF_UP

MONEY = Decimal("0.01")


def money(value):
    return Decimal(value).quantize(MONEY, rounding=ROUND_HALF_UP)


def working_days(year, month):
    last = calendar.monthrange(year, month)[1]
    return sum(1 for day in range(1, last + 1) if date(year, month, day).weekday() < 5)


def calculate_salary(employee, year, month, paid_days=None):
    ctc = money(Decimal(employee.annual_salary) / Decimal("12"))
    basic = money(ctc * Decimal("0.50"))
    hra = money(basic * Decimal("0.40"))
    allowances = money(ctc - basic - hra)
    bonus = Decimal("0.00")
    overtime = Decimal("0.00")
    gross = money(basic + hra + allowances + bonus + overtime)

    days = working_days(year, month)
    paid = days if paid_days is None else max(0, min(days, int(paid_days)))
    attendance_factor = Decimal(paid) / Decimal(days or 1)
    if paid != days:
        gross = money(gross * attendance_factor)
        basic = money(basic * attendance_factor)
        hra = money(hra * attendance_factor)
        allowances = money(allowances * attendance_factor)

    if employee.currency == "INR":
        pf = min(money(basic * Decimal("0.12")), Decimal("1800.00"))
        professional_tax = Decimal("200.00") if gross > 0 else Decimal("0.00")
        income_tax = money(gross * Decimal("0.05"))
    else:
        pf = money(basic * Decimal("0.05"))
        professional_tax = Decimal("0.00")
        income_tax = money(gross * Decimal("0.05"))

    other = Decimal("0.00")
    deductions = money(pf + professional_tax + income_tax + other)
    net = money(max(Decimal("0.00"), gross - deductions))

    return {
        "ctc": ctc,
        "working_days": days,
        "paid_days": paid,
        "basic_pay": basic,
        "hra": hra,
        "allowances": allowances,
        "bonus": bonus,
        "overtime": overtime,
        "gross_pay": gross,
        "pf_amount": pf,
        "professional_tax": professional_tax,
        "income_tax": income_tax,
        "other_deductions": other,
        "total_deductions": deductions,
        "net_pay": net,
    }
