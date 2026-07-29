from rest_framework.permissions import BasePermission

class HasRole(BasePermission):

    def has_permission(self, request, view):

        required_roles = getattr(view, "required_roles", [])

        if not required_roles:
            return True

        return request.user.role in required_roles