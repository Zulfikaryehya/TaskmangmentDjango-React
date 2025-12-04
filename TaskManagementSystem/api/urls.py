from django.urls import path
from . import views
from .logs.utils import ActivityLogView, check_superuser

urlpatterns = [
    path('tasks/', views.TaskListAPIView.as_view(), name='get_tasks'),
    path("tasks/<int:pk>/", views.TaskDetailsAPIView.as_view(), name="create_task"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("logs/", ActivityLogView.as_view(), name="activity_logs"),
    path("check-superuser/", check_superuser, name="check_superuser"),
]
