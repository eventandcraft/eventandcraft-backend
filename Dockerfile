# Base image
FROM node:22-alpine AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Dependencies stage
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build

# Production stage
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

# The port your app runs on (defaults to 3000 in nestjs, adjust if needed)
EXPOSE 3000
    
# Start the application
CMD ["pnpm", "run", "start:prod"]
