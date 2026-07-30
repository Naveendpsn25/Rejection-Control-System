from rest_framework import serializers

from .models import SystemSettings


class SystemSettingsSerializer(serializers.ModelSerializer):

    class Meta:

        model = SystemSettings

        fields = [
            "id",
            "escalation_limit",
        ]


    def validate_escalation_limit(self, value):

        if value <= 0:

            raise serializers.ValidationError(
                "Escalation limit must be greater than 0."
            )

        if value > 100:

            raise serializers.ValidationError(
                "Escalation limit cannot exceed 100."
            )

        return value