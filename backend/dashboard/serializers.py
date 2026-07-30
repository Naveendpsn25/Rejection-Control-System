from rest_framework import serializers


class DashboardSummarySerializer(serializers.Serializer):

    today_produced = serializers.IntegerField()
    today_rejected = serializers.IntegerField()
    rejection_percentage = serializers.FloatField()

    pending_supervisor = serializers.IntegerField()
    supervisor_approvals = serializers.IntegerField()

    capa_submission = serializers.IntegerField()
    capa_rejected = serializers.IntegerField()

    capa_open = serializers.IntegerField()

    trend = serializers.ListField()