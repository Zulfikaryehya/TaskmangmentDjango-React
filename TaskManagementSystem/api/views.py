from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Task, Team, TeamMembership, User
from .serializer import TaskSerializer, RegisterSerializer, ProfileSerializer, TeamCreateSerializer
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


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile  # pylint: disable=no-member
        profile_data = {
            "username": request.user.username,
            "email": request.user.email,
            "phone": profile.phone,
            "bio": profile.bio,

        }
        return Response(profile_data)

    def patch(self, request):
        profile = request.user.profile  # pylint: disable=no-member
        serializer = ProfileSerializer(
            profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def role_in_team(user, team):
    try:
        membership = TeamMembership.objects.get(  # pylint: disable=no-member
            team=team, user=user)
        return membership.role_in_team
    except TeamMembership.DoesNotExist:  # pylint: disable=no-member
        return None


class MyTeamsView(APIView):
    permission_classes = [IsAuthenticated]
    # get the teams the logged-in user is a member of

    def get(self, request):
        user = request.user
        teams = Team.objects.filter(  # pylint: disable=no-member
            memberships__user=user)
        data = [{
            "id": team.id,
            "name": team.name,
            "description": team.description
        } for team in teams]

        return Response(data)


def check_superuser(request):
    return request.user.is_superuser


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_team(request):

    if not check_superuser(request):
        return Response({"error": "Only admins can create teams"}, status=status.HTTP_403_FORBIDDEN)

    serializer = TeamCreateSerializer(
        data=request.data, context={'request': request})

    if serializer.is_valid():
        team = serializer.save()
        return Response({
            "message": "Team created successfully",
            "team_id": team.id
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# should use serializer for adding member to team


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member_to_team(request, team_id):
    # Get the team
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

# Check if the requesting user is an admin of the team
    if role_in_team(request.user, team) != "owner":
        return Response({"error": "Only team admins can add members"}, status=status.HTTP_403_FORBIDDEN)

    username = request.data.get("username", None)
    if not username:
        return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

# Get the user to be added
    try:
        user_to_add = User.objects.get(  # pylint: disable=no-member
            username=username)
    except User.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user is already a member
    if TeamMembership.objects.filter(team=team, user=user_to_add).exists():  # pylint: disable=no-member
        return Response({"error": "User is already a member of the team"}, status=status.HTTP_400_BAD_REQUEST)

    # Add the user to the team
    TeamMembership.objects.create(  # pylint: disable=no-member
        team=team,
        user=user_to_add,
        role_in_team="member"
    )

    return Response({"message": f"User {username} added to team {team.name}"}, status=status.HTTP_200_OK)


# function that gets all users not in a team so they can be added
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_not_in_team(request, team_id):
    # Get the team
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the requesting user is a member of the team
    if role_in_team(request.user, team) not in ["leader", "owner", "member"]:
        return Response({"error": "You must be a team member to view available users"}, status=status.HTTP_403_FORBIDDEN)

    # Get all user IDs that are already in the team
    members = TeamMembership.objects.filter(team=team).values_list(  # pylint: disable=no-member
        'user_id', flat=True)

    # Get all users excluding current team members
    available_users = User.objects.exclude(
        id__in=members)  # pylint: disable=no-member

    # Serialize the user data
    users_data = [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    } for user in available_users]

    return Response({
        "team_id": team.id,
        "team_name": team.name,
        "available_users": users_data,
        "count": len(users_data)
    }, status=status.HTTP_200_OK)
