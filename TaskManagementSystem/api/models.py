from django.db import models
from django.contrib.auth.models import User

# -----------------------------
# Profile Model (Extending User Model)
# -----------------------------


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Your custom fields:
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    # avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    role = models.CharField(max_length=20, default="member")  # example


# -----------------------------
# Task Model
# -----------------------------
class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_tasks'
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default='medium')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    due_date = models.DateField(null=True, blank=True)
