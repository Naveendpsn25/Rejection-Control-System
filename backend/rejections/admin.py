from django.contrib import admin

from .models import (
    Department,
    Shift,
    Part,
    Operation,
    DefectType,
    RejectionEntry,
)

admin.site.register(Department)
admin.site.register(Shift)
admin.site.register(Part)
admin.site.register(Operation)
admin.site.register(DefectType)
admin.site.register(RejectionEntry)