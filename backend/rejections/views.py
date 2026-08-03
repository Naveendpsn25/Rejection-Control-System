from datetime import datetime, timedelta

from django.utils import timezone

from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserRole
from capa.models import CAPA
from settings_app.models import SystemSettings

from .models import (
    Department,
    DefectType,
    Operation,
    Part,
    RejectionEntry,
    RejectionStatus,
    Shift,
)
from .serializers import (
    DefectTypeSerializer,
    DepartmentSerializer,
    OperationSerializer,
    PartSerializer,
    RejectionEntrySerializer,
    ShiftSerializer,
)


class RejectionEntryListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Operators see only their own entries.
        Other authenticated roles can see all entries.
        """
        if request.user.role == UserRole.OPERATOR:
            queryset = RejectionEntry.objects.filter(
                created_by=request.user
            ).order_by("-created_at")
        else:
            queryset = RejectionEntry.objects.all().order_by(
                "-created_at"
            )

        serializer = RejectionEntrySerializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):
        """
        Creates a rejection entry and checks it against the Supervisor's
        globally configured escalation limit.

        If rejection percentage is above that limit, a CAPA is created.
        """
        slip_number = (
            f"RS-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        )

        serializer = RejectionEntrySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        rejection = serializer.save(
            created_by=request.user,
            slip_number=slip_number,
        )

        # Uses the one global setting. Creates it with default 3.00 if absent.
        system_settings, _ = SystemSettings.objects.get_or_create()
        escalation_limit = system_settings.escalation_limit

        # Every created entry awaits Supervisor review.
        rejection.status = RejectionStatus.PENDING_SUPERVISOR
        rejection.save()

        is_escalated = (
            rejection.rejection_percentage > escalation_limit
        )

        if is_escalated:
            CAPA.objects.create(
                title=f"CAPA - {rejection.part_number}",
                rejection_entry=rejection,
                assigned_to=request.user,
                root_cause="",
                corrective_action="",
                preventive_action="",
                target_date=(
                    timezone.now().date() + timedelta(days=3)
                ),
            )

            return Response(
                {
                    "success": True,
                    "severity": "error",
                    "message": (
                        "Entry saved successfully. CAPA opened because "
                        f"rejection percentage exceeded the configured "
                        f"{escalation_limit}% escalation limit."
                    ),
                    "data": RejectionEntrySerializer(
                        rejection
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": True,
                "severity": "success",
                "message": (
                    "Entry saved successfully. Rejection percentage is "
                    f"within the configured {escalation_limit}% "
                    "escalation limit."
                ),
                "data": RejectionEntrySerializer(rejection).data,
            },
            status=status.HTTP_201_CREATED,
        )


class RejectionEntryRetrieveUpdateDestroyAPIView(
    RetrieveUpdateDestroyAPIView
):
    queryset = RejectionEntry.objects.all()
    serializer_class = RejectionEntrySerializer
    permission_classes = [AllowAny]


class DepartmentListAPIView(ListAPIView):
    permission_classes = [AllowAny]

    queryset = Department.objects.filter(
        is_active=True,
    ).order_by("department_name")

    serializer_class = DepartmentSerializer


class ShiftListAPIView(ListAPIView):
    queryset = Shift.objects.filter(
        is_active=True,
    ).order_by("shift_code")

    serializer_class = ShiftSerializer


class PartListAPIView(ListAPIView):
    queryset = Part.objects.filter(
        is_active=True,
    ).order_by("part_number")

    serializer_class = PartSerializer


class OperationListAPIView(ListAPIView):
    queryset = Operation.objects.filter(
        is_active=True,
    ).order_by("operation_name")

    serializer_class = OperationSerializer


class DefectTypeListAPIView(ListAPIView):
    permission_classes = [AllowAny]

    queryset = DefectType.objects.filter(
        is_active=True,
    ).order_by("defect_name")

    serializer_class = DefectTypeSerializer