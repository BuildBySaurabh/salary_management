from rest_framework.permissions import BasePermission

class IsHRManager(BasePermission):
    message = "Only authenticated HR managers can access salary data."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
