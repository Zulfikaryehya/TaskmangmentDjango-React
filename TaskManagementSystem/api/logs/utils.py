from .models import ActivityLog

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes

# Utility function to log activity


def log_activity(user, action, task_id):
    ActivityLog(
        user=user.username,
        action=action,
        task_id=str(task_id)
    ).save()


class ActivityLogView(APIView):
    # Only superusers can access
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        logs = ActivityLog.objects.all()  # pylint: disable=no-member

        data = [
            {
                "user": log.user,
                "action": log.action,
                "task_id": log.task_id,
                "timestamp": log.timestamp.isoformat()
            }
            for log in logs
        ]
        return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_superuser(request):
    """Check if the current user is a superuser"""
    return Response({
        'is_superuser': request.user.is_superuser
    })
