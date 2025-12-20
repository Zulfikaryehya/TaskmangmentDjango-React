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
    path("teams/<int:team_id>/members/",
         views.get_team_members, name="team_members"),

    # Team-based task management endpoints
    path("teams/<int:team_id>/details/",
         views.get_team_details, name="team_details"),
    path("teams/<int:team_id>/tasks/create/",
         views.create_team_task, name="create_team_task"),
    path("teams/<int:team_id>/tasks/my-tasks/",
         views.get_my_team_tasks, name="my_team_tasks"),
    path("teams/<int:team_id>/tasks/<int:task_id>/update-status/",
         views.update_team_task_status, name="update_team_task_status"),
    path("teams/<int:team_id>/tasks/<int:task_id>/delete/",
         views.delete_team_task, name="delete_team_task"),
    path("teams/<int:team_id>/members/<int:user_id>/tasks/",
         views.get_team_member_tasks, name="team_member_tasks"),
]
