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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_members(request, team_id):
    """Get all members of a specific team"""
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if requesting user is a member
    if not TeamMembership.objects.filter(team=team, user=request.user).exists():  # pylint: disable=no-member
        return Response({"error": "You are not a member of this team"}, status=status.HTTP_403_FORBIDDEN)

    members = TeamMembership.objects.filter(  # pylint: disable=no-member
        team=team).select_related('user')  # pylint: disable=no-member

    members_data = [{
        "id": membership.user.id,
        "username": membership.user.username,
        "email": membership.user.email,
        "role": membership.role_in_team,
        "joined_at": membership.joined_at
    } for membership in members]

    return Response({
        "team_id": team.id,
        "team_name": team.name,
        "members": members_data,
        "count": len(members_data)
    }, status=status.HTTP_200_OK)


# ==========================================
# TEAM-BASED TASK MANAGEMENT VIEWS
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_details(request, team_id):
    """Get detailed information about a team including members and all tasks"""
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if user is a member
    user_role = role_in_team(request.user, team)
    if not user_role:
        return Response({"error": "You are not a member of this team"}, status=status.HTTP_403_FORBIDDEN)

    # Get all team members with their roles
    members = TeamMembership.objects.filter(  # pylint: disable=no-member
        team=team).select_related('user')  # pylint: disable=no-member
    members_data = [{
        "id": membership.user.id,
        "username": membership.user.username,
        "email": membership.user.email,
        "role": membership.role_in_team,
        "joined_at": membership.joined_at,
        "is_current_user": membership.user.id == request.user.id
    } for membership in members]

    # Get all tasks for this team
    team_tasks = Task.objects.filter(for_team=team).select_related(  # pylint: disable=no-member
        'created_by', 'assigned_to'
    ).order_by('-created_at')

    tasks_data = [{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": task.due_date,
        "created_by": {
            "id": task.created_by.id,
            "username": task.created_by.username
        },
        "assigned_to": {
            "id": task.assigned_to.id,
            "username": task.assigned_to.username
        } if task.assigned_to else None,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "is_assigned_to_me": task.assigned_to.id == request.user.id if task.assigned_to else False
    } for task in team_tasks]

    return Response({
        "team": {
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "created_at": team.created_at
        },
        "current_user_role": user_role,
        "is_owner": user_role == "owner",
        "members": members_data,
        "tasks": tasks_data,
        "total_tasks": len(tasks_data),
        "total_members": len(members_data)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_team_task(request, team_id):
    """Create a task for a team member (only team owner can do this)"""
    print("=== CREATE TEAM TASK DEBUG ===")
    print(f"Request data: {request.data}")
    print(f"Team ID: {team_id}")
    print(f"User: {request.user.username}")

    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if requesting user is the owner
    user_role = role_in_team(request.user, team)
    print(f"User role: {user_role}")

    if user_role != "owner":
        return Response(
            {"error": "Only team owners can create tasks for team members"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Get the username to assign to
    assigned_username = request.data.get('assigned_to')
    print(f"Assigned username: {assigned_username}")

    if not assigned_username:
        return Response(
            {"error": "assigned_to username is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verify the user exists and is a team member
    try:
        assigned_user = User.objects.get(
            username=assigned_username)  # pylint: disable=no-member
        print(f"Found user: {assigned_user.username} (ID: {assigned_user.id})")
    except User.DoesNotExist:  # pylint: disable=no-member
        return Response(
            {"error": f"User '{assigned_username}' not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check if assigned user is a member of this team
    is_member = TeamMembership.objects.filter(  # pylint: disable=no-member
        team=team, user=assigned_user).exists()  # pylint: disable=no-member
    print(f"Is member of team: {is_member}")

    if not is_member:
        return Response(
            {"error": f"User '{assigned_username}' is not a member of this team"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Prepare data for serializer - exclude fields we'll set manually
    task_data = request.data.copy()
    # Remove fields that will be set automatically
    task_data.pop('created_by', None)
    task_data.pop('for_team', None)
    task_data.pop('assigned_to', None)

    print(f"Task data for serializer: {task_data}")

    # Create the task
    serializer = TaskSerializer(data=task_data)
    if serializer.is_valid():
        print("Serializer is valid, saving task...")
        task = serializer.save(
            created_by=request.user,
            for_team=team,
            assigned_to=assigned_user
        )
        print(f"Task created: ID={task.id}")
        log_activity(
            request.user, f"created team task for {assigned_username}", task.id)

        return Response({
            "message": f"Task created and assigned to {assigned_username}",
            "task": TaskSerializer(task).data
        }, status=status.HTTP_201_CREATED)

    # Return detailed error for debugging
    print(f"Serializer errors: {serializer.errors}")
    return Response({
        "error": "Validation failed",
        "details": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_team_tasks(request, team_id):
    """Get tasks assigned to the current user in a specific team"""
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if user is a member
    if not TeamMembership.objects.filter(team=team, user=request.user).exists():  # pylint: disable=no-member
        return Response({"error": "You are not a member of this team"}, status=status.HTTP_403_FORBIDDEN)

    # Get tasks assigned to this user in this team
    my_tasks = Task.objects.filter(  # pylint: disable=no-member
        for_team=team,
        assigned_to=request.user
    ).select_related('created_by').order_by('-created_at')

    tasks_data = [{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": task.due_date,
        "created_by": {
            "id": task.created_by.id,
            "username": task.created_by.username
        },
        "created_at": task.created_at,
        "updated_at": task.updated_at
    } for task in my_tasks]

    return Response({
        "team_id": team.id,
        "team_name": team.name,
        "tasks": tasks_data,
        "count": len(tasks_data)
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_team_task_status(request, team_id, task_id):
    """Update the status of a team task (only assigned user can update their task status)"""
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if user is a member
    if not TeamMembership.objects.filter(team=team, user=request.user).exists():  # pylint: disable=no-member
        return Response({"error": "You are not a member of this team"}, status=status.HTTP_403_FORBIDDEN)

    # Get the task
    try:
        task = Task.objects.get(  # pylint: disable=no-member
            id=task_id,
            for_team=team
        )
    except Task.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Task not found in this team"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the task is assigned to the requesting user
    if task.assigned_to != request.user:
        return Response(
            {"error": "You can only update the status of tasks assigned to you"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Only allow status updates
    new_status = request.data.get('status')
    if not new_status:
        return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate status
    valid_statuses = ['pending', 'in-progress', 'completed']
    if new_status not in valid_statuses:
        return Response(
            {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    old_status = task.status
    task.status = new_status
    task.save()

    log_activity(
        request.user, f"updated task status from '{old_status}' to '{new_status}'", task.id)

    return Response({
        "message": f"Task status updated to '{new_status}'",
        "task": TaskSerializer(task).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_team_member_tasks(request, team_id, user_id):
    """Get all tasks assigned to a specific team member"""
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if requesting user is a member
    if not TeamMembership.objects.filter(team=team, user=request.user).exists():  # pylint: disable=no-member
        return Response({"error": "You are not a member of this team"}, status=status.HTTP_403_FORBIDDEN)

    # Get the target user
    try:
        target_user = User.objects.get(id=user_id)  # pylint: disable=no-member
    except User.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if target user is a member of this team
    if not TeamMembership.objects.filter(team=team, user=target_user).exists():  # pylint: disable=no-member
        return Response({"error": "User is not a member of this team"}, status=status.HTTP_404_NOT_FOUND)

    # Get tasks assigned to the target user
    member_tasks = Task.objects.filter(  # pylint: disable=no-member
        for_team=team,
        assigned_to=target_user
    ).select_related('created_by').order_by('-created_at')

    tasks_data = [{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": task.due_date,
        "created_by": {
            "id": task.created_by.id,
            "username": task.created_by.username
        },
        "created_at": task.created_at,
        "updated_at": task.updated_at
    } for task in member_tasks]

    return Response({
        "team_id": team.id,
        "team_name": team.name,
        "user": {
            "id": target_user.id,
            "username": target_user.username,
            "email": target_user.email
        },
        "tasks": tasks_data,
        "count": len(tasks_data)
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_team_task(request, team_id, task_id):
    """Delete a team task (only team owner can do this)"""
    try:
        team = Team.objects.get(id=team_id)  # pylint: disable=no-member
    except Team.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if requesting user is the owner
    user_role = role_in_team(request.user, team)
    if user_role != "owner":
        return Response(
            {"error": "Only team owners can delete tasks"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Get the task
    try:
        task = Task.objects.get(  # pylint: disable=no-member
            id=task_id,
            for_team=team
        )
    except Task.DoesNotExist:  # pylint: disable=no-member
        return Response({"error": "Task not found in this team"}, status=status.HTTP_404_NOT_FOUND)

    task_title = task.title
    task.delete()

    log_activity(request.user, f"deleted team task '{task_title}'", task_id)

    return Response({
        "message": f"Task '{task_title}' deleted successfully"
    }, status=status.HTTP_200_OK)
