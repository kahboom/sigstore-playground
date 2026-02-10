# Sigstore Playground

An interactive, visual educational playground to learn how [Sigstore](https://sigstore.dev) works.

## Development

```bash
npm install
npm run dev
```

## Testing

All code is linted, formatted, and tested automatically before each commit via pre-commit hooks.

### Manual Commands

```bash
npm run lint          # Check for linting errors
npm run format        # Check formatting
npm run format:fix    # Fix formatting issues
npm test              # Run tests in watch mode
npm run coverage      # Run tests with coverage report
```

## Pre-commit Hook

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to automatically:

1. **Lint** staged files with ESLint (and auto-fix when possible)
2. **Format** staged files with Prettier
3. **Test** only the files related to your changes

This ensures code quality and prevents broken commits from entering the repository.

## License

MIT
