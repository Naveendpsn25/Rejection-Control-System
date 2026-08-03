from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import SystemSettings
from .serializers import SystemSettingsSerializer
from .permissions import IsSupervisor


class SystemSettingsAPIView(APIView):
    """
    GET:
        Any logged-in user can read the current escalation limit.
        Operators need this value on the rejection-entry screen.

    PATCH:
        Only a Supervisor can change the escalation limit.
    """

    def get_permissions(self):
        if self.request.method == "PATCH":
            return [IsAuthenticated(), IsSupervisor()]

        return [IsAuthenticated()]

    def get_settings(self):
        """
        Returns the one global settings record.
        If no record exists yet, creates one with the model default (3.00).
        """
        settings, _ = SystemSettings.objects.get_or_create()
        return settings

    def get(self, request):
        settings = self.get_settings()

        serializer = SystemSettingsSerializer(settings)

        return Response(serializer.data)

    def patch(self, request):
        settings = self.get_settings()

        serializer = SystemSettingsSerializer(
            settings,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save(updated_by=request.user)

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )