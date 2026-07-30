from django.contrib.auth.models import AbstractUser
from django.db import models

from common.base_model import BaseModel


class UserRole(models.TextChoices):
    OPERATOR = "OPERATOR", "Operator"
    SUPERVISOR = "SUPERVISOR", "Supervisor"
    HOD = "HOD", "HOD"
    QUALITY_HEAD = "QUALITY_HEAD", "Quality Head"
    # PLANT_HEAD = "PLANT_HEAD", "Plant Head"
    STORES = "STORES", "Stores"


class User(AbstractUser, BaseModel):
    role = models.CharField(
        max_length=30,
        choices=UserRole.choices,
        default=UserRole.OPERATOR,
    )

    def __str__(self):
        return self.username