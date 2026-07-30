from django.urls import path

from .views import SystemSettingsAPIView


urlpatterns = [
    path("",SystemSettingsAPIView.as_view(),name="system-settings",),
]