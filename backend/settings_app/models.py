from django.conf import settings
from django.db import models

from common.base_model import BaseModel


class SystemSettings(BaseModel):
    escalation_limit = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=3.00,
        help_text="Maximum allowed rejection percentage before CAPA is required."
    )

    capa_submission_days = models.PositiveIntegerField(
        default=3,
        help_text="Number of days allowed to submit CAPA."
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_system_settings",
    )

    class Meta:
        db_table = "system_settings"
        verbose_name = "System Settings"
        verbose_name_plural = "System Settings"

    def __str__(self):
        return "System Settings"