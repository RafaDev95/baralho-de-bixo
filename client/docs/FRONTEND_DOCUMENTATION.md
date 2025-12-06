# Front-End Documentation

**Project**: Simple TCG Client  
**Version**: 1.0.0  
**Last Updated**: 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Component Library](#component-library)
6. [Features](#features)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Routing](#routing)
10. [Styling & Theming](#styling--theming)
11. [Development Guidelines](#development-guidelines)
12. [Getting Started](#getting-started)

---

## Overview

The Simple TCG front-end is a modern, responsive web application built with Next.js 15 and React 19. It provides a complete interface for managing cards, decks, players, game rooms, and playing the trading card game. The application follows modern best practices with type safety, proper error handling, and a beautiful user interface.

### Key Features

- **Authentication**: Sign up, sign in, and profile management
- **Card Management**: Browse, search, filter, and create cards
- **Deck Building**: Create and manage custom decks
- **Game Rooms**: Create and join game rooms for multiplayer matches
- **Real-time Gameplay**: Live game updates via WebSocket
- **Player Profiles**: View player statistics and decks
- **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## Technologies Used

### Core Framework

- **Next.js 15.1.0**: React framework with App Router
  - Server-side rendering
  - File-based routing
  - API route handlers
  - Image optimization

- **React 19.0.0**: UI library
  - Server Components
  - Client Components
  - Hooks API

- **TypeScript 5.6.3**: Type-safe JavaScript
  - Strict mode enabled
  - Full type coverage

### UI Components

- **Shadcn UI**: High-quality component library
  - Built on Radix UI primitives
  - Fully customizable
  - Accessible by default

- **Radix UI**: Unstyled, accessible components
  - Dialog, Select, Tabs, Dropdown Menu, Avatar, etc.

- **Tailwind CSS 3.4.17**: Utility-first CSS framework
  - Responsive design utilities
  - Custom theme configuration
  - Dark mode support

### State Management

- **TanStack Query (React Query) 5.62.0**: Server state management
  - Automatic caching
  - Background updates
  - Optimistic updates
  - Query invalidation

- **React Context**: Client-side state
  - Authentication state
  - User session management

### Form Management

- **React Hook Form 7.67.0**: Performant form library
  - Minimal re-renders
  - Built-in validation
  - Easy integration with Zod

- **Zod 3.24.1**: Schema validation
  - Type-safe validation
  - Runtime type checking
  - Form validation

### Real-time Communication

- **WebSocket**: Real-time game updates
  - Room-based communication
  - Game event broadcasting
  - Chat functionality

### Utilities

- **Lucide React**: Icon library
- **clsx & tailwind-merge**: Conditional class names
- **class-variance-authority**: Component variants

---

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── cards/
│   │   │   │   ├── [id]/
│   │   │   │   └── create/
│   │   │   ├── decks/
│   │   │   │   └── [id]/
│   │   │   ├── rooms/
│   │   │   │   └── [id]/
│   │   │   ├── game/
│   │   │   │   └── [id]/
│   │   │   ├── players/
│   │   │   │   └── [id]/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── providers.tsx      # React Query & Auth providers
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── auth/             # Authentication components
│   │   │   ├── sign-in-form.tsx
│   │   │   ├── sign-up-form.tsx
│   │   │   └── protected-route.tsx
│   │   ├── cards/            # Card-related components
│   │   │   ├── cards-grid.tsx
│   │   │   ├── card-item.tsx
│   │   │   ├── card-detail.tsx
│   │   │   ├── card-filters.tsx
│   │   │   └── card-form.tsx
│   │   ├── decks/            # Deck-related components
│   │   │   ├── decks-list.tsx
│   │   │   ├── deck-item.tsx
│   │   │   ├── deck-detail.tsx
│   │   │   └── deck-builder.tsx
│   │   ├── game-rooms/       # Game room components
│   │   │   ├── rooms-list.tsx
│   │   │   ├── room-item.tsx
│   │   │   ├── room-lobby.tsx
│   │   │   ├── room-chat.tsx
│   │   │   └── create-room-form.tsx
│   │   ├── game/             # Game board components
│   │   │   └── game-board.tsx
│   │   ├── players/          # Player-related components
│   │   │   ├── players-list.tsx
│   │   │   ├── player-card.tsx
│   │   │   └── player-detail.tsx
│   │   └── layout/           # Layout components
│   │       ├── nav.tsx
│   │       ├── sidebar.tsx
│   │       └── user-menu.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── auth/            # Authentication hooks
│   │   ├── cards/           # Card-related hooks
│   │   ├── decks/           # Deck-related hooks
│   │   ├── game-rooms/      # Game room hooks
│   │   ├── game-sessions/   # Game session hooks
│   │   ├── players/         # Player hooks
│   │   └── websocket/       # WebSocket hooks
│   ├── services/            # API service layer
│   │   ├── api-client.ts    # Base API client
│   │   ├── auth.service.ts
│   │   ├── cards.service.ts
│   │   ├── decks.service.ts
│   │   ├── game-rooms.service.ts
│   │   ├── game-sessions.service.ts
│   │   ├── players.service.ts
│   │   └── websocket.service.ts
│   ├── queryKeys/           # React Query key factories
│   │   ├── auth.ts
│   │   ├── cards.ts
│   │   ├── decks.ts
│   │   ├── game-rooms.ts
│   │   ├── game-sessions.ts
│   │   └── players.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── cards.ts
│   │   ├── decks.ts
│   │   ├── game-rooms.ts
│   │   ├── game-sessions.ts
│   │   ├── players.ts
│   │   └── websocket.ts
│   ├── contexts/            # React Context providers
│   │   └── auth-context.tsx
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Common utilities (cn function)
│   └── config/              # Configuration
│       └── env.ts           # Environment variables
├── public/                  # Static assets
├── components.json          # Shadcn UI configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
└── package.json            # Dependencies
```

---

## Architecture

### Design Patterns

#### 1. **Service Layer Pattern**

All API calls are abstracted through service classes:

```typescript
// services/cards.service.ts
class CardsService {
  async list(): Promise<Card[]> { ... }
  async getById(id: number): Promise<Card> { ... }
  async create(data: CreateCardRequest): Promise<Card> { ... }
  async update(id: number, data: UpdateCardRequest): Promise<Card> { ... }
  async delete(id: number): Promise<void> { ... }
}
```

**Benefits**:
- Centralized API logic
- Easy to mock for testing
- Consistent error handling
- Type-safe API calls

#### 2. **Query Key Factory Pattern**

React Query keys are managed through factory functions:

```typescript
// queryKeys/cards.ts
export function GET_CARDS_QUERY() {
  return ['cards'] as const;
}

export function GET_CARD_QUERY(id: number) {
  return ['cards', id] as const;
}
```

**Benefits**:
- Type-safe query keys
- Centralized key management
- Easy invalidation
- Prevents typos

#### 3. **Custom Hooks Pattern**

Business logic is encapsulated in custom hooks:

```typescript
// hooks/cards/use-cards-list.ts
export function useCardsList() {
  return useQuery<Card[]>({
    queryKey: GET_CARDS_QUERY(),
    queryFn: () => cardsService.list(),
    staleTime: 5 * 60 * 1000,
    onSuccess: () => { ... },
    onError: (error) => { ... },
  });
}
```

**Benefits**:
- Reusable logic
- Consistent patterns
- Easy to test
- Separation of concerns

#### 4. **Component Composition**

Components are built using composition:

```typescript
// components/cards/cards-grid.tsx
export function CardsGrid({ onCardClick, searchQuery, typeFilter }) {
  const { data: cards, isLoading, error } = useCardsList();
  
  // Filtering logic
  const filteredCards = useMemo(() => { ... }, [cards, searchQuery, typeFilter]);
  
  // Render logic
  return <div>{filteredCards.map(card => <CardItem ... />)}</div>;
}
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (useMutation/useQuery)
    ↓
Service Layer (API Call)
    ↓
React Query (Cache Management)
    ↓
Component Re-render
```

### Authentication Flow

```
1. User visits protected route
    ↓
2. ProtectedRoute component checks auth state
    ↓
3. If not authenticated → redirect to /signin
    ↓
4. User signs in → AuthContext updates
    ↓
5. Player data stored in localStorage
    ↓
6. Redirect to dashboard
```

---

## Component Library

### UI Components (Shadcn)

All UI components are located in `src/components/ui/` and follow Shadcn UI patterns.

#### Core Components

- **Button**: Multiple variants (default, outline, ghost, destructive)
- **Card**: Container with header, content, footer
- **Input**: Text input with validation states
- **Label**: Form labels
- **Textarea**: Multi-line text input

#### Form Components

- **Form**: React Hook Form integration
- **Select**: Dropdown selection
- **Dialog**: Modal dialogs
- **Alert**: Error and info messages

#### Layout Components

- **Separator**: Visual dividers
- **Tabs**: Tabbed content
- **Sheet**: Side panels
- **Dropdown Menu**: Context menus

#### Display Components

- **Badge**: Status indicators
- **Avatar**: User avatars
- **Table**: Data tables
- **Skeleton**: Loading placeholders

### Feature Components

#### Authentication

**SignUpForm** (`components/auth/sign-up-form.tsx`)
- Form validation with Zod
- Username and email input
- Error handling
- Success redirect

**SignInForm** (`components/auth/sign-in-form.tsx`)
- Email-based sign in
- Form validation
- Error handling
- Success redirect

**ProtectedRoute** (`components/auth/protected-route.tsx`)
- Route protection
- Authentication check
- Loading states
- Redirect logic

#### Cards

**CardsGrid** (`components/cards/cards-grid.tsx`)
- Displays cards in responsive grid
- Supports filtering and search
- Loading and error states
- Empty state handling

**CardItem** (`components/cards/card-item.tsx`)
- Card preview component
- Type and rarity badges
- Energy cost display
- Click handler

**CardDetail** (`components/cards/card-detail.tsx`)
- Full card information
- Tabs for abilities/effects
- Stats display
- Visual card representation

**CardFilters** (`components/cards/card-filters.tsx`)
- Search input
- Type filter dropdown
- Rarity filter dropdown
- Clear filters button

**CardForm** (`components/cards/card-form.tsx`)
- Create/edit card form
- React Hook Form integration
- Conditional fields (power/toughness for creatures)
- Validation

#### Decks

**DecksList** (`components/decks/decks-list.tsx`)
- List of user decks
- Create deck button
- Delete functionality
- Loading states

**DeckBuilder** (`components/decks/deck-builder.tsx`)
- Visual deck construction
- Card selection
- Deck validation
- Save functionality

**DeckDetail** (`components/decks/deck-detail.tsx`)
- Full deck view
- Card list
- Edit functionality
- Statistics

#### Game Rooms

**RoomsList** (`components/game-rooms/rooms-list.tsx`)
- List of available rooms
- Status filtering
- Join functionality
- Create room button

**RoomLobby** (`components/game-rooms/room-lobby.tsx`)
- Room waiting area
- Player list
- Ready status
- Start game button

**RoomChat** (`components/game-rooms/room-chat.tsx`)
- Real-time chat
- Message history
- WebSocket integration

**CreateRoomForm** (`components/game-rooms/create-room-form.tsx`)
- Room creation form
- Name and max players input
- Validation

#### Game

**GameBoard** (`components/game/game-board.tsx`)
- Main game interface
- Player areas with health/energy bars
- Battlefield display
- Hand display
- Turn management
- WebSocket integration for real-time updates

#### Players

**PlayersList** (`components/players/players-list.tsx`)
- List of all players
- Search functionality
- Player cards

**PlayerCard** (`components/players/player-card.tsx`)
- Player preview
- Avatar display
- Stats (balance, rank)

**PlayerDetail** (`components/players/player-detail.tsx`)
- Full player profile
- Statistics
- Deck list
- Account information

#### Layout

**Nav** (`components/layout/nav.tsx`)
- Main navigation header
- User menu integration
- Responsive design

**Sidebar** (`components/layout/sidebar.tsx`)
- Desktop sidebar navigation
- Mobile sheet menu
- Active route highlighting
- Icon-based navigation

**UserMenu** (`components/layout/user-menu.tsx`)
- User dropdown menu
- Profile link
- Settings link
- Logout functionality

---

## Features

### Authentication

#### Sign Up
- **Route**: `/signup`
- **Component**: `SignUpForm`
- **Features**:
  - Username validation (3-50 characters, alphanumeric + underscore)
  - Email validation
  - Form error handling
  - Automatic redirect to dashboard on success
  - Link to sign in page

#### Sign In
- **Route**: `/signin`
- **Component**: `SignInForm`
- **Features**:
  - Email-based authentication
  - Form validation
  - Error handling
  - Automatic redirect to dashboard on success
  - Link to sign up page

#### Profile
- **Route**: `/profile`
- **Component**: `ProfilePage`
- **Features**:
  - Player information display
  - Statistics (balance, rank)
  - Account details
  - Member since date

### Card Management

#### Browse Cards
- **Route**: `/cards`
- **Component**: `CardsPage`
- **Features**:
  - Grid view of all cards
  - Search by name/description
  - Filter by type (creature, spell, artifact, enchantment)
  - Filter by rarity (common, uncommon, rare, mythic)
  - Card count display
  - Create card button

#### Card Detail
- **Route**: `/cards/[id]`
- **Component**: `CardDetail`
- **Features**:
  - Full card information
  - Type and rarity badges
  - Energy cost display
  - Power/toughness for creatures
  - Abilities tab
  - Effects tab
  - Creation date

#### Create Card
- **Route**: `/cards/create`
- **Component**: `CardForm`
- **Features**:
  - Full card creation form
  - Type selection
  - Rarity selection
  - Conditional fields (power/toughness for creatures)
  - Form validation
  - Success redirect

### Deck Management

#### Deck List
- **Route**: `/decks`
- **Component**: `DecksPage`
- **Features**:
  - List of user decks
  - Deck previews
  - Create deck button
  - Edit deck functionality
  - Delete deck with confirmation
  - Active deck indicator

#### Deck Builder
- **Route**: `/decks` (modal/view)
- **Component**: `DeckBuilder`
- **Features**:
  - Visual deck construction
  - Card selection
  - Real-time card count
  - Deck validation
  - Save functionality

#### Deck Detail
- **Route**: `/decks/[id]`
- **Component**: `DeckDetail`
- **Features**:
  - Full deck view
  - Card list with details
  - Edit functionality
  - Delete functionality

### Game Rooms

#### Rooms List
- **Route**: `/rooms`
- **Component**: `RoomsPage`
- **Features**:
  - List of available rooms
  - Status filter (all, waiting, active, finished)
  - Room cards with player count
  - Join room button
  - Create room button

#### Room Lobby
- **Route**: `/rooms/[id]`
- **Component**: `RoomLobby`
- **Features**:
  - Player list with avatars
  - Ready status indicators
  - Deck selection
  - Chat component
  - Start game button (when all ready)
  - Leave room functionality
  - WebSocket integration

#### Create Room
- **Route**: `/rooms` (modal/view)
- **Component**: `CreateRoomForm`
- **Features**:
  - Room name input
  - Max players selection (2-4)
  - Form validation
  - Success redirect to room lobby

### Gameplay

#### Game Board
- **Route**: `/game/[id]`
- **Component**: `GameBoard`
- **Features**:
  - Opponent area with health/energy bars
  - Current player area with health/energy bars
  - Battlefield display
  - Hand display
  - Turn indicator
  - Phase and step display
  - End turn button
  - Card play functionality
  - Attack functionality
  - Real-time updates via WebSocket
  - Concede button

### Player Management

#### Players List
- **Route**: `/players`
- **Component**: `PlayersPage`
- **Features**:
  - List of all players
  - Search functionality
  - Player cards with avatars
  - Stats preview (balance, rank)

#### Player Detail
- **Route**: `/players/[id]`
- **Component**: `PlayerDetail`
- **Features**:
  - Full player profile
  - Account information
  - Statistics (balance, rank)
  - Deck list
  - Member since date

---

## State Management

### React Query (Server State)

React Query manages all server state (API data):

```typescript
// Query example
const { data, isLoading, error } = useQuery({
  queryKey: GET_CARDS_QUERY(),
  queryFn: () => cardsService.list(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutation example
const mutation = useMutation({
  mutationFn: (data) => cardsService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: GET_CARDS_QUERY() });
  },
});
```

**Key Features**:
- Automatic caching
- Background refetching
- Optimistic updates
- Query invalidation
- Error handling
- Loading states

### React Context (Client State)

**AuthContext** (`contexts/auth-context.tsx`)
- Manages authentication state
- Player data
- Loading states
- localStorage persistence

```typescript
const { player, isAuthenticated, isLoading, setPlayer } = useAuth();
```

### Local State

Component-level state using `useState`:
- Form inputs
- UI toggles (modals, dropdowns)
- Temporary selections
- Search queries

---

## API Integration

### Service Layer

All API calls go through service classes:

```typescript
// services/cards.service.ts
export class CardsService {
  private baseUrl = env.NEXT_PUBLIC_API_URL;

  async list(): Promise<Card[]> {
    const response = await fetch(`${this.baseUrl}/cards`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.cards;
  }
}
```

### API Client

Base API client (`services/api-client.ts`) provides:
- Consistent error handling
- Request/response interceptors
- Type-safe requests

### Error Handling

All services handle errors consistently:

```typescript
try {
  const response = await fetch(url);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### React Query Integration

Services are called through React Query hooks:

```typescript
export function useCardsList() {
  return useQuery({
    queryKey: GET_CARDS_QUERY(),
    queryFn: () => cardsService.list(),
    onError: (error) => {
      // Error handling
    },
  });
}
```

---

## Routing

### App Router Structure

Next.js 15 uses the App Router with file-based routing:

```
app/
├── (auth)/              # Route group (no URL segment)
│   ├── signin/
│   │   └── page.tsx    # /signin
│   └── signup/
│       └── page.tsx    # /signup
├── (dashboard)/        # Protected route group
│   ├── layout.tsx      # Shared layout for all dashboard routes
│   ├── dashboard/
│   │   └── page.tsx    # /dashboard
│   ├── cards/
│   │   ├── page.tsx    # /cards
│   │   ├── [id]/
│   │   │   └── page.tsx # /cards/:id
│   │   └── create/
│   │       └── page.tsx # /cards/create
│   └── ...
└── page.tsx            # / (landing page)
```

### Route Protection

Protected routes use the `ProtectedRoute` component:

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <Nav />
      {children}
    </ProtectedRoute>
  );
}
```

### Navigation

Navigation is handled through Next.js `Link` and `useRouter`:

```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Link component
<Link href="/cards">Cards</Link>

// Programmatic navigation
const router = useRouter();
router.push('/cards');
```

---

## Styling & Theming

### Tailwind CSS

The project uses Tailwind CSS for styling:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Aetheria theme colors
        'mystic-dark': '#0d1117',
        'ancient-gold': '#d4af37',
        'mystic-gray': '#a0aec0',
        'emerald-glow': '#38a169',
      },
    },
  },
};
```

### CSS Variables

Shadcn UI uses CSS variables for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

### Aetheria Theme

Custom theme utilities in `globals.css`:

- `.bg-mystic-dark`: Dark background
- `.text-ancient-gold`: Gold text
- `.text-emerald-glow`: Emerald text
- `.shadow-gold-glow`: Gold glow effect
- `.card-rune-border`: Card border effect

### Responsive Design

Mobile-first approach with Tailwind breakpoints:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## Development Guidelines

### Code Style

#### TypeScript

- Use strict mode
- Prefer interfaces over types
- Use type inference where possible
- Avoid `any` type

```typescript
// Good
interface Card {
  id: number;
  name: string;
}

// Bad
const card: any = { ... };
```

#### Component Structure

1. Imports (external, internal, types)
2. Types/interfaces
3. Component definition
4. Hooks
5. Event handlers
6. Render logic

```typescript
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';

interface ComponentProps {
  title: string;
}

export function Component({ title }: ComponentProps) {
  const [state, setState] = useState();
  
  const handleClick = () => { ... };
  
  return <div>...</div>;
}
```

#### Naming Conventions

- **Components**: PascalCase (`CardItem`, `CardsGrid`)
- **Hooks**: camelCase with `use` prefix (`useCardsList`, `useAuth`)
- **Services**: camelCase with `Service` suffix (`cardsService`, `authService`)
- **Types**: PascalCase (`Card`, `CreateCardRequest`)
- **Files**: kebab-case (`card-item.tsx`, `use-cards-list.ts`)

### React Query Best Practices

#### Query Key Factories

Always use query key factories:

```typescript
// ✅ Good
queryKey: GET_CARDS_QUERY()

// ❌ Bad
queryKey: ['cards']
```

#### Error Handling

Always include `onError`:

```typescript
useQuery({
  queryKey: GET_CARDS_QUERY(),
  queryFn: () => cardsService.list(),
  onError: (error: Error) => {
    console.error('Failed to fetch cards:', error);
    // Additional error handling
  },
});
```

#### Success Handling

Include `onSuccess` when needed:

```typescript
useMutation({
  mutationFn: (data) => cardsService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: GET_CARDS_QUERY() });
    router.push('/cards');
  },
});
```

### Form Handling

#### React Hook Form + Zod

Always use React Hook Form with Zod validation:

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});

const onSubmit = (data: FormValues) => {
  mutation.mutate(data);
};
```

### Error Boundaries

Use error boundaries for error handling:

```typescript
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

### Loading States

Always show loading states:

```typescript
if (isLoading) {
  return <Skeleton />;
}
```

### Empty States

Handle empty states:

```typescript
if (!data || data.length === 0) {
  return <EmptyState />;
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Bun 1.0+
- API server running on `http://localhost:3001`
- WebSocket server running on `ws://localhost:8081`

### Installation

```bash
# Install dependencies
cd client
bun install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8081
NODE_ENV=development
```

### Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Type check
bun run type-check

# Lint
bun run lint
```

### Project Structure Guidelines

1. **Components**: Keep components small and focused
2. **Hooks**: Extract reusable logic into custom hooks
3. **Services**: All API calls through services
4. **Types**: Define types close to where they're used
5. **Query Keys**: Centralize in `queryKeys/` directory

### Testing the Application

1. **Sign Up**: Create a new account
2. **Browse Cards**: View all available cards
3. **Create Deck**: Build a custom deck
4. **Create Room**: Start a game room
5. **Join Room**: Join another player's room
6. **Play Game**: Start and play a game
7. **View Profile**: Check player statistics

---

## Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com)

### Project-Specific

- API Documentation: `server/docs/API_DOCUMENTATION.md`
- Backend Architecture: See server documentation

---

## Conclusion

This front-end application provides a complete, modern interface for the Simple TCG game. It follows best practices for React development, type safety, and user experience. The architecture is scalable and maintainable, making it easy to add new features and improvements.

For questions or issues, refer to the codebase or contact the development team.

