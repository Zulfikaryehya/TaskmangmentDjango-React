from django.urls import path
from . import views


urlpatterns = [
    path('tasks/', views.TaskListAPIView.as_view(), name='get_tasks'),
    path("tasks/<int:pk>/", views.TaskDetailsAPIView.as_view(), name="create_task"),
    path("register/", views.RegisterView.as_view(), name="register"),
]
