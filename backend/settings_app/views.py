from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import SystemSettings
from .serializers import SystemSettingsSerializer

from .permissions import IsPlantHead

class SystemSettingsAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "PATCH":
            return [IsAuthenticated(), IsPlantHead()]

        return [IsAuthenticated()]

    def get(self, request):

        settings = SystemSettings.objects.first()

        serializer = SystemSettingsSerializer(settings)

        return Response(serializer.data)

    def patch(self, request):

        settings = SystemSettings.objects.first()

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