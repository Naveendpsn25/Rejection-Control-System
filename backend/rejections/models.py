from django.db import models

from common.base_model import BaseModel

from decimal import Decimal

from django.conf import settings

 
class Department(BaseModel):
    department_code = models.CharField(
        max_length=20,
        unique=True,
    )

    department_name = models.CharField(
        max_length=100,
        unique=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "departments"
        ordering = ["department_name"]
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return self.department_name



class Part(BaseModel):
    part_number = models.CharField(
        max_length=50,
        unique=True,
    )

    part_name = models.CharField(
        max_length=150,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "parts"
        ordering = ["part_number"]
        verbose_name = "Part"
        verbose_name_plural = "Parts"

    def __str__(self):
        return f"{self.part_number} - {self.part_name}"



class Operation(BaseModel):
    operation_code = models.CharField(
        max_length=20,
        unique=True,
    )

    operation_name = models.CharField(
        max_length=100,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "operations"
        ordering = ["operation_name"]
        verbose_name = "Operation"
        verbose_name_plural = "Operations"

    def __str__(self):
        return f"{self.operation_code} - {self.operation_name}"



class DefectType(BaseModel):
    defect_code = models.CharField(
        max_length=20,
        unique=True,
    )

    defect_name = models.CharField(
        max_length=100,
        unique=True,
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "defect_types"
        ordering = ["defect_name"]
        verbose_name = "Defect Type"
        verbose_name_plural = "Defect Types"

    def __str__(self):
        return f"{self.defect_code} - {self.defect_name}"



class Shift(models.TextChoices):
    SHIFT_A = "A", "Shift A"
    SHIFT_B = "B", "Shift B"
    SHIFT_C = "C", "Shift C"


class RejectionStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"

    PENDING_SUPERVISOR = (
        "PENDING_SUPERVISOR",
        "Pending Supervisor",
    )

    PENDING_HOD = (
        "PENDING_HOD",
        "Pending HOD",
    )

    PENDING_QUALITY_HEAD = (
        "PENDING_QUALITY_HEAD",
        "Pending Quality Head",
    )

    PENDING_PLANT_HEAD = (
        "PENDING_PLANT_HEAD",
        "Pending Plant Head",
    )

    APPROVED = "APPROVED", "Approved"

    REJECTED = "REJECTED", "Rejected"

    CLOSED = "CLOSED", "Closed"



class Shift(BaseModel):
    shift_code = models.CharField(
        max_length=20,
        unique=True,
    )

    shift_name = models.CharField(
        max_length=100,
        unique=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        db_table = "shifts"
        ordering = ["shift_code"]
        verbose_name = "Shift"
        verbose_name_plural = "Shifts"

    def __str__(self):
        return f"{self.shift_code} - {self.shift_name}"



class RejectionEntry(BaseModel):
    slip_number = models.CharField(
        max_length=30,
        unique=True,
    )

    entry_date = models.DateField()

    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name="rejection_entries",
    )

    part_number = models.CharField(max_length=100)

    operation = models.CharField(max_length=150)

    defect_type = models.ForeignKey(
        DefectType,
        on_delete=models.PROTECT,
        related_name="rejection_entries",
    )

    produced_quantity = models.PositiveIntegerField()

    rejected_quantity = models.PositiveIntegerField()

    rejection_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=RejectionStatus.choices,
        default=RejectionStatus.DRAFT,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_rejection_entries",
    )

    class Meta:
        db_table = "rejection_entries"
        ordering = ["-created_at"]
        verbose_name = "Rejection Entry"
        verbose_name_plural = "Rejection Entries"

    def save(self, *args, **kwargs):
        if self.produced_quantity > 0:
            self.rejection_percentage = (
                Decimal(self.rejected_quantity) * Decimal("100")
            ) / Decimal(self.produced_quantity)
        else:
            self.rejection_percentage = Decimal("0.00")

        super().save(*args, **kwargs)

    def __str__(self):
        return self.slip_number