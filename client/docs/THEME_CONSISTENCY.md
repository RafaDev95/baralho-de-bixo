# Theme Consistency Guide

## Aetheria Color Palette

The application uses a consistent dark theme with the following color palette:

### Primary Colors

- **Mystic Dark** (`#0d1117`): Primary background color
  - Used for: Main backgrounds, page backgrounds
  - CSS: `bg-mystic-dark`, `text-mystic-dark`

- **Ancient Gold** (`#d4af37`): Primary accent color
  - Used for: Headings, buttons, highlights, borders
  - CSS: `bg-ancient-gold`, `text-ancient-gold`, `border-ancient-gold`

- **Mystic Gray** (`#a0aec0`): Secondary text and borders
  - Used for: Secondary text, borders, muted elements
  - CSS: `text-mystic-gray`, `border-mystic-gray`

- **Emerald Glow** (`#38a169`): Accent color for actions
  - Used for: Success states, action buttons, highlights
  - CSS: `bg-emerald-glow`, `text-emerald-glow`

### Stone Carving (`#2d3748`): Card backgrounds
- Used for: Card components, elevated surfaces
- CSS: `bg-stone-carving`

## Theme Application

### Global Theme

The dark theme is applied globally through:

1. **Root Layout** (`app/layout.tsx`):
   - `className="dark"` on `<html>` element
   - `bg-mystic-dark text-white` on `<body>` element

2. **CSS Variables** (`app/globals.css`):
   - Dark mode CSS variables use Aetheria colors
   - All Shadcn UI components automatically use these variables

### Page-Specific Themes

#### Home Page (`app/page.tsx`)
- Background: `bg-mystic-dark`
- Text: `text-white` for main text, `text-ancient-gold` for headings
- Buttons: Golden buttons with glow effects
- Navigation: Dark header with golden logo

#### Authentication Pages (`app/(auth)/`)
- Layout: Dark background with Aetheria header
- Forms: Dark cards with golden borders (`bg-stone-carving border-ancient-gold`)
- Inputs: Dark backgrounds with golden focus states
- Buttons: Golden primary buttons

#### Dashboard Pages (`app/(dashboard)/`)
- Layout: Dark background throughout
- Cards: `bg-stone-carving border-mystic-gray`
- Text: White for headings, mystic-gray for descriptions
- Icons: Colored with theme colors (gold, emerald, etc.)

## Component Styling Guidelines

### Cards
```tsx
<Card className="bg-stone-carving border-mystic-gray">
  <CardHeader>
    <CardTitle className="text-white">Title</CardTitle>
    <CardDescription className="text-mystic-gray">Description</CardDescription>
  </CardHeader>
</Card>
```

### Buttons
```tsx
// Primary action
<Button className="bg-ancient-gold text-mystic-dark hover:bg-ancient-gold/90">
  Action
</Button>

// Secondary action
<Button variant="outline" className="border-ancient-gold text-ancient-gold">
  Action
</Button>
```

### Inputs
```tsx
<Input className="bg-mystic-dark/50 border-mystic-gray text-white placeholder:text-mystic-gray focus:border-ancient-gold" />
```

### Navigation
- Header: `bg-mystic-dark bg-opacity-90 backdrop-blur-sm`
- Sidebar: `bg-mystic-dark/50 border-mystic-gray`
- Active links: `text-ancient-gold border-l-2 border-ancient-gold`

## Color Usage Rules

1. **Backgrounds**: Always use `bg-mystic-dark` for main backgrounds
2. **Cards**: Use `bg-stone-carving` for elevated surfaces
3. **Text**: 
   - Primary: `text-white`
   - Secondary: `text-mystic-gray`
   - Accent: `text-ancient-gold`
4. **Borders**: Use `border-mystic-gray` for subtle borders, `border-ancient-gold` for emphasis
5. **Buttons**: Primary actions use `bg-ancient-gold`, secondary use outline with golden border
6. **Icons**: Use theme colors (gold for important, emerald for actions, gray for secondary)

## Special Effects

### Glow Effects
- `shadow-gold-glow`: Golden glow for important elements
- `shadow-purple-glow`: Purple glow for special effects
- `shadow-orange-glow`: Orange glow for CTAs

### Borders
- `card-rune-border`: Special border effect for cards
- `border-2 border-ancient-gold`: Emphasized borders

## Consistency Checklist

When creating or updating pages, ensure:

- [ ] Background uses `bg-mystic-dark`
- [ ] Text uses appropriate theme colors (white, gray, gold)
- [ ] Cards use `bg-stone-carving border-mystic-gray`
- [ ] Buttons follow color guidelines
- [ ] Inputs have dark backgrounds with golden focus
- [ ] Icons use theme colors
- [ ] Navigation matches theme
- [ ] Loading states use dark theme
- [ ] Error messages use appropriate colors

## Examples

### Good Example (Dashboard Card)
```tsx
<Card className="bg-stone-carving border-mystic-gray">
  <CardHeader>
    <CardTitle className="text-white">Title</CardTitle>
    <CardDescription className="text-mystic-gray">Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-white">Content</p>
  </CardContent>
</Card>
```

### Good Example (Form Input)
```tsx
<Input
  className="bg-mystic-dark/50 border-mystic-gray text-white placeholder:text-mystic-gray focus:border-ancient-gold"
  placeholder="Enter text"
/>
```

### Good Example (Button)
```tsx
<Button className="bg-ancient-gold text-mystic-dark hover:bg-ancient-gold/90 font-cinzel font-bold">
  Action
</Button>
```

## Theme Variables Reference

All theme colors are available as:
- Tailwind utilities: `bg-mystic-dark`, `text-ancient-gold`, etc.
- CSS variables: `--background`, `--primary`, `--muted-foreground`, etc.
- Custom utilities: Defined in `globals.css`

## Notes

- The theme is always dark mode (no light mode toggle)
- All pages should maintain visual consistency
- Golden accents should be used sparingly for emphasis
- Emerald green is reserved for success states and special actions

