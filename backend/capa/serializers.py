from rest_framework import serializers

from .models import CAPA,CAPAStatus


class CAPASerializer(serializers.ModelSerializer):

    department = serializers.CharField(
        source="rejection_entry.department.department_name",
        read_only=True,
    )

    defect_type = serializers.CharField(
        source="rejection_entry.defect_type.defect_name",
        read_only=True,
    )

    part_number = serializers.CharField(
        source="rejection_entry.part_number",
        read_only=True,
    )

    assigned_to_name = serializers.CharField(
        source="assigned_to.username",
        read_only=True,
    )

    approved_by_name = serializers.CharField(
        source="approved_by.username",
        read_only=True,
    )

    class Meta:
        model = CAPA

        fields = [
            "id",
            "title",
            "department",
            "part_number",
            "defect_type",
            "target_date",
            "status",

            "root_cause",
            "corrective_action",
            "preventive_action",

            "assigned_to_name",

            "approval_status",
            "approved_by_name",
            "approved_at",

            "report",
        ]

class CAPASubmitSerializer(serializers.ModelSerializer):

    class Meta:
        model = CAPA
        fields = [
            "root_cause",
            "corrective_action",
            "preventive_action",
            "assigned_to",
            "target_date",
            "report",
        ]

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.status = CAPAStatus.IN_PROGRESS

        instance.save()

        return instance


class CAPAApprovalSerializer(serializers.Serializer):
    action = serializers.ChoiceField(
        choices=["APPROVE", "REJECT"]
    )