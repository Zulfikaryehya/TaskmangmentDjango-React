# Testing Guide - Team Task Management

## Quick Start Testing

### Prerequisites
1. Backend running (Django server)
2. Frontend running (React app)
3. At least 2 user accounts (one superuser/owner, one regular user)

## Test Scenarios

### Scenario 1: Team Owner Creates Task

**Steps:**
1. Login as superuser
2. Navigate to Teams page (`/teams`)
3. Click "View Details" on a team card
4. Click "➕ Create Task" button
5. Fill in the form:
   - Title: "Complete Documentation"
   - Description: "Write user guide for new feature"
   - Assign To: Select a team member
   - Priority: High
   - Due Date: Select future date
6. Click "Create Task"

**Expected Result:**
- ✅ Success message appears
- ✅ Task appears in "All Team Tasks" list
- ✅ Task shows as assigned to selected member
- ✅ Status is "pending"

### Scenario 2: Team Member Views Their Tasks

**Steps:**
1. Login as team member (not owner)
2. Navigate to Teams page (`/teams`)
3. Click "View Details" on the team
4. Click on your own name in the sidebar

**Expected Result:**
- ✅ Only your assigned tasks appear
- ✅ "Start" button visible for pending tasks
- ✅ "Complete" button visible for in-progress tasks
- ✅ No "Create Task" button (member can't create)

### Scenario 3: Member Updates Task Status

**Steps:**
1. As team member, view your tasks
2. Find a pending task
3. Click "Start" button
4. Status changes to "in-progress"
5. Click "Complete" button
6. Status changes to "completed"

**Expected Result:**
- ✅ Status updates successfully
- ✅ Buttons change based on status
- ✅ Completed tasks show no action buttons
- ✅ Activity logged in backend

### Scenario 4: Member Tries to Create Task (Should Fail)

**Steps:**
1. Login as team member (not owner)
2. Navigate to team details
3. Look for "Create Task" button

**Expected Result:**
- ✅ No "Create Task" button visible
- ✅ Role shows as "member" not "owner"

### Scenario 5: View Another Member's Tasks

**Steps:**
1. As any team member
2. Navigate to team details
3. Click on another member's name in sidebar

**Expected Result:**
- ✅ Can see their tasks
- ✅ Can see task details
- ✅ Cannot update their tasks (only own tasks)

### Scenario 6: Owner Views All Tasks

**Steps:**
1. As team owner
2. Navigate to team details
3. Don't click any member (default view)

**Expected Result:**
- ✅ All team tasks visible
- ✅ Shows who each task is assigned to
- ✅ Tasks assigned to owner are highlighted
- ✅ Can update status of own tasks only

## API Testing with cURL/Postman

### 1. Get Team Details
```bash
GET http://localhost:8000/api/teams/1/details/
Authorization: Bearer <your_token>
```

### 2. Create Team Task (Owner Only)
```bash
POST http://localhost:8000/api/teams/1/tasks/create/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "title": "Test Task",
    "description": "This is a test",
    "priority": "high",
    "due_date": "2025-12-31",
    "assigned_to": "member_username"
}
```

### 3. Update Task Status
```bash
PATCH http://localhost:8000/api/teams/1/tasks/5/update-status/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "status": "in-progress"
}
```

### 4. Get Member's Tasks
```bash
GET http://localhost:8000/api/teams/1/members/2/tasks/
Authorization: Bearer <your_token>
```

### 5. Get My Team Tasks
```bash
GET http://localhost:8000/api/teams/1/tasks/my-tasks/
Authorization: Bearer <your_token>
```

## Common Issues & Solutions

### Issue: "Only team owners can create tasks"
**Solution:** Make sure you're logged in as the team owner. Check role with:
```bash
GET http://localhost:8000/api/teams/1/details/
```
Look for `"current_user_role": "owner"`

### Issue: "User not a member of this team"
**Solution:** Ensure the user you're assigning to is added to the team first via Add Member dialog.

### Issue: "You can only update tasks assigned to you"
**Solution:** You can only change status of your own tasks. Check `assigned_to` field matches your username.

### Issue: Tasks not appearing
**Solution:** 
- Check `for_team` field is set correctly
- Ensure you're viewing the right team
- Refresh the page

## Database Verification

### Check Task Assignment
```python
# Django shell
from api.models import Task, Team
task = Task.objects.get(id=1)
print(f"Team: {task.for_team.name}")
print(f"Assigned to: {task.assigned_to.username}")
print(f"Created by: {task.created_by.username}")
```

### Check Team Membership
```python
from api.models import TeamMembership
memberships = TeamMembership.objects.filter(team_id=1)
for m in memberships:
    print(f"{m.user.username} - {m.role_in_team}")
```

### Check Activity Logs
```python
from api.logs.models import ActivityLog
logs = ActivityLog.objects.filter(task_id=1).order_by('-timestamp')
for log in logs:
    print(f"{log.user.username}: {log.action} at {log.timestamp}")
```

## Success Criteria

✅ Owner can create tasks for team members
✅ Members can view all team tasks
✅ Members can view any member's tasks
✅ Members can ONLY update their own task status
✅ Status workflow: pending → in-progress → completed
✅ Tasks properly linked to team via `for_team` field
✅ All actions logged in activity log
✅ Proper error messages for permission denied
✅ UI updates in real-time after changes
✅ Proper role-based UI (owner sees create button, members don't)

## Performance Notes

- Team details page loads all tasks at once
- Member task view filters client-side initially
- Clicking member re-fetches their tasks from API
- Consider pagination if team has 100+ tasks
