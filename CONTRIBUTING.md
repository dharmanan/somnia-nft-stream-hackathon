# Contributing to Somnia NFT Stream

Thank you for your interest in contributing! This guide outlines the process for submitting changes.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development

### Running the Frontend

```bash
npm run dev
```

### Running the Backend

```bash
cd backend
npm start
```

### Environment Variables

Copy `.env.production` to `.env.local` and fill in the required values before running locally.

## Submitting a Pull Request

Please follow the PR body format described in [docs/pr-format-validation.md](docs/pr-format-validation.md).

### PR Title Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) prefixes:

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Maintenance, tooling |
| `docs:` | Documentation only |
| `refactor:` | Code restructure without behavior change |
| `test:` | Adding or updating tests |

### Example PR Title

```
feat: add real-time bid notifications via WebSocket
```

## Code Style

- TypeScript is used for frontend components (`*.tsx`, `*.ts`)
- JavaScript is used for API routes and backend (`*.js`)
- Keep components in the `components/` directory
- Keep Vercel API handlers in `api/`
- Keep backend Express logic in `backend/`

## Questions

Open an issue if you have questions or need clarification before starting work on a larger change.
