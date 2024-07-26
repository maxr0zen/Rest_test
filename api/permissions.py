from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model


class SessionIdPermission(BasePermission):
    def has_permission(self, request, view):
        session_id = request.headers.get('Authorization', '').replace('Token ', '')
        if not session_id:
            return False

        User = get_user_model()
        try:
            user = User.objects.get(session_id=session_id)
        except User.DoesNotExist:
            return False

        request.user = user
        return True