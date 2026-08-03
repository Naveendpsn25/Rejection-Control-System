from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import DashboardSummarySerializer

from django.db.models import Sum
from django.utils import timezone

from capa.models import ApprovalStatus

from rejections.models import RejectionEntry
from capa.models import CAPA, CAPAStatus
from rejections.models import RejectionStatus
from settings_app.models import SystemSettings
from django.db.models.functions import TruncMinute

class DashboardSummaryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        today = timezone.now().date()

        today_entries = RejectionEntry.objects.filter(
            entry_date=today
        )

        today_produced = (
            today_entries.aggregate(
                total=Sum("produced_quantity")
            )["total"] or 0
        )

        today_rejected = (
            today_entries.aggregate(
                total=Sum("rejected_quantity")
            )["total"] or 0
        )

        if today_produced > 0:
            rejection_percentage = round((today_rejected / today_produced) * 100,2,)
        else:
            rejection_percentage = 0


        supervisor_approvals = RejectionEntry.objects.filter(
        status=RejectionStatus.APPROVED
    ).count()

        capa_open = CAPA.objects.filter(
            status=CAPAStatus.OPEN
        ).count()

        trend = []

        today_rejections = RejectionEntry.objects.filter(
            entry_date=today
        ).order_by("created_at")


        pending_supervisor = RejectionEntry.objects.filter(
            status=RejectionStatus.PENDING_SUPERVISOR
        ).count()

        for entry in today_rejections:

            trend.append(
                {
                    "time": entry.created_at.strftime("%H:%M"),
                    "rejection_percentage": float(
                        entry.rejection_percentage
                    ),
                }
            )


        capa_submission = CAPA.objects.filter(
            status=CAPAStatus.IN_PROGRESS,
            approval_status=ApprovalStatus.PENDING,
        ).count()

        capa_open = CAPA.objects.filter(
            status__in=[
                CAPAStatus.OPEN,
                CAPAStatus.IN_PROGRESS,
            ]
        ).count()

        capa_rejected = CAPA.objects.filter(
            approval_status=ApprovalStatus.REJECTED
        ).count()

        settings, _ = SystemSettings.objects.get_or_create()
        escalation_limit = settings.escalation_limit

        data = {
            "today_produced": today_produced,
            "today_rejected": today_rejected,
            "rejection_percentage": rejection_percentage,

            "escalation_limit": float(escalation_limit),
            "is_escalated": rejection_percentage > float(escalation_limit),

            "pending_supervisor": pending_supervisor,
            "supervisor_approvals": supervisor_approvals,

            "capa_submission": capa_submission,
            "capa_rejected": capa_rejected,

            "capa_open": capa_open,
            "trend": trend,
        }

        serializer = DashboardSummarySerializer(data)

        return Response(serializer.data)