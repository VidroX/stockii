from rest_framework.permissions import BasePermission, SAFE_METHODS


class SuperUserCreateOnly(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if request.method == "POST" or request.method == "PUT" or request.method == "DELETE":
            return user.is_superuser
        else:
            return request.method in SAFE_METHODS


class SuperUserDeleteOnly(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if request.method == "PUT" or request.method == "DELETE":
            return user.is_superuser
        else:
            return request.method in SAFE_METHODS
