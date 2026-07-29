from django.conf import settings
from django.db import models

from common.base_model import BaseModel


class ApprovalLevel(models.TextChoices):
    SUPERVISOR = "SUPERVISOR", "Supervisor"
    HOD = "HOD", "HOD"
    QUALITY_HEAD = "QUALITY_HEAD", "Quality Head"
    PLANT_HEAD = "PLANT_HEAD", "Plant Head"


class ApprovalStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"


class Approval(BaseModel):
    approval_level = models.CharField(
        max_length=30,
        choices=ApprovalLevel.choices,
    )

    rejection_entry = models.ForeignKey(
        "rejections.RejectionEntry",
        on_delete=models.CASCADE,
        related_name="approvals",
    )

    status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING,
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="approvals",
        null=True,
        blank=True,
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "approvals"
        ordering = ["created_at"]

    def __str__(self):
        return self.approval_level