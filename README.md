# Skill Share Platform

A monorepo project built with PNPM workspaces, containing both client and server applications.

## Prerequisites

- Node.js (v18 or higher recommended)
- PNPM (v8 or higher)

## Installation

1. Install PNPM globally (if not already installed):

```bash
npm install -g pnpm
```

2. Install dependencies:

```bash
pnpm install
```

## Project Structure

```
skill-share-platform/
├── client/          # Frontend application
├── server/          # Backend application
├── package.json     # Root package.json
└── pnpm-workspace.yaml  # PNPM workspace configuration
```

## Development

To run the development servers:

1. Start the backend server:

```bash
cd server
pnpm dev
```

2. Start the frontend client:

```bash
cd client
pnpm dev
```

## Available Scripts

- `pnpm install` - Install all dependencies
- `pnpm build` - Build all packages
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
