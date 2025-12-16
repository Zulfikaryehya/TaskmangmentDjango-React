from .models import Team, TeamMembership
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task, Profile


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at', 'id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'phone', 'bio', ]
        read_only_fields = ['username', 'email']

    def validate_phone(self, value):
        """Custom validation for phone"""
        if value and len(value) < 10:
            raise serializers.ValidationError(
                "Phone number must be at least 10 digits")
        return value

        return value


class TeamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description']

    def create(self, validated_data):
        user = self.context['request'].user

        # Create team
        team = Team.objects.create(  # pylint: disable=no-member
            **validated_data)
        # Add creator as a member (owner)
        TeamMembership.objects.create(   # pylint: disable=no-member
            user=user,
            team=team,
            role_in_team="owner"
        )

        return team
