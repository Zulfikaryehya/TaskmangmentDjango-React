from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializer import TaskSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from .logs.utils import log_activity
# Create your views here.


class TaskListAPIView(APIView):
    permission_classes = [IsAuthenticated]
# get the tasks created by the logged-in user

    def get(self, request):
        tasks = Task.objects.filter(            # pylint: disable=no-member
            created_by=request.user)  # pylint: disable=no-member

        # get the status query parameter from the request if any
        status_param = request.query_params.get("status", None)

        if status_param:
            tasks = tasks.filter(status=status_param)
        serializer = TaskSerializer(tasks, many=True,)
        return Response(serializer.data)
# create a new task

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save(created_by=request.user)
            log_activity(self.request.user, "created task", task.id)
            # serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]  # optional
# helper method to get the task object

    def get_object(self, pk, user):
        try:
            return Task.objects.get(pk=pk, created_by=user)  # pylint: disable=no-member
        except Task.DoesNotExist:  # pylint: disable=no-member
            return None
# retrieve, update, delete a task by id

# get a task
    def get(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

# update a task
    def put(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            task2 = serializer.save()
            log_activity(self.request.user, "updated task", task2.id)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# partial update

    def patch(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        print("Received data:", request.data)

        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            task2 = serializer.save()
            log_activity(self.request.user, "updated task", task2.id)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# delete a task
    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        log_activity(self.request.user, "deleted task", task.id)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
