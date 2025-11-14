# Base development image
FROM oven/bun:1-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy only package management files first for better caching
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 4000

# Use development command
CMD ["bun", "run", "dev"]