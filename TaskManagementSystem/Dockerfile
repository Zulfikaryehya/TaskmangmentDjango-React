
# 1. BASE IMAGE - Starting point
FROM python:3.11-slim
# Explanation: Uses official Python 3.11 image (lightweight version)
# Like installing Python on a fresh computer

# 2. METADATA (optional)
LABEL maintainer="zyehya007@gmail.com"
LABEL version="1.0"
LABEL description="Django Task Management System"
# Explanation: Documentation about the image

# 3. SET WORKING DIRECTORY
WORKDIR /app
# Explanation: All subsequent commands run in /app folder
# Like doing 'cd /app' in terminal

# 4. INSTALL SYSTEM DEPENDENCIES
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*
# Explanation:
# - apt-get update: Updates package list
# - apt-get install: Installs required system libraries
# - gcc: C compiler (needed for some Python packages)
# - mysql-dev: MySQL client libraries
# - rm -rf: Cleans up to reduce image size

# 5. COPY REQUIREMENTS FILE
COPY requirements.txt .
# Explanation: 
# - Copies from host (your computer) to container
# - '.' means current directory (/app)
# - Done separately to use Docker's layer caching

# 6. INSTALL PYTHON DEPENDENCIES
RUN pip install --no-cache-dir -r requirements.txt
# Explanation:
# - pip install: Installs Python packages
# - --no-cache-dir: Don't store pip cache (saves space)
# - -r requirements.txt: Install from file

# 7. COPY APPLICATION CODE
COPY . .
# Explanation:
# - First dot: Everything in host's backend/ folder
# - Second dot: Destination /app in container
# - Copies your entire Django project

# 8. EXPOSE PORT
EXPOSE 8000
# Explanation:
# - Documents which port the app uses
# - Doesn't actually open the port (docker run -p does)

# 9. SET ENVIRONMENT VARIABLES
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=TaskManagementSystem.settings
# Explanation:
# - PYTHONUNBUFFERED: Shows Python output immediately
# - Sets Django settings path

# 10. RUN MIGRATIONS (optional, better in docker-compose)
# RUN python manage.py migrate
# Explanation: Creates database tables

# 11. STARTUP COMMAND
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
# Explanation:
# - CMD: Command to run when container starts
# - 0.0.0.0: Listen on all network interfaces
# - 8000: Port number