# 🚀 Hono API Starter

A lightweight and efficient API starter template built with [Hono](https://hono.dev/) and [Bun](https://bun.sh/).

[![Hono](https://img.shields.io/badge/powered%20by-Hono-blue.svg)](https://hono.dev/)
[![Bun](https://img.shields.io/badge/runtime-Bun-black.svg)](https://bun.sh/)

## ✨ Features

- 🚀 Super fast API development with Hono
- ⚡ Powered by Bun runtime for maximum performance
- 🔄 Hot reloading for development
- 🐳 Docker ready for production deployment
- 📝 Pretty JSON responses
- 📊 Debug routes for uptime and health monitoring
- ✅ TypeScript configured with path aliases

## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0

## 🚦 Getting Started

### ⬇️ Installation

```bash
# Clone the repository
git clone https://github.com/Piarre/hono-starter
cd hono-starter && rm -rf .git/

# Install dependencies
bun install
```

### 👨‍💻 Development

Start the development server with hot reloading:

```bash
bun run dev
```

Your API will be available at http://localhost:3000

### 🏗️ Building for Production

```bash
bun run build
```

This will create a production build in the `dist` directory.

### 🚀 Running in Production

```bash
bun run ./dist/index.js
```

Or with Docker:

```bash
# Build the Docker image
docker build -t hono-api .

# Run the container
docker run -p 2025:2025 hono-api
```

## 📁 Project Structure

```
├── src/
│   ├── index.ts          # Main application entry point
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   └── routes/
│       └── debug.ts      # Debug route handlers
├── dist/                 # Build output directory
├── Dockerfile            # Docker configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## ⚙️ Configuration

### 🔌 Port Configuration

The API server runs on port 2025 by default. You can modify this in the `src/index.ts` file:

```typescript
export default {
  port: 2025, // Change this to your desired port
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
```

### 🔒 CORS Configuration

CORS is enabled for all origins by default. You can modify this in the `src/index.ts` file:

```typescript
app.use(
  "*",
  cors({
    origin: "*", // Change this to restrict origins
  }),
);
```

## 📋 Commands

```bash
bun run dev      # Start development server with hot reloading
bun run build    # Build for production
```

## 🔐 License

MIT
