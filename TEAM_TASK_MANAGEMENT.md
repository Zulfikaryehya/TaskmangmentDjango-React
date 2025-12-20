# Team-Based Task Management System

## Overview
This system allows team owners to create and assign tasks to team members. Team members can view their tasks and update their status, while owners have full visibility of all team tasks.

## Backend API Endpoints

### 1. Get Team Details
**Endpoint:** `GET /api/teams/<team_id>/details/`
**Permission:** Team members only
**Returns:**
- Team information
- List of all members with roles
- All team tasks
- Current user's role and permissions

### 2. Create Team Task (Owner Only)
**Endpoint:** `POST /api/teams/<team_id>/tasks/create/`
**Permission:** Team owner only
**Body:**
```json
{
    "title": "Task title",
    "description": "Task description",
    "priority": "high|medium|low",
    "due_date": "YYYY-MM-DD",
    "assigned_to": "username"
}
```
**Validation:**
- Only team owners can create tasks
- Assigned user must be a team member
- Automatically sets `for_team` and `created_by`

### 3. Get My Team Tasks
**Endpoint:** `GET /api/teams/<team_id>/tasks/my-tasks/`
**Permission:** Team members
**Returns:** All tasks assigned to the current user in this team

### 4. Update Task Status (Own Tasks Only)
**Endpoint:** `PATCH /api/teams/<team_id>/tasks/<task_id>/update-status/`
**Permission:** Task must be assigned to requesting user
**Body:**
```json
{
    "status": "pending|in-progress|completed"
}
```
**Validation:**
- User can only update tasks assigned to them
- Only status field can be updated

### 5. Get Team Member Tasks
**Endpoint:** `GET /api/teams/<team_id>/members/<user_id>/tasks/`
**Permission:** Team members
**Returns:** All tasks assigned to a specific team member

### 6. Get Team Members
**Endpoint:** `GET /api/teams/<team_id>/members/`
**Permission:** Team members
**Returns:** List of all team members with roles

## Frontend - Team Details Page

### Features

#### 1. **Team Overview Header**
- Team name and description
- Member count and task count
- User's role display
- Create Task button (owner only)

#### 2. **Sidebar - Team Members**
- Clickable list of all team members
- Visual indication of owner (crown icon)
- Shows "You" for current user
- Highlights selected member

#### 3. **Main Content Area**
Two views:

**a) All Team Tasks (default)**
- Shows all team tasks
- Highlights tasks assigned to current user
- Owner can create tasks
- Users can update status of their own tasks

**b) Member's Tasks (when member selected)**
- Shows all tasks for selected member
- Current user can update their own task status
- Quick status update buttons (Start/Complete)

#### 4. **Create Task Modal (Owner Only)**
- Form to create new task
- Dropdown to select team member
- Priority and due date selection
- Validation for team membership

### User Permissions

#### Team Owner:
✅ View all team details
✅ See all members
✅ Create tasks for any member
✅ View all team tasks
✅ View any member's tasks
✅ Update status of tasks assigned to them

#### Team Member:
✅ View all team details
✅ See all members
❌ Cannot create tasks
✅ View all team tasks
✅ View any member's tasks
✅ Update status of ONLY their own tasks

### Status Update Flow
1. **Pending** → Click "Start" → **In Progress**
2. **In Progress** → Click "Complete" → **Completed**
3. **Completed** → No further updates (terminal state)

## Security Features

1. **Ownership Validation**
   - Task creation restricted to team owners
   - Verified at API level with 403 Forbidden response

2. **Team Membership Validation**
   - Can only assign tasks to team members
   - Verified before task creation

3. **Task Update Restrictions**
   - Users can only update status of tasks assigned to them
   - Backend validates assignment before allowing update

4. **Activity Logging**
   - All task creation and updates are logged
   - Tracks who did what and when

## Usage Example

### Owner Creates Task:
1. Navigate to team details page
2. Click "Create Task" button
3. Fill in task details
4. Select team member from dropdown
5. Submit form
6. Task appears in team task list

### Member Updates Task:
1. Navigate to team details page
2. Click on own name in sidebar OR view all tasks
3. Find assigned task
4. Click "Start" to begin work
5. Click "Complete" when done
6. Status updates in real-time

## Database Schema

The system uses existing models:
- **Task**: Has `for_team`, `assigned_to`, `created_by` fields
- **Team**: Team information
- **TeamMembership**: Links users to teams with roles
- **User**: Django auth user

## Next Steps

To use this system:

1. **Add to your React Router:**
```javascript
import TeamDetailsPage from "./pages/TeamDetailsPage";

// In your routes:
<Route path="/teams/:teamId/details" element={<TeamDetailsPage />} />
```

2. **Update Teams List to Link:**
```javascript
// In TeamsManagementPage or wherever you list teams:
<Link to={`/teams/${team.id}/details`}>View Details</Link>
```

3. **Test the Flow:**
   - Create a team (as superuser)
   - Add members
   - Navigate to team details
   - Create tasks (as owner)
   - Switch to member account
   - Update task status

## API Error Responses

- **403 Forbidden**: Not authorized (wrong role)
- **404 Not Found**: Team/user/task not found
- **400 Bad Request**: Invalid data (user not in team, etc.)
- **401 Unauthorized**: Not authenticated

All errors include descriptive messages in the response body.
