from rest_framework.permissions import BasePermission

from accounts.models import UserRole


class IsSupervisor(BasePermission):
    """
    Allows access only to authenticated users whose role is SUPERVISOR.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.SUPERVISOR
        )