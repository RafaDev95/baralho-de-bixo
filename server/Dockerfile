# Base development image
FROM node:20-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package management files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 4000

# Use development command
CMD ["pnpm", "dev"]