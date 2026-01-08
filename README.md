# Simple TCG - Card Battle Game

A card battle game with a clean monorepo structure separating client and server.

## Project Structure

```
simple-tcg/
├── client/          # Next.js frontend application
│   ├── src/        # Source code
│   ├── package.json
│   └── ...
├── server/         # Hono backend API
│   ├── src/       # Source code
│   ├── package.json
│   └── ...
└── package.json    # Workspace root
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun 1.0+
- PostgreSQL

### Installation

1. Install workspace dependencies:
```bash
bun install
```

2. Install client dependencies:
```bash
cd client && bun install
```

3. Install server dependencies:
```bash
cd server && bun install
```

### Development

Run both client and server concurrently:
```bash
bun run dev
```

Or run them separately:

**Client:**
```bash
cd client && bun run dev
```

**Server:**
```bash
cd server && bun run dev
```

### Environment Variables

**Client** (`client/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8081
NODE_ENV=development
```

**Server** (`server/.env`):
```
DATABASE_HOST=localhost
DATABASE_NAME=simple_tcg
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simple_tcg
PORT=3001
LOG_LEVEL=info
NODE_ENV=development
```

## Features

- **Client**: Next.js 15 with App Router, React Query, WebSocket support
- **Server**: Hono API with PostgreSQL, WebSocket server, Game engine

## Documentation

Server documentation is available in `server/docs/`:

- **[API Documentation](server/docs/API_DOCUMENTATION.md)** - Full API reference, database schema, WebSocket events
- **[Type-Safe Card System](server/docs/type-safe-card-system.md)** - Card/deck builder system with TypeScript validation

### Design Patterns

This project demonstrates several design patterns in `server/docs/design-patterns/`:

| Pattern | Purpose |
|---------|---------|
| [Factory](server/docs/design-patterns/factory-pattern.md) | Card creation with pluggable type strategies |
| [Strategy](server/docs/design-patterns/strategy-pattern.md) | Attack behaviors and card factory strategies |
| [Observer](server/docs/design-patterns/observer-pattern.md) | Game events decoupled from WebSocket/UI |
| [Builder](server/docs/design-patterns/builder-pattern.md) | Type-safe `defineCard()`, `defineAbility()`, `defineDeck()` |
| [Registry](server/docs/design-patterns/registry-pattern.md) | O(1) strategy/ability lookup |
| [Singleton](server/docs/design-patterns/singleton-pattern.md) | Global game engine and event emitter |

## License

ISC
