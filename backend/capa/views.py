from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import CAPA, CAPAStatus, ApprovalStatus
from rejections.models import RejectionStatus
from .serializers import CAPASerializer,CAPASubmitSerializer,CAPAApprovalSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from accounts.models import UserRole


class CAPAListAPIView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = CAPASerializer

    queryset = CAPA.objects.select_related(
        "rejection_entry",
        "rejection_entry__department",
        "rejection_entry__defect_type",
    ).order_by("-created_at")



class CAPACountAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        count = CAPA.objects.filter(
            status=CAPAStatus.OPEN,
        ).count()

        return Response(
            {
                "count": count,
            }
        )


class CAPASubmitAPIView(RetrieveUpdateAPIView):

    queryset = CAPA.objects.all()

    serializer_class = CAPASubmitSerializer

    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(
            assigned_to=self.request.user
        )


class CAPAApprovalAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        print("========== APPROVAL API CALLED ==========")

        if request.user.role != UserRole.SUPERVISOR:
            return Response(
                {
                    "detail": "Only supervisors can approve CAPA."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CAPAApprovalSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        capa = get_object_or_404(CAPA,pk=pk,)

        action = serializer.validated_data["action"]

        if action == "APPROVE":

            capa.approval_status = ApprovalStatus.SUPERVISOR_APPROVED

            capa.rejection_entry.status = RejectionStatus.APPROVED
            capa.rejection_entry.save()

        else:

            capa.approval_status = ApprovalStatus.REJECTED

            capa.rejection_entry.status = RejectionStatus.REJECTED
            capa.rejection_entry.save()

        if action == "APPROVE":

            capa.approval_status = ApprovalStatus.SUPERVISOR_APPROVED

            capa.rejection_entry.status = RejectionStatus.APPROVED

        else:

            capa.approval_status = ApprovalStatus.REJECTED

            capa.rejection_entry.status = RejectionStatus.REJECTED

        capa.approved_by = request.user
        capa.approved_at = timezone.now()

        capa.save()
        capa.rejection_entry.save()

        capa.approved_by = request.user
        capa.approved_at = timezone.now()

        capa.save()
        capa.rejection_entry.save()

        # print("CAPA Approval API Called")
        # print("Action:", action)
        # print("Before:", capa.rejection_entry.status)

        return Response(
            {
                "message": f"CAPA {action.lower()}d successfully."
            }
        )



class PlantHeadCAPAApprovalAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if request.user.role != UserRole.PLANT_HEAD:
            return Response(
                {
                    "detail": "Only Plant Head can approve CAPA."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CAPAApprovalSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        capa = get_object_or_404(
            CAPA,
            pk=pk,
        )

        action = serializer.validated_data["action"]

        if capa.approval_status != ApprovalStatus.SUPERVISOR_APPROVED:

            return Response(
                {
                    "detail": (
                        "Only supervisor approved CAPAs "
                        "can be reviewed by Plant Head."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == "APPROVE":

            capa.approval_status = ApprovalStatus.APPROVED

        else:

            capa.approval_status = ApprovalStatus.REJECTED


class CAPAApprovalAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if request.user.role != UserRole.SUPERVISOR:
            return Response(
                {
                    "detail": "Only supervisors can approve CAPA."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CAPAApprovalSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        capa = get_object_or_404(
            CAPA,
            pk=pk,
        )

        action = serializer.validated_data["action"]

        if action == "APPROVE":

            capa.approval_status = ApprovalStatus.APPROVED

            capa.rejection_entry.status = RejectionStatus.APPROVED

        else:

            capa.approval_status = ApprovalStatus.REJECTED

            capa.rejection_entry.status = RejectionStatus.REJECTED

        capa.approved_by = request.user
        capa.approved_at = timezone.now()

        capa.save()
        capa.rejection_entry.save()

        return Response(
            {
                "message": f"CAPA {action.lower()}d successfully."
            }
        )

