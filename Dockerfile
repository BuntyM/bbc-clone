# === Stage 1: Build the React Frontend ===
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# === Stage 2: Setup Production Node Environment ===
FROM node:20-alpine AS production
WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/server.js ./
# Copy server-related files if needed
COPY --from=build /app/src/server ./src/server
COPY --from=build /app/src/api ./src/api

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port the production server will listen on
EXPOSE 3001

# Define environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Command to run the production server
CMD ["node", "server.js"]