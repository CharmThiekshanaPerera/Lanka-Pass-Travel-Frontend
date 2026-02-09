# Quick Command Reference - Testing Environments

## 🚀 FASTEST COMMANDS

### Development (Default)
```bash
# Using Bun (recommended)
bun run dev

# Using npm
npm run dev

# Using yarn
yarn dev
```
- Runs on http://localhost:8080
- Uses .env or .env.local
- API: http://localhost:8000

### Local Development
```bash
bun run dev --mode local
npm run dev --mode local
yarn dev --mode local
```
- Same as above - prioritizes .env.local

### Production Build (Local Test)
```bash
# Bun
bun run build
bun run preview

# npm
npm run build
npm run preview

# yarn
yarn build
yarn preview
```
- Build optimized, preview on http://localhost:4173
- Uses .env.production
- API: https://13.212.50.145

---

## 🎯 ENVIRONMENT-SPECIFIC TESTING

### Test 1: Development API
```powershell
# PowerShell - Bun
$env:VITE_API_URL="http://localhost:8000"
bun run dev

# PowerShell - npm
$env:VITE_API_URL="http://localhost:8000"
npm run dev
```

```bash
# Bash - Bun
VITE_API_URL=http://localhost:8000 bun run dev

# Bash - npm
VITE_API_URL=http://localhost:8000 npm run dev
```

### Test 2: Remote API (Staging)
```powershell
# PowerShell - Bun
$env:VITE_API_URL="http://staging-api.example.com"
bun run dev

# PowerShell - npm
$env:VITE_API_URL="http://staging-api.example.com"
npm run dev
```

```bash
# Bash - Bun
VITE_API_URL=http://staging-api.example.com bun run dev

# Bash - npm
VITE_API_URL=http://staging-api.example.com npm run dev
```

### Test 3: Production API
```powershell
# PowerShell - Bun
$env:VITE_API_URL="https://13.212.50.145"
bun run dev

# PowerShell - npm
$env:VITE_API_URL="https://13.212.50.145"
npm run dev
```

```bash
# Bash - Bun
VITE_API_URL=https://13.212.50.145 bun run dev

# Bash - npm
VITE_API_URL=https://13.212.50.145 npm run dev
```

---

## 🔍 VERIFY ENVIRONMENTS

### Check What Environment is Running
Open browser console (F12) and run:
```javascript
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_ENVIRONMENT)
console.log(import.meta.env.VITE_DEBUG_MODE)
```

### Check Environment Files
```powershell
# PowerShell - View development config
cat .env | Select-String "VITE_"

# View local config
cat .env.local | Select-String "VITE_"

# View production config
cat .env.production | Select-String "VITE_"
```

```bash
# Bash - View configs
grep VITE_ .env
grep VITE_ .env.local
grep VITE_ .env.production
```

---

## 🛠️ QUICK SWITCHES

### Switch to Different API via .env.local
```
1. Open .env.local
2. Change: VITE_API_URL=http://your-api-url
3. Save file
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
5. Check console to verify
```

### Temporary Override (No File Changes)
```powershell
# PowerShell - Bun
$env:VITE_API_URL="http://test-api:8000"; bun run dev

# PowerShell - npm
$env:VITE_API_URL="http://test-api:8000"; npm run dev
```

```bash
# Bash - Bun
VITE_API_URL=http://test-api:8000 bun run dev

# Bash - npm
VITE_API_URL=http://test-api:8000 npm run dev
```

---

## 📦 BUILD FOR DIFFERENT TARGETS

### Build Development (for testing)
```bash
# Bun
bun run build:dev

# npm
npm run build:dev

# yarn
yarn build:dev
```
- Uses .env (development settings)
- Useful for testing build process

### Build Production
```bash
# Bun
bun run build

# npm
npm run build

# yarn
yarn build
```
- Uses .env.production
- Optimized, minified, no debug output

### Build with Specific Mode
```bash
vite build --mode development
vite build --mode production
vite build --mode staging  # if you create .env.staging
```

---

## 🧪 TEST YOUR SETUP

### Browser Console Test
```javascript
// Check if Supabase is configured
console.log(import.meta.env.VITE_SUPABASE_URL)

// Check if SMS is available
console.log(import.meta.env.VITE_SMS_SENDER_ID)

// Check API timeout
console.log(import.meta.env.VITE_API_TIMEOUT)

// Full environment dump
console.log({
  api: import.meta.env.VITE_API_URL,
  env: import.meta.env.VITE_ENVIRONMENT,
  debug: import.meta.env.VITE_DEBUG_MODE,
  supabase: import.meta.env.VITE_SUPABASE_URL
})
```

### Test API Connection
```javascript
// In browser console
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ API OK:', d))
  .catch(e => console.log('❌ API Error:', e))
```

---

## 🔄 HELPER SCRIPTS

### Using env-switch.ps1 (PowerShell - Windows)
```powershell
# Make script executable (one-time)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run commands
.\env-switch.ps1 dev
.\env-switch.ps1 local
.\env-switch.ps1 prod
.\env-switch.ps1 preview
.\env-switch.ps1 test-env
```

### Using env-switch.sh (Bash - Linux/Mac)
```bash
# Make executable (one-time)
chmod +x env-switch.sh

# Run commands
./env-switch.sh dev
./env-switch.sh local
./env-switch.sh prod
./env-switch.sh preview
./env-switch.sh test-env
```

---

## 📋 TESTING CHECKLIST

### ✔️ Development Environment
- [ ] `bun run dev` or `npm run dev` starts without errors
- [ ] Dev server runs on http://localhost:8080
- [ ] API calls use http://localhost:8000
- [ ] Console shows VITE_DEBUG_MODE=true
- [ ] Chat feature works
- [ ] Admin panel accessible

### ✔️ Local Environment
- [ ] `.env.local` exists and has custom values
- [ ] `bun run dev --mode local` or `npm run dev --mode local` prioritizes .env.local
- [ ] Supabase connection works
- [ ] File uploads allowed up to 50MB
- [ ] SMS features test correctly

### ✔️ Production Environment
- [ ] `bun run build` or `npm run build` completes without errors
- [ ] `dist/` folder contains optimized files
- [ ] `bun run preview` or `npm run preview` shows minified bundle
- [ ] API calls use https://13.212.50.145
- [ ] No debug output in console
- [ ] All features work (no console errors)

---

## 🆘 COMMON ISSUES

### Variables Not Updating
```bash
# Stop dev server (Ctrl+C)

# Clear cache and restart - Bun
rm -r dist
bun run dev

# Clear cache and restart - npm
rm -r dist
npm run dev

# Hard refresh browser (Ctrl+Shift+R)
```

### Wrong API URL Being Used
```bash
# 1. Check .env files
cat .env.local | grep VITE_API_URL

# 2. Check browser console
console.log(import.meta.env.VITE_API_URL)

# 3. Restart dev server with Bun or npm
bun run dev  # or npm run dev
```

### Build Failing
```bash
# Clear node_modules and rebuild - Bun
rm -r node_modules
bun install
bun run build

# Clear node_modules and rebuild - npm
rm -r node_modules
npm install
npm run build

# Or clean start - npm
npm run build --mode production
```

---

## 📞 ENV FILE LOCATIONS

| File | Purpose | Git Tracked | Use Case |
|------|---------|-------------|----------|
| `.env` | Development defaults | ✅ Yes | Default config, shareable |
| `.env.local` | Local overrides | ❌ No | Personal machine settings |
| `.env.production` | Production config | ✅ Yes | Production build settings |
| `.env.example` | Template | ✅ Yes | Documentation, team reference |

---

## 📦 PACKAGE MANAGER EQUIVALENTS

All commands work with **Bun**, **npm**, and **yarn**. Choose whichever you prefer:

| Task | Bun | npm | yarn |
|------|-----|-----|------|
| Install dependencies | `bun install` | `npm install` | `yarn install` |
| Start dev server | `bun run dev` | `npm run dev` | `yarn dev` |
| Build production | `bun run build` | `npm run build` | `yarn build` |
| Build development | `bun run build:dev` | `npm run build:dev` | `yarn build:dev` |
| Preview build | `bun run preview` | `npm run preview` | `yarn preview` |
| Run linter | `bun run lint` | `npm run lint` | `yarn lint` |

---



- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [ENVIRONMENT_TESTING_GUIDE.md](./ENVIRONMENT_TESTING_GUIDE.md) - Detailed guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Setup instructions
- [ENV_SECURITY_NOTES.md](./ENV_SECURITY_NOTES.md) - Security best practices
