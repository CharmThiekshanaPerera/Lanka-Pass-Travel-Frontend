# Local vs Production Testing

This repo uses Vite modes to load environment files.

## Local (uses `.env.local`)

1. Install dependencies:
```bash
npm install
```
2. Start the dev server:
```bash
npm run dev -- --mode local
```

Alternatives:
```bash
pnpm install
pnpm dev -- --mode local
```
```bash
yarn install
yarn dev --mode local
```

## Production (uses `.env.production`)

1. Build:
```bash
npm run build -- --mode production
```
2. Preview the production build locally:
```bash
npm run preview -- --mode production
```

Alternatives:
```bash
pnpm build -- --mode production
pnpm preview -- --mode production
```
```bash
yarn build --mode production
yarn preview --mode production
```
