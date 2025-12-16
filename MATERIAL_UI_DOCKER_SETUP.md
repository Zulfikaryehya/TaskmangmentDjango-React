# Material-UI Installation Guide for Docker

## Prerequisites
- Docker and Docker Compose installed
- Frontend container configured

## Installation Steps

### Option 1: Rebuild Container (Recommended)

1. **Update package.json** in `frontend/task/`:
   ```bash
   cd frontend/task
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

2. **Rebuild and restart containers**:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

### Option 2: Install in Running Container

1. **Enter the frontend container**:
   ```bash
   docker-compose exec frontend sh
   ```

2. **Navigate to the app directory** (usually `/app` or `/app/task`):
   ```bash
   cd /app
   # or
   cd /app/task
   ```

3. **Install the packages**:
   ```bash
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

4. **Exit the container**:
   ```bash
   exit
   ```

5. **Restart the frontend service**:
   ```bash
   docker-compose restart frontend
   ```

### Option 3: Update Dockerfile

Update your `frontend/Dockerfile` to ensure dependencies are installed during build:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY task/package*.json ./

# Install dependencies
RUN npm install

# Install Material-UI dependencies (if not in package.json)
RUN npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Copy the rest of the application
COPY task/ .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

Then rebuild:
```bash
docker-compose build frontend
docker-compose up -d
```

## Verify Installation

1. **Check package.json** includes:
   ```json
   {
     "dependencies": {
       "@mui/material": "^5.15.0",
       "@mui/icons-material": "^5.15.0",
       "@emotion/react": "^11.11.0",
       "@emotion/styled": "^11.11.0"
     }
   }
   ```

2. **Check container logs**:
   ```bash
   docker-compose logs frontend
   ```

3. **Verify in browser**: Navigate to `http://localhost:3000` and check if components render without errors.

## Troubleshooting

### Issue: "Module not found" errors persist

**Solution**: Clear node_modules and reinstall
```bash
docker-compose exec frontend sh -c "rm -rf node_modules && npm install"
docker-compose restart frontend
```

### Issue: Changes not reflecting

**Solution**: Rebuild without cache
```bash
docker-compose build --no-cache frontend
docker-compose up -d
```

### Issue: Permission errors

**Solution**: Run with proper permissions
```bash
docker-compose exec -u root frontend npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## Required Packages

| Package | Purpose |
|---------|---------|
| `@mui/material` | Core Material-UI components |
| `@mui/icons-material` | Material Design icons |
| `@emotion/react` | CSS-in-JS library (MUI dependency) |
| `@emotion/styled` | Styled components (MUI dependency) |

## Post-Installation

After successful installation:
1. Refresh your browser
2. Check browser console for any remaining errors
3. Test the Teams page navigation
4. Verify all Material-UI components render correctly

## Quick Commands Reference

```bash
# View running containers
docker-compose ps

# View frontend logs
docker-compose logs -f frontend

# Restart specific service
docker-compose restart frontend

# Rebuild and restart
docker-compose up -d --build frontend

# Enter container shell
docker-compose exec frontend sh

# Stop all containers
docker-compose down

# Start all containers
docker-compose up -d
```

## Notes

- **Development Mode**: Changes to React files should hot-reload automatically
- **Production Build**: Run `npm run build` before deploying
- **Volume Mounts**: Ensure package.json is properly mounted in docker-compose.yml
- **Port Conflicts**: Verify port 3000 is available on your host machine
