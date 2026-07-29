from django.conf import settings
from django.db import models

from common.base_model import BaseModel


class StoresMovementStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    RECEIVED = "RECEIVED", "Received"
    RETURNED = "RETURNED", "Returned"
    SCRAPPED = "SCRAPPED", "Scrapped"


class StoresMovement(BaseModel):
    quantity = models.PositiveIntegerField()

    movement_date = models.DateField()

    rejection_entry = models.OneToOneField(
        "rejections.RejectionEntry",
        on_delete=models.CASCADE,
        related_name="stores_movement",
    )

    status = models.CharField(
        max_length=20,
        choices=StoresMovementStatus.choices,
        default=StoresMovementStatus.PENDING,
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="stores_movements",
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "stores_movements"
        ordering = ["-movement_date"]
        verbose_name = "Stores Movement"
        verbose_name_plural = "Stores Movements"

    def __str__(self):
        return f"{self.status} - {self.quantity}"