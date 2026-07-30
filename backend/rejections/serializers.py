from rest_framework import serializers

from .models import RejectionEntry


from rest_framework import serializers

from .models import RejectionEntry


class RejectionEntrySerializer(serializers.ModelSerializer):

    department_name = serializers.CharField(
        source="department.department_name",
        read_only=True,
    )

    defect_name = serializers.CharField(
        source="defect_type.defect_name",
        read_only=True,
    )

    class Meta:
        model = RejectionEntry

        fields = [
            "id",
            "slip_number",
            "entry_date",

            "department",
            "department_name",

            "part_number",
            "operation",

            "produced_quantity",
            "rejected_quantity",

            "defect_type",
            "defect_name",

            "remarks",
            "rejection_percentage",
            "status",
        ]

        read_only_fields = [
            "slip_number",
            "rejection_percentage",
            "status",
            "department_name",
            "defect_name",
        ]

    def validate(self, attrs):

        part_number = attrs.get("part_number")

        if RejectionEntry.objects.filter(
            part_number=part_number
        ).exists():

            raise serializers.ValidationError(
                {
                    "part_number":
                        "This part number already has a rejection entry."
                }
            )

        return attrs


from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = [
            "id",
            "department_code",
            "department_name",
        ]


from .models import Shift


class ShiftSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shift
        fields = [
            "id",
            "shift_code",
            "shift_name",
        ]


from .models import Part


class PartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Part
        fields = [
            "id",
            "part_number",
            "part_name",
        ]


from .models import Operation

class OperationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Operation
        fields = [
            "id",
            "operation_code",
            "operation_name",
        ]


from .models import DefectType


class DefectTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = DefectType
        fields = [
            "id",
            "defect_code",
            "defect_name",
        ]