# Frontend Testing Files & Commands Reference

Complete reference for all testing files, utilities, and how to run tests.

## 📁 Testing Files Overview

| File | Purpose | Type | Access |
|------|---------|------|--------|
| **FRONTEND_TESTING_GUIDE.md** | Complete testing guide | Documentation | Read directly |
| **src/utils/testConnections.ts** | Connection test utilities | TypeScript | Import & use |
| **src/components/testing/ConnectionTestPanel.tsx** | Testing UI component | React | `/testing` page |
| **src/pages/TestingPage.tsx** | Testing dashboard page | React | `/testing` route |
| **test-frontend.sh** | Bash test script | Shell | `./test-frontend.sh` |
| **test-frontend.ps1** | PowerShell test script | PowerShell | `.\test-frontend.ps1` |

---

## 🚀 Quick Start

### Method 1: Visual Testing (Easiest)

1. **Start frontend:**
   ```bash
   npm run dev
   ```

2. **Open testing page:**
   ```
   http://localhost:8080/testing
   ```

3. **Click "Run All Tests" button**

✅ Done! Results display in the UI.

### Method 2: Automated Script Testing

#### Windows (PowerShell):
```powershell
# Test with default localhost:8000
.\test-frontend.ps1

# Test with specific API
.\test-frontend.ps1 -ApiUrl "http://your-backend:8000"

# Verbose output
.\test-frontend.ps1 -Verbose
```

#### Linux/Mac (Bash):
```bash
# Make executable (one-time)
chmod +x test-frontend.sh

# Test with default localhost:8000
./test-frontend.sh

# Test with specific API
./test-frontend.sh http://your-backend:8000

# Verbose output
./test-frontend.sh http://your-backend:8000 true
```

### Method 3: Programmatic Testing

```typescript
import { 
  runAllTests, 
  logTestResults,
  testApiHealth,
  testLoginEndpoint
} from '@/utils/testConnections'

// Run all tests
const results = await runAllTests()
logTestResults(results)

// Run specific tests
const apiTest = await testApiHealth()
const loginTest = await testLoginEndpoint()
```

---

## 📋 Testing Scenarios

### Test 1: Local Backend Testing

**Step 1: Update .env.local**
```env
VITE_API_URL=http://localhost:8000
VITE_ENVIRONMENT=local
VITE_DEBUG_MODE=true
```

**Step 2: Start Backend**
```bash
# Python/FastAPI
python -m uvicorn main:app --reload --port 8000

# Node.js/Express
npm start

# Docker
docker-compose up
```

**Step 3: Start Frontend**
```bash
npm run dev
```

**Step 4: Test**
```bash
# Option A: Visual
# Open http://localhost:8080/testing and click buttons

# Option B: Script
./test-frontend.sh http://localhost:8000

# Option C: Console
import { runAllTests, logTestResults } from '@/utils/testConnections'
const results = await runAllTests()
logTestResults(results)
```

**Expected Results:**
```
✅ API Health Check: PASSED
✅ Login Endpoint: PASSED
✅ Supabase Configuration: PASSED/WARNING
✅ Environment Variables: PASSED
```

---

### Test 2: Production Backend Testing

**Step 1: Build for Production**
```bash
npm run build
```

**Step 2: Preview Production Build**
```bash
npm run preview
```

**Step 3: Run Tests**
```
http://localhost:4173/testing
```

Or in console:
```javascript
import { runAllTests, logTestResults } from '@/utils/testConnections'
const results = await runAllTests()
logTestResults(results)
```

**Expected Results:**
```
✅ API Health Check: https://13.212.50.145 (PASSED)
✅ Login Endpoint: https://13.212.50.145 (PASSED)
✅ Environment Variables: PASSED (VITE_ENVIRONMENT=production)
✅ No debug output in console
```

---

### Test 3: Different API Servers

**Override API at runtime:**

```powershell
# PowerShell - Staging
$env:VITE_API_URL="http://staging-api.example.com"
npm run dev

# PowerShell - Production
$env:VITE_API_URL="https://13.212.50.145"
npm run dev
```

```bash
# Bash - Staging
VITE_API_URL=http://staging-api.example.com npm run dev

# Bash - Production
VITE_API_URL=https://13.212.50.145 npm run dev
```

Then test via `/testing` page.

---

## 🧪 Available Tests

### What Gets Tested Automatically

| Test | Purpose | Endpoint |
|------|---------|----------|
| **API Health Check** | Is backend running? | `GET /api/health` |
| **Login Endpoint** | Is auth working? | `POST /api/auth/login` |
| **Supabase Config** | Is Supabase configured? | - | 
| **Environment Vars** | Are all vars set? | - |
| **Response Times** | How fast is API? | All endpoints |
| **CORS Headers** | Are CORS enabled? | All requests |

---

## 📊 Understanding Test Results

### Success Results
```
✅ PASSED: API Health Check
   API is healthy | Status: ok
   Duration: 124ms
```

### Warning Results
```
⚠️  WARNING: Supabase Configuration
   Supabase key appears to be a placeholder
```

### Error Results  
```
❌ FAILED: API Health Check
   Connection failed: Failed to connect to API
```

---

## 🛠️ Troubleshooting Failed Tests

### "Cannot connect to API"
```bash
# 1. Check backend is running
curl http://localhost:8000/api/health

# 2. Verify VITE_API_URL in browser
console.log(import.meta.env.VITE_API_URL)

# 3. Check .env file
cat .env | grep VITE_API_URL

# 4. Look at Network tab in DevTools (F12)
```

### "API returned status 404"
```bash
# Backend is running but endpoint doesn't exist
# Check:
# 1. Correct API URL
# 2. Backend has /api/health endpoint
# 3. Try direct curl: curl http://localhost:8000/api/health
```

### "Test timeouts"
```bash
# Increase timeout in .env
VITE_API_TIMEOUT=60000  # 60 seconds

# Then restart: npm run dev
```

### "env variables undefined"
```bash
# 1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R Mac)
# 2. Stop and restart: npm run dev
# 3. Clear cache: rm -r dist node_modules/.vite
# 4. Verify .env exists: cat .env
```

---

## 🎯 Testing Checklist

### Before Local Testing ✓
- [ ] `.env.local` exists
- [ ] `VITE_API_URL=http://localhost:8000`
- [ ] Backend running on port 8000
- [ ] No port conflicts
- [ ] Backend database connected

### Before Production Testing ✓
- [ ] `.env.production` configured
- [ ] `VITE_API_URL=https://13.212.50.145`
- [ ] Build succeeds: `npm run build`
- [ ] `dist/` folder generated
- [ ] All tests pass in preview
- [ ] Supabase credentials valid

### After Deployment ✓
- [ ] Site loads at production URL
- [ ] Run tests from production URL
- [ ] No console errors
- [ ] Main features work
- [ ] Network requests normal
- [ ] Check on mobile
- [ ] Monitor logs

---

## 📈 Test Commands Reference

### Run Tests

| Command | Platform | Purpose |
|---------|----------|---------|
| `./test-frontend.sh` | Linux/Mac | Run shell script tests |
| `./test-frontend.sh http://api:8000` | Linux/Mac | Test custom API |
| `.\test-frontend.ps1` | PowerShell | Run script tests |
| `.\test-frontend.ps1 -ApiUrl "http://api:8000"` | PowerShell | Test custom API |
| Navigate to `/testing` | Browser | Visual test UI |

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server + watch |
| `npm run build:dev` | Build with dev config |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |

### Environment Switching

```bash
# Local development
npm run dev

# Test production locally
npm run build && npm run preview

# Test with different API
VITE_API_URL=http://staging:8000 npm run dev

# Clear cache
rm -r dist node_modules/.vite
npm run dev
```

---

## 📱 Browser Console Testing

Open DevTools (F12) and run:

```javascript
// Check current environment
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_ENVIRONMENT)

// Run all tests
import { runAllTests, logTestResults } from '@/utils/testConnections'
const results = await runAllTests()
logTestResults(results)

// Test specific endpoint
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(r => r.json())
  .then(d => console.log('✅', d))
  .catch(e => console.log('❌', e))

// Export results
import { exportTestResultsAsJSON } from '@/utils/testConnections'
const json = exportTestResultsAsJSON(results)
console.log(json)
```

---

## 🔄 CI/CD Integration

### GitHub Actions

Add `.github/workflows/test.yml`:

```yaml
name: Test Frontend

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install
        run: npm install
      
      - name: Build (Dev)
        run: npm run build:dev
      
      - name: Build (Prod)
        run: npm run build
        env:
          VITE_API_URL: https://13.212.50.145
```

---

## 📞 Support

- 📖 [FRONTEND_TESTING_GUIDE.md](./FRONTEND_TESTING_GUIDE.md) - Detailed guide
- 📖 [ENVIRONMENT_TESTING_GUIDE.md](./ENVIRONMENT_TESTING_GUIDE.md) - Environment setup
- 📖 [QUICK_COMMANDS.md](./QUICK_COMMANDS.md) - Command reference
- 📖 [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables

---

## 🎯 Summary

| Scenario | Command | Expected |
|----------|---------|----------|
| Test local backend | `./test-frontend.sh http://localhost:8000` | ✅ All pass |
| Test production | `npm run build && npm run preview` then visit `/testing` | ✅ API = https://... |
| Quick UI test | Navigate to `/testing` | ✅ All buttons work |
| Debug console | `F12` then run snippet | ✅ See detailed logs |
| CI/CD test | GitHub Actions | ✅ Auto tests on push |

**Start testing now!** 🚀
