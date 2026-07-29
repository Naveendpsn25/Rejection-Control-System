from urllib import request

from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import RejectionEntry
from .serializers import RejectionEntrySerializer


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RejectionEntrySerializer


from rest_framework.permissions import IsAuthenticated

from datetime import datetime


class RejectionEntryListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        slip_number = f"RS-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        serializer = RejectionEntrySerializer(data= request.data)

        if serializer.is_valid():
            rejection = serializer.save(
                created_by=request.user,
                slip_number=slip_number,
            )

            if rejection.rejection_percentage > 3:
                return Response(
                    {
                        "success": True,
                        "severity": "error",
                        "message": "Entry saved successfully. CAPA opened and approval process started because rejection exceeded the 3% limit.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {
                    "success": True,
                    "severity": "success",
                    "message": "Entry saved successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny

class RejectionEntryRetrieveUpdateDestroyAPIView(
    RetrieveUpdateDestroyAPIView
):

    queryset = RejectionEntry.objects.all()

    serializer_class = RejectionEntrySerializer

    permission_classes = [AllowAny]



from rest_framework.generics import ListAPIView

from .models import Department
from .serializers import DepartmentSerializer

from rest_framework.permissions import AllowAny
class DepartmentListAPIView(ListAPIView):

    permission_classes = [AllowAny]

    queryset = Department.objects.filter(
        is_active=True,
    ).order_by("department_name")

    serializer_class = DepartmentSerializer


from .models import Shift
from .serializers import ShiftSerializer


class ShiftListAPIView(ListAPIView):

    queryset = Shift.objects.filter(
        is_active=True,
    ).order_by("shift_code")

    serializer_class = ShiftSerializer



from .models import Part
from .serializers import PartSerializer


class PartListAPIView(ListAPIView):

    queryset = Part.objects.filter(
        is_active=True,
    ).order_by("part_number")

    serializer_class = PartSerializer


from .models import Operation
from .serializers import OperationSerializer


class OperationListAPIView(ListAPIView):

    queryset = Operation.objects.filter(
        is_active=True,
    ).order_by("operation_name")

    serializer_class = OperationSerializer


from .models import DefectType
from .serializers import DefectTypeSerializer


class DefectTypeListAPIView(ListAPIView):

    permission_classes = [AllowAny]

    queryset = DefectType.objects.filter(
        is_active=True,
    ).order_by("defect_name")

    serializer_class = DefectTypeSerializer