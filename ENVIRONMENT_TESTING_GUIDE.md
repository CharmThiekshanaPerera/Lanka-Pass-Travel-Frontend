# Testing Environment Variables - Command Guide

## Overview
This guide shows how to test your application with different environment configurations (development, local, production).

---

## 1. DEVELOPMENT ENVIRONMENT (.env)

### Start Dev Server with Default .env
```bash
# Using Bun (recommended)
bun run dev

# Using npm
npm run dev

# Using yarn
yarn dev
```
- Uses `.env` file (default)
- API URL: `http://localhost:8000`
- Debug mode: `true`
- Runs on: `http://localhost:8080`

### Verify Which Env is Loaded
```bash
bun run dev
# or
npm run dev

# Check browser console or Network tab for API_URL being used
```

**Expected in browser console:**
```
API URL: http://localhost:8000
Environment: development
```

---

## 2. LOCAL DEVELOPMENT (.env.local)

### Override with Local Env
```bash
# Option 1: Explicit mode flag
bun run dev --mode local
npm run dev --mode local
yarn dev --mode local

# Option 2: Direct command (uses .env.local automatically)
bun run dev
npm run dev
yarn dev
```

**Note:** Vite prioritizes files like this:
1. `.env.local` (highest priority)
2. `.env` (fallback)

### Test with Custom Backend URL
Update `.env.local`:
```env
VITE_API_URL=http://192.168.1.100:8000
VITE_DEBUG_MODE=true
```

Then run:
```bash
bun run dev
# or
npm run dev
```

### Quick Test Commands
```bash
# Test with localhost - Bun
VITE_API_URL=http://localhost:8000 bun run dev

# Test with localhost - npm
VITE_API_URL=http://localhost:8000 npm run dev

# Test with different port - Bun
VITE_API_URL=http://localhost:9000 bun run dev

# Test with different port - npm
VITE_API_URL=http://localhost:9000 npm run dev

# Test with remote server - Bun
VITE_API_URL=http://your-server-ip:8000 bun run dev

# Test with remote server - npm
VITE_API_URL=http://your-server-ip:8000 npm run dev
```

---

## 3. PRODUCTION BUILD & TESTING

### Build for Production (.env.production)
```bash
# Using Bun
bun run build

# Using npm
npm run build

# Using yarn
yarn build
```

**Output:**
- Builds from `.env.production`
- Creates optimized bundle in `dist/` folder
- API URL: `https://13.212.50.145`
- Debug mode: `false`
- Analytics: `true`

### Preview Production Build Locally
```bash
# Build first - Bun
bun run build
bun run preview

# Build first - npm
npm run build
npm run preview

# Build first - yarn
yarn build
yarn preview
```
- Runs on: `http://localhost:4173`
- Uses production build files
- Simulates production environment locally

### Test Production Build with Custom Settings
```bash
# Build with development settings (for testing) - Bun
bun run build:dev
bun run preview

# Build with development settings (for testing) - npm
npm run build:dev
npm run preview

# Build with specific mode - npm
vite build --mode development
vite build --mode production
```

Then preview:
```bash
bun run preview
# or
npm run preview
```

---

## 4. BUILD FOR SPECIFIC ENVIRONMENTS

### Development Build
```bash
# Bun
bun run build:dev

# npm
npm run build:dev

# yarn
yarn build:dev

# or with explicit mode
vite build --mode development
```

### Production Build
```bash
# Bun
bun run build

# npm
npm run build

# yarn
yarn build

# or with explicit mode
vite build --mode production
```

### Custom Mode Build
If you create `.env.staging`:
```bash
vite build --mode staging
```

---

## 5. TESTING CHECKLIST BY ENVIRONMENT

### Development Environment Testing
```bash
bun run dev
# or
npm run dev

# In browser, check:
# 1. API calls go to http://localhost:8000
# 2. Console shows DEBUG_MODE=true
# 3. No security warnings
# 4. Chat feature works
# 5. Admin panel accessible
```

### Local Environment Testing
```bash
# Option 1: Use explicit mode - Bun
bun run dev --mode local

# Option 1: Use explicit mode - npm
npm run dev --mode local

# Option 2: Create .env.local and run dev
bun run dev
# or
npm run dev

# Verify in browser:
# 1. Uses Supabase development project
# 2. File uploads work (max 50MB limit)
# 3. SMS features test with TextLKDemo
# 4. No production API calls
```

### Production Build Testing
```bash
# Build production - Bun
bun run build
bun run preview

# Build production - npm
npm run build
npm run preview

# Check in browser:
# 1. Bundle is minified (very small file size)
# 2. API calls go to https://13.212.50.145
# 3. No console.log debug messages
# 4. Analytics enabled
# 5. HTTPS enforced for cookies
# 6. All features work correctly
```

---

## 6. ENVIRONMENT VERIFICATION COMMANDS

### Check Current Environment in Console
Open browser DevTools Console and run:
```javascript
// Check Vite environment variables
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_ENVIRONMENT)
console.log(import.meta.env.VITE_DEBUG_MODE)
console.log(import.meta.env.VITE_SUPABASE_URL)
```

### Create Test HTML File
Create `test-env.html` in project root:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Environment Check</title>
    <style>
        body { font-family: monospace; padding: 20px; }
        .var { padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
        .prod { background: #ffe0e0; }
        .dev { background: #e0ffe0; }
    </style>
</head>
<body>
    <h1>Environment Variables Check</h1>
    <div id="env"></div>
    <script type="module">
        const env = import.meta.env;
        const html = `
            <div class="var ${env.MODE === 'production' ? 'prod' : 'dev'}">
                <strong>API URL:</strong> ${env.VITE_API_URL}
            </div>
            <div class="var">
                <strong>Environment:</strong> ${env.VITE_ENVIRONMENT}
            </div>
            <div class="var">
                <strong>Debug Mode:</strong> ${env.VITE_DEBUG_MODE}
            </div>
            <div class="var">
                <strong>Supabase URL:</strong> ${env.VITE_SUPABASE_URL}
            </div>
            <div class="var">
                <strong>App Version:</strong> ${env.VITE_APP_VERSION}
            </div>
            <div class="var">
                <strong>Vite Mode:</strong> ${env.MODE}
            </div>
        `;
        document.getElementById('env').innerHTML = html;
    </script>
</body>
</html>
```

Then open: `http://localhost:8080/test-env.html`

---

## 7. TESTING WITH DIFFERENT CONFIGURATIONS

### Quick Switch Between Environments

#### Switch to Local Development
```powershell
# PowerShell
$env:VITE_API_URL="http://localhost:8000"
bun run dev
```

```bash
# Bash/Linux/Mac
VITE_API_URL=http://localhost:8000 bun run dev
```

#### Switch to Production API (test only)
```powershell
# PowerShell - Test production API locally
$env:VITE_API_URL="https://13.212.50.145"
bun run dev
```

```bash
# Bash/Linux/Mac
VITE_API_URL=https://13.212.50.145 bun run dev
```

#### Test with Different Supabase Project
```bash
# Bash
VITE_SUPABASE_URL=https://test-project.supabase.co bun run dev
```

```powershell
# PowerShell
$env:VITE_SUPABASE_URL="https://test-project.supabase.co"
bun run dev
```

---

## 8. ADVANCED TESTING

### Test API Connectivity
Create `test-api.ts` in `src/utils/`:
```typescript
export const testApiConnection = async () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const timeout = import.meta.env.VITE_API_TIMEOUT;
  
  try {
    console.log(`Testing API connection to: ${apiUrl}`);
    const response = await fetch(`${apiUrl}/api/health`, {
      method: 'GET',
    });
    
    if (response.ok) {
      console.log('✅ API is reachable');
      return true;
    } else {
      console.error(`❌ API returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ API connection failed: ${error}`);
    return false;
  }
};
```

Use in component:
```typescript
import { testApiConnection } from '@/utils/test-api';

// In useEffect or button click
const handleTestConnection = async () => {
  const isConnected = await testApiConnection();
  console.log('Connected:', isConnected);
};
```

### Test Supabase Connection
```typescript
export const testSupabaseConnection = async () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log(`Testing Supabase: ${supabaseUrl}`);
    
    if (!anonKey || anonKey.includes('placeholder')) {
      console.warn('⚠️ Supabase key not configured');
      return false;
    }
    
    console.log('✅ Supabase credentials found');
    return true;
  } catch (error) {
    console.error('❌ Supabase check failed:', error);
    return false;
  }
};
```

---

## 9. TROUBLESHOOTING

### Variables Not Updating
```bash
# Clear cache and restart
# 1. Delete node_modules
rm -rf node_modules

# 2. Install fresh
bun install

# 3. Clear .env cache
rm -rf dist

# 4. Restart dev server
bun run dev
```

### Using Wrong Environment File
```bash
# Check which .env files exist
ls -la .env*

# Delete incorrect .env.local if needed
rm .env.local

# Verify .env is being used
cat .env | head -20
```

### API URL Not Changing
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Update .env file
# 3. Restart: bun run dev
# 4. Hard refresh browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
# 5. Check DevTools Console for new API URL
```

### Supabase Connection Issues
```bash
# Check if VITE_SUPABASE_ANON_KEY is valid
cat .env | grep SUPABASE_ANON_KEY

# It should NOT be:
# - Empty
# - "placeholder"
# - "your-supabase-anon-key"
# - A service_role_key (too long, different format)
```

---

## 10. CI/CD TESTING (GitHub Actions Example)

### Test Command for CI/CD
```yaml
# .github/workflows/test.yml
name: Test Environments

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Build (Development)
        run: bun run build:dev
      
      - name: Build (Production)
        run: bun run build
      
      - name: Lint
        run: bun run lint
```

---

## 11. QUICK REFERENCE

| Task | Bun | npm | yarn |
|------|-----|-----|------|
| **Dev with .env** | `bun run dev` | `npm run dev` | `yarn dev` |
| **Dev with .env.local** | `bun run dev --mode local` | `npm run dev --mode local` | `yarn dev --mode local` |
| **Build production** | `bun run build` | `npm run build` | `yarn build` |
| **Preview production build** | `bun run preview` | `npm run preview` | `yarn preview` |
| **Build development** | `bun run build:dev` | `npm run build:dev` | `yarn build:dev` |
| **Test API URL** | `console.log(import.meta.env.VITE_API_URL)` |
| **Change API at runtime** | Update `.env.local` or use `VITE_API_URL=... bun run dev` | Use `VITE_API_URL=... npm run dev` |
| **Clear cache** | `rm -r dist node_modules && bun install` | `rm -r dist node_modules && npm install` |
| **Check environment** | `cat .env \| grep VITE_API_URL` | `cat .env \| grep VITE_API_URL` |

---

## Summary

- **Local Development**: `bun run dev` or `npm run dev` (uses .env or .env.local)
- **Test Production**: `bun run build && bun run preview` or `npm run build && npm run preview`
- **Switch APIs**: Update `.env.local` or use environment variable prefix
- **Verify Setup**: `console.log(import.meta.env)` in browser
- **Production Deploy**: `bun run build` or `npm run build` for production bundle
