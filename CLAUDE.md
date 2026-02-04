# Sigstore Playground

## Project Overview

An interactive, visual educational playground built to teach users how [Sigstore](https://sigstore.dev) works. This is a single-page application that provides three main learning experiences through beautiful animations and interactive controls.

**Purpose**: Help developers and security professionals understand Sigstore's keyless signing workflow in an engaging, visual way.

## Tech Stack

- **Framework**: [SolidJS](https://www.solidjs.com/) - A reactive UI framework with fine-grained reactivity
- **Language**: TypeScript with strict typing
- **Build Tool**: Vite 6.x for fast dev server and optimized builds
- **Animations**: solid-motionone for smooth, declarative animations
- **Styling**: Vanilla CSS with component-scoped stylesheets

## Architecture

### Application Structure

```
src/
├── index.tsx              # Entry point, renders App into DOM
├── App.tsx                # Root component with view routing
├── styles/
│   └── global.css         # Global styles, theme variables
└── components/
    ├── Header.tsx/css     # Navigation between three main views
    ├── SigningJourney.tsx/css    # Step-by-step signing flow visualization
    ├── ComponentExplorer.tsx/css # Deep dive into each Sigstore component
    ├── Quiz.tsx/css       # Knowledge check with 10 questions
    └── Footer.tsx/css     # Links to Sigstore resources
```

### View System

The app uses a simple signal-based view router in [App.tsx](src/App.tsx):
- State: `createSignal<'journey' | 'explorer' | 'quiz'>()`
- Navigation: Header buttons toggle between views
- Rendering: `<Show>` components conditionally render based on current view

### Component Patterns

**SolidJS Reactivity**:
- Use `createSignal()` for state that changes over time
- Use `createEffect()` for side effects that depend on signals
- Avoid unnecessary re-renders through fine-grained reactivity

**Animation Pattern**:
- `<Motion>` component for animated elements
- `<Presence>` for enter/exit animations
- Props: `animate`, `transition`, `exit` for declarative animations

## Key Features

### 1. Signing Journey ([SigningJourney.tsx](src/components/SigningJourney.tsx))

Visualizes the complete Sigstore keyless signing workflow:
- **Steps**: Developer → OIDC → Fulcio → Sign Artifact → Rekor → Verification
- **Controls**: Play/pause, step forward/back, reset
- **Animation**: Smooth transitions between steps with visual components
- **Data**: Array of step objects with titles, descriptions, details, and actions

### 2. Component Explorer ([ComponentExplorer.tsx](src/components/ComponentExplorer.tsx))

Deep dives into each Sigstore component:
- **Cosign**: CLI tool for signing and verification
- **Fulcio**: Certificate authority for identity-based certificates
- **Rekor**: Transparency log for artifact signatures
- **OIDC**: Identity providers (GitHub, Google, etc.)

Each component includes key points, how it works, real-world analogies, and fun facts.

### 3. Quiz ([Quiz.tsx](src/components/Quiz.tsx))

Knowledge check with 10 multiple-choice questions covering:
- Keyless signing concepts
- Certificate lifecycle
- Transparency logs
- Verification workflow

## Development

### Commands

```bash
npm install   # Install dependencies
npm run dev   # Start dev server (http://localhost:5173)
npm run build # Production build to dist/
npm run preview # Preview production build
```

### File Conventions

- **Components**: PascalCase React-style components (Header, SigningJourney)
- **Styles**: Component-scoped CSS files matching component names
- **Types**: Inline TypeScript interfaces within component files
- **Signals**: camelCase with descriptive names (currentView, currentStep)

### Styling Approach

- **Global**: Theme variables and base styles in [global.css](src/styles/global.css)
- **Component**: Each component has its own CSS file for scoped styles
- **Effects**: Animated gradient orbs and grid overlay in App.tsx for visual polish
- **Responsive**: Mobile-friendly layouts with CSS media queries

## Important Notes

### SolidJS Specifics

- **No Virtual DOM**: SolidJS compiles to fine-grained reactivity
- **Immutability**: Signals track changes, don't mutate directly
- **Show vs If**: Use `<Show>` for conditional rendering, not ternaries when possible
- **For vs map**: Use `<For>` for lists to optimize re-renders

### Code Style

- Follow existing patterns in the codebase
- Keep components focused and single-purpose
- Use TypeScript interfaces for complex data structures
- Prefer functional components with hooks over class components

### Testing Considerations

Currently no test suite. When adding tests:
- Consider testing step transitions in SigningJourney
- Validate quiz answer checking logic
- Test component explorer navigation
- Mock animations for faster test execution

## Sigstore Concepts

Understanding these concepts helps maintain accuracy:

1. **Keyless Signing**: No long-lived keys, uses ephemeral keys + identity
2. **Fulcio**: Issues short-lived certificates (~10 min) bound to OIDC identity
3. **Rekor**: Transparency log that stores signatures for verification
4. **OIDC**: Existing identity providers (GitHub, Google) prove who you are
5. **Verification**: Anyone can verify using public Rekor log + certificate

## Resources

- [Sigstore Documentation](https://docs.sigstore.dev)
- [SolidJS Documentation](https://www.solidjs.com/docs/latest)
- [Vite Documentation](https://vitejs.dev)
- [Motion One API](https://motion.dev)

## Contributing

This is an educational tool. When making changes:
- Ensure technical accuracy about Sigstore
- Maintain visual polish and smooth animations
- Keep content accessible and beginner-friendly
- Test on multiple screen sizes