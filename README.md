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
npm run sbom          # Generate SBOM (Software Bill of Materials)
npm run sbom:check    # Generate SBOM with verification message
```

## Pre-commit Hook

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to automatically:

1. **Lint** staged files with ESLint (and auto-fix when possible)
2. **Format** staged files with Prettier
3. **Test** only the files related to your changes

This ensures code quality and prevents broken commits from entering the repository.

## Sigstore Integration

This project practices what it teaches by using Sigstore for security:

### Commit Signing with Gitsign

All commits are signed using [gitsign](https://github.com/sigstore/gitsign), providing keyless commit signing with:
- OIDC-based identity verification
- Transparency via Rekor logging
- No long-lived keys to manage

The repository is configured with:
```bash
git config commit.gpgsign true
git config gpg.x509.program gitsign
git config gpg.format x509
```

### SBOM Generation

Software Bill of Materials (SBOM) is automatically generated in CI/CD:
- Format: CycloneDX JSON
- Generated on every CI build
- Signed with Cosign
- Published as build artifacts

You can generate an SBOM locally with:
```bash
npm run sbom
```

This creates `sbom.json` in CycloneDX format, listing all dependencies.

## License

MIT
