# Simple TCG Client

A modern, responsive front-end application for the Simple TCG trading card game.

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## Documentation

📖 **[Full Front-End Documentation](./docs/FRONTEND_DOCUMENTATION.md)**

The complete documentation covers:
- Architecture and design patterns
- Component library
- Features and functionality
- API integration
- Development guidelines
- And much more!

## Features

- ✅ **Authentication**: Sign up, sign in, profile management
- ✅ **Card Management**: Browse, search, filter, create cards
- ✅ **Deck Building**: Create and manage custom decks
- ✅ **Game Rooms**: Create and join multiplayer rooms
- ✅ **Real-time Gameplay**: Live updates via WebSocket
- ✅ **Player Profiles**: View statistics and decks
- ✅ **Responsive Design**: Works on all devices

## Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Query** - Server state management
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── services/        # API service layer
├── queryKeys/       # React Query key factories
├── types/           # TypeScript definitions
├── contexts/        # React Context providers
└── lib/             # Utility functions
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8081
NODE_ENV=development
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run type-check` - TypeScript type checking

## Routes

- `/` - Landing page
- `/signin` - Sign in
- `/signup` - Sign up
- `/dashboard` - Main dashboard
- `/cards` - Browse cards
- `/cards/create` - Create card
- `/cards/[id]` - Card detail
- `/decks` - Manage decks
- `/rooms` - Game rooms
- `/rooms/[id]` - Room lobby
- `/game/[id]` - Game board
- `/players` - Players list
- `/players/[id]` - Player profile
- `/profile` - Your profile

## Development

See [FRONTEND_DOCUMENTATION.md](./docs/FRONTEND_DOCUMENTATION.md) for detailed development guidelines.

## License

ISC

