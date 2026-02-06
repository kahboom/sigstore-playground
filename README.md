# Sigstore Playground

[![codecov](https://codecov.io/gh/kahboom/sigstore-playground/graph/badge.svg)](https://codecov.io/gh/kahboom/sigstore-playground)

An interactive, visual playground to learn how [Sigstore](https://sigstore.dev) works! Built with SolidJS and TypeScript.

## Features

### Signing Journey
Step through the entire Sigstore signing flow with beautiful animations:
- Watch how keyless signing works step-by-step
- Interactive controls to pause, play, and navigate
- Visual representations of each component (Cosign, Fulcio, Rekor, OIDC)

### Component Explorer
Deep dive into each piece of the Sigstore ecosystem:
- **Cosign** - The signing Swiss army knife
- **Fulcio** - Identity-based certificate authority
- **Rekor** - Immutable transparency log
- **OIDC Providers** - Your existing identity for signing

Each component includes:
- Key points and features
- Step-by-step how it works
- Real-world analogies
- Fun facts

### Knowledge Quiz
Test your understanding with questions covering:
- Keyless signing concepts
- Certificate lifecycle
- Transparency logs
- Verification workflow

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing with comprehensive coverage of all components.

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test -- --run

# Run tests with coverage report
npm run coverage
```

### Test Coverage

Test coverage includes:
- Component rendering and behavior
- User interactions and navigation  
- Mobile responsiveness (375px, 768px, 1024px viewports)
- Edge cases and error states

Coverage reports are automatically uploaded to [Codecov](https://codecov.io/gh/kahboom/sigstore-playground) on every push.

## Tech Stack

- **[SolidJS](https://www.solidjs.com/)** - Reactive UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool
- **[solid-motionone](https://github.com/solidjs-community/solid-motionone)** - Animations

## Learn More About Sigstore

- [Sigstore Documentation](https://docs.sigstore.dev)
- [Sigstore Blog](https://blog.sigstore.dev)
- [GitHub Organization](https://github.com/sigstore)
- [Slack Community](https://slack.sigstore.dev)
