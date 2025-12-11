# ============================================================================
# REACT FRONTEND DOCKERFILE - DEVELOPMENT VERSION
# ============================================================================

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY task/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3000 (React dev server default)
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]