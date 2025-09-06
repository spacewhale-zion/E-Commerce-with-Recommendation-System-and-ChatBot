# Stage 1: Build Stage
# This stage installs dependencies and compiles the TypeScript code.
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Stage
# This stage creates the final, lean production image.
FROM node:18-alpine
WORKDIR /app
# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Create the uploads directory. This ensures it always exists in the final image.
# This command replaces the previous, failing COPY command.
RUN mkdir -p /app/uploads

# Expose the port the app runs on
EXPOSE 4000

# The command to run the application
CMD ["node", "dist/app.js"]

