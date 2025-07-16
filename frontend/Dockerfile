# Use Node.js 18 alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Copy production vite config
COPY vite.config.prod.ts vite.config.ts

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Run the application in preview mode (serves the built files)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"] 