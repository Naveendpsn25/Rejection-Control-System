from django.conf import settings
from django.db import models

from common.base_model import BaseModel


class CAPAStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
    OVERDUE = "OVERDUE", "Overdue"

class ApprovalStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"

    SUPERVISOR_APPROVED = (
        "SUPERVISOR_APPROVED",
        "Supervisor Approved",
    )

    APPROVED = "APPROVED", "Approved"

    REJECTED = "REJECTED", "Rejected"

class CAPA(BaseModel):
    title = models.CharField(
        max_length=200,
    )

    root_cause = models.TextField()

    corrective_action = models.TextField()

    preventive_action = models.TextField()

    target_date = models.DateField()

    completed_date = models.DateField(
        null=True,
        blank=True,
    )

    rejection_entry = models.OneToOneField(
        "rejections.RejectionEntry",
        on_delete=models.CASCADE,
        related_name="capa",
    )

    status = models.CharField(
        max_length=20,
        choices=CAPAStatus.choices,
        default=CAPAStatus.OPEN,
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="assigned_capas",
    )

    report = models.FileField(
        upload_to="capa_reports/",
        null=True,
        blank=True,
    )

    approval_status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING,
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_capas",
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "capa"
        ordering = ["-created_at"]
        verbose_name = "CAPA"
        verbose_name_plural = "CAPA"

    def __str__(self):
        return self.title