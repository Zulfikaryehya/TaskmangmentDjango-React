from django.urls import path
from . import views
from .logs.utils import ActivityLogView, check_superuser

urlpatterns = [
    # Task endpoints
    path('tasks/', views.TaskListAPIView.as_view(), name='get_tasks'),
    path("tasks/<int:pk>/", views.TaskDetailsAPIView.as_view(), name="create_task"),

    # User endpoints
    path("register/", views.RegisterView.as_view(), name="register"),
    path("profile/", views.UserProfileView.as_view(), name="user_profile"),

    # Logs endpoints
    path("logs/", ActivityLogView.as_view(), name="activity_logs"),
    path("check-superuser/", check_superuser, name="check_superuser"),

    # Team endpoints
    path("teams/", views.MyTeamsView.as_view(), name="my_teams"),
    path("teams/create/", views.create_team, name="create_team"),
    path("teams/<int:team_id>/add-member/",
         views.add_member_to_team, name="add_member_to_team"),
    path("teams/<int:team_id>/available-users/",
         views.get_users_not_in_team, name="available_users"),
]
