# Team Management Feature

## Overview
This document describes the newly implemented team management functionality that allows users to create teams, manage team memberships, and collaborate effectively.

## Backend Implementation

### API Endpoints

#### 1. Get User's Teams
- **Endpoint:** `GET /api/teams/`
- **Authentication:** Required
- **Description:** Retrieves all teams where the authenticated user is a member
- **Response Example:**
```json
[
  {
    "id": 1,
    "name": "Development Team",
    "description": "Main development team for the project"
  },
  {
    "id": 2,
    "name": "Design Team",
    "description": "UI/UX design team"
  }
]
```

#### 2. Create Team
- **Endpoint:** `POST /api/teams/create/`
- **Authentication:** Required
- **Description:** Creates a new team with the authenticated user as the leader
- **Request Body:**
```json
{
  "name": "Team Name",
  "description": "Team description"
}
```
- **Response Example:**
```json
{
  "message": "Team created successfully",
  "team_id": 3
}
```

#### 3. Add Member to Team
- **Endpoint:** `POST /api/teams/<team_id>/add-member/`
- **Authentication:** Required (must be team leader)
- **Description:** Adds a user to the specified team
- **Request Body:**
```json
{
  "username": "johndoe"
}
```
- **Response Example:**
```json
{
  "message": "User johndoe added to team Development Team"
}
```
- **Error Responses:**
  - `403 Forbidden`: Only team leaders can add members
  - `404 Not Found`: Team or user not found
  - `400 Bad Request`: User is already a member

#### 4. Get Available Users for Team
- **Endpoint:** `GET /api/teams/<team_id>/available-users/`
- **Authentication:** Required (must be team member)
- **Description:** Returns a list of users who are not yet members of the specified team
- **Response Example:**
```json
{
  "team_id": 1,
  "team_name": "Development Team",
  "available_users": [
    {
      "id": 3,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    {
      "id": 4,
      "username": "janedoe",
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Doe"
    }
  ],
  "count": 2
}
```

### Models

#### TeamMembership
Represents the relationship between users and teams:
- `team`: Foreign key to Team
- `user`: Foreign key to User
- `role_in_team`: CharField with choices ('leader', 'member')

#### Team
Represents a team entity:
- `name`: Team name
- `description`: Team description
- `members`: Many-to-many relationship with User through TeamMembership

### Helper Functions

#### `role_in_team(user, team)`
Returns the role of a user in a specific team:
- Returns: `'leader'`, `'member'`, or `None` if not a member

## Frontend Implementation

### Components

#### TeamsManagementPage
Location: `frontend/task/src/pages/TeamsManagementPage.js`

**Features:**
- Display all teams the user is a member of
- Create new teams
- Add members to teams (for team leaders)
- Responsive grid layout
- Material-UI components for modern UI
- Error handling and user feedback

**Key Functionality:**
1. **View Teams**: Displays teams in a responsive card grid
2. **Create Team Dialog**: Modal for creating new teams
3. **Add Member Dialog**: Modal for adding members to teams
4. **Snackbar Notifications**: Success/error feedback
5. **Loading States**: Shows loading indicators during API calls

#### Header Component Update
Location: `frontend/task/src/component/Header.jsx`

**New Features:**
- Added "Teams" button in the navigation bar
- Icon changes to `GroupIcon` for teams
- Responsive behavior (icon-only on tablets, text+icon on desktop)

### Routing

Added new route in `index.js`:
```javascript
{path: "teams", element: <TeamsManagementPage />}
```

## Usage

### Creating a Team
1. Navigate to the Teams page
2. Click "Create Team" button
3. Enter team name and description
4. Click "Create Team" in the dialog

### Adding Members
1. Navigate to the Teams page
2. Find the team card
3. Click "Add Member" button
4. **Search for users** in the search box
5. **Select a user** from the list of available users
6. Click "Add Member" in the dialog

**Features:**
- Shows only users who are NOT already in the team
- Search functionality to filter users by username, email, or name
- Visual selection indicator
- Displays user information (username, email, full name)
- Real-time search filtering

**Note:** Only team leaders can add members to their teams.

### Viewing Teams
- All teams are displayed in a responsive grid
- Each card shows:
  - Team name
  - Team description
  - Team ID
  - Action buttons

## Security & Permissions

### Backend Security
- All endpoints require authentication (`@permission_classes([IsAuthenticated])`)
- Only team leaders can add members
- Users can only view teams they are members of

### Frontend Security
- JWT tokens stored in localStorage
- Axios interceptors handle authentication
- Unauthorized requests redirect to login

## Error Handling

### Backend Errors
- `404`: Team or user not found
- `403`: Insufficient permissions
- `400`: Invalid request data or user already in team

### Frontend Errors
- Network errors displayed in snackbar
- Form validation before submission
- User-friendly error messages

## Material-UI Components Used

- `Container`, `Grid`: Layout
- `Card`, `CardContent`, `CardActions`: Team cards
- `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`: Modals
- `TextField`: Form inputs
- `Button`, `IconButton`: Actions
- `Snackbar`, `Alert`: Notifications
- `CircularProgress`: Loading states
- `Chip`, `Tooltip`, `Stack`: UI elements

## Future Enhancements

Potential improvements:
1. Remove members from teams
2. Change member roles
3. Leave team functionality
4. Team statistics and analytics
5. Team-based task assignment
6. Team chat or messaging
7. Team settings and customization
8. Search and filter teams
9. Invite members via email
10. Team avatars/icons

## Dependencies

### Backend
- Django REST Framework
- Django Authentication

### Frontend
- React
- React Router
- Material-UI (@mui/material)
- Material-UI Icons (@mui/icons-material)
- Axios

## Testing

### Manual Testing Steps
1. Create a user account
2. Login and navigate to Teams page
3. Create a new team
4. Add a member to the team
5. Verify team appears in the list
6. Test error cases (non-existent user, already a member, etc.)

### API Testing with cURL

**Get Teams:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/teams/
```

**Create Team:**
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Team","description":"A test team"}' \
  http://localhost:8000/api/teams/create/
```

**Add Member:**
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}' \
  http://localhost:8000/api/teams/1/add-member/
```

## Troubleshooting

### Common Issues

1. **"Only team leaders can add members" error**
   - Ensure you are the creator/leader of the team
   - Check user's role in TeamMembership model

2. **Teams not loading**
   - Check authentication token is valid
   - Verify backend API is running
   - Check browser console for errors

3. **Material-UI components not rendering**
   - Ensure all dependencies are installed:
     ```bash
     npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
     ```

4. **CORS errors**
   - Verify CORS settings in Django settings.py
   - Check API base URL in axios configuration

## Code Quality

### Best Practices Implemented
- ✅ Memoized callbacks with `useCallback`
- ✅ Proper error handling
- ✅ Loading states for better UX
- ✅ Responsive design
- ✅ Accessibility (tooltips, ARIA labels)
- ✅ Clean code structure
- ✅ Consistent naming conventions
- ✅ DRY principle
- ✅ Material-UI theming
- ✅ RESTful API design

## Conclusion

The team management feature provides a solid foundation for collaborative work within the Task Management System. It follows modern web development practices and provides an intuitive user experience.
