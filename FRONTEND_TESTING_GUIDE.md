# Frontend Testing Guide - Local & Production

Complete guide to testing your frontend with local backend and production environments.

## 🎯 Overview

This guide covers:
- Testing with local backend
- Testing with production backend
- API connectivity verification
- Environment configuration validation
- Integration testing
- Performance testing

---

## 1. SETUP TESTING ENVIRONMENT

### Install Testing Dependencies
```bash
# Using npm
npm install

# Using bun
bun install
```

### Available Test Pages & Components

| Component | Path | Purpose |
|-----------|------|---------|
| **Testing Dashboard** | `/testing` or `/test` | Visual testing interface |
| **Connection Tests** | Source: `src/utils/testConnections.ts` | Programmatic testing utilities |
| **Test Panel** | `src/components/testing/ConnectionTestPanel.tsx` | UI component for testing |

---

## 2. LOCAL BACKEND TESTING

### Prerequisites

- Backend running on `http://localhost:8000`
- Backend should have `/api/health` endpoint
- Backend should have `/api/auth/login` endpoint

### Step 1: Update Environment

Create/update `.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_ENVIRONMENT=local
VITE_DEBUG_MODE=true
```

### Step 2: Start Frontend Dev Server

```bash
# Using bun
bun run dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

Access frontend: `http://localhost:8080`

### Step 3: Start Backend Locally

In a separate terminal, start your backend:

```bash
# If Python/FastAPI
python -m uvicorn main:app --reload --port 8000

# If Node.js/Express
npm start
# or
node index.js

# If Go
./main

# Docker
docker-compose up
```

### Step 4: Run Tests

**Option A: Using Visual Testing Dashboard**
```
1. Open http://localhost:8080/testing
2. Click "Run All Tests" button
3. Review results
```

**Option B: Using Browser Console**
```javascript
// Open DevTools (F12) and paste:
import { runAllTests, logTestResults } from '/src/utils/testConnections.ts'
const results = await runAllTests()
logTestResults(results)
```

**Option C: Using Programmatic API**
```typescript
// In your component
import { testApiHealth, testLoginEndpoint } from '@/utils/testConnections'

const handleTest = async () => {
  const apiTest = await testApiHealth()
  console.log('API Test:', apiTest)
  
  const loginTest = await testLoginEndpoint()
  console.log('Login Test:', loginTest)
}
```

### Expected Results

✅ **All tests should PASS:**
- API Health Check: ✅ Passed
- Login Endpoint: ✅ Passed
- Supabase Configuration: ✅ Passed (or ⚠️ Warning if placeholder)
- Environment Variables: ✅ Passed

---

## 3. PRODUCTION BACKEND TESTING

### Prerequisites

- Production backend running at `https://13.212.50.145`
- Valid Supabase credentials
- Production environment configured

### Step 1: Build for Production

```bash
# Using bun
bun run build

# Using npm
npm run build

# Using yarn
yarn build
```

This uses `.env.production` with:
```env
VITE_API_URL=https://13.212.50.145
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
```

### Step 2: Preview Production Build Locally

```bash
# Using bun
bun run preview

# Using npm
npm run preview

# Using yarn
yarn preview
```

Access preview: `http://localhost:4173`

### Step 3: Run Production Tests

Navigate to `http://localhost:4173/testing` and run all tests.

**Expected Results:**
- All API tests should use `https://13.212.50.145`
- No debug output in console
- Analytics should be enabled
- Secure cookies should be enforced

### Step 4: Deploy to Production

Once tests pass:

```bash
# Build again to ensure cache is fresh
npm run build

# Deploy dist/ folder to your hosting
# (GitHub Pages, Vercel, AWS S3, etc.)
```

---

## 4. TESTING DIFFERENT SCENARIOS

### Scenario 1: Switch Between APIs at Runtime

**Local to Production:**
```powershell
# PowerShell
$env:VITE_API_URL="https://13.212.50.145"
npm run dev
```

```bash
# Bash
VITE_API_URL=https://13.212.50.145 npm run dev
```

Then run tests from `/testing` page.

### Scenario 2: Test with Staging API

Update `.env.local`:
```env
VITE_API_URL=http://staging-api.example.com:8000
VITE_ENVIRONMENT=staging
```

```bash
npm run dev
```

Run tests from `/testing` page.

### Scenario 3: Test Auth Flow

```typescript
// In browser console
import { testLoginEndpoint } from '@/utils/testConnections'

// Test with your actual credentials
const result = await testLoginEndpoint('your@email.com', 'password')
console.log('Auth Test:', result)
```

### Scenario 4: Test File Uploads

Create a test file in `src/utils/testFileUpload.ts`:

```typescript
export const testFileUpload = async (file: File): Promise<void> => {
  const apiUrl = import.meta.env.VITE_API_URL
  const maxSize = import.meta.env.VITE_MAX_FILE_UPLOAD_SIZE * 1024 * 1024
  
  // Check file size
  if (file.size > maxSize) {
    throw new Error(`File exceeds max size of ${maxSize} bytes`)
  }
  
  // Check file type
  const allowedTypes = import.meta.env.VITE_ALLOWED_FILE_TYPES.split(',')
  const fileExt = file.name.split('.').pop()
  if (!allowedTypes.includes(fileExt)) {
    throw new Error(`File type not allowed: ${fileExt}`)
  }
  
  // Upload
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(`${apiUrl}/api/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
}
```

---

## 5. INTEGRATION TESTING

### Test API Endpoints

Create `src/utils/testEndpoints.ts`:

```typescript
import { api } from '@/lib/api'

export const testEndpoints = {
  // Auth endpoints
  async testLogin(email: string, password: string) {
    return api.post('/api/auth/login', { email, password })
  },
  
  async testRegister(data: any) {
    return api.post('/api/auth/register', data)
  },
  
  async testLogout() {
    return api.post('/api/auth/logout')
  },
  
  // Vendor endpoints
  async testVendorList() {
    return api.get('/api/vendors')
  },
  
  async testVendorCreate(data: any) {
    return api.post('/api/vendors', data)
  },
  
  // Admin endpoints
  async testAdminDashboard() {
    return api.get('/api/admin/dashboard')
  },
}
```

Usage in component:

```typescript
import { testEndpoints } from '@/utils/testEndpoints'

// Test login
try {
  const response = await testEndpoints.testLogin('test@example.com', 'password')
  console.log('✅ Login test passed:', response.data)
} catch (error) {
  console.error('❌ Login test failed:', error)
}
```

### Test Authentication Flow

```typescript
// Test full auth flow
async function testAuthFlow() {
  try {
    // 1. Test login
    console.log('Testing login...')
    const loginResult = await testEndpoints.testLogin(email, password)
    const token = loginResult.data.access_token
    
    // 2. Test with token
    console.log('Testing authenticated request...')
    const dashboardResult = await api.get('/api/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('✅ Auth flow test passed')
    return true
  } catch (error) {
    console.error('❌ Auth flow test failed:', error)
    return false
  }
}
```

---

## 6. PERFORMANCE TESTING

### Test API Response Times

```typescript
export const testApiPerformance = async (): Promise<void> => {
  const endpoints = [
    '/api/health',
    '/api/vendors',
    '/api/dashboard'
  ]
  
  const apiUrl = import.meta.env.VITE_API_URL
  const results: Record<string, number> = {}
  
  for (const endpoint of endpoints) {
    const start = performance.now()
    try {
      const response = await fetch(`${apiUrl}${endpoint}`)
      const duration = performance.now() - start
      results[endpoint] = duration
      console.log(`${endpoint}: ${duration.toFixed(2)}ms`)
    } catch (error) {
      console.error(`${endpoint}: Failed`)
    }
  }
  
  return results
}
```

### Test Bundle Size

```bash
# Analyze bundle
npm run build -- --analyze

# Check production build size
ls -lh dist/
```

---

## 7. BROWSER TESTING COMMANDS

### Test in Browser Console

```javascript
// 1. Check environment
console.log({
  apiUrl: import.meta.env.VITE_API_URL,
  environment: import.meta.env.VITE_ENVIRONMENT,
  debug: import.meta.env.VITE_DEBUG_MODE
})

// 2. Test API fetch
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ API OK:', d))
  .catch(e => console.log('❌ API Error:', e))

// 3. Test Supabase
console.log({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
})

// 4. Run connection tests
import { runAllTests, logTestResults } from '@/utils/testConnections'
const results = await runAllTests()
logTestResults(results)

// 5. Export test results
import { exportTestResultsAsJSON } from '@/utils/testConnections'
const json = exportTestResultsAsJSON(results)
console.log(json)
```

---

## 8. TESTING CHECKLIST

### Before Local Testing
- [ ] Backend is running on correct port
- [ ] `.env.local` has correct `VITE_API_URL`
- [ ] No port conflicts (8000, 8080)
- [ ] Database is connected in backend
- [ ] CORS is enabled in backend

### Before Production Testing
- [ ] `.env.production` is configured correctly
- [ ] `VITE_API_URL` points to production server
- [ ] Supabase credentials are production keys
- [ ] Build completes without errors
- [ ] `dist/` folder is generated
- [ ] All tests pass in preview

### After Deployment
- [ ] Verify deployed site loads
- [ ] Run tests from production URL
- [ ] Check browser console for errors
- [ ] Test main features (login, create, etc.)
- [ ] Check network requests in DevTools
- [ ] Verify analytics are working
- [ ] Test on mobile devices

---

## 9. DEBUGGING FAILED TESTS

### API Connection Failed

```bash
# 1. Check backend is running
curl http://localhost:8000/api/health

# 2. Check network in DevTools (F12 > Network tab)
# 3. Look for CORS errors
# 4. Check backend logs
# 5. Verify VITE_API_URL in browser console
console.log(import.meta.env.VITE_API_URL)
```

### Environment Variables Not Loading

```bash
# 1. Stop dev server
# 2. Clear cache
rm -r dist node_modules/.vite

# 3. Hard refresh browser (Ctrl+Shift+R)
# 4. Check .env file exists and has data
cat .env | grep VITE_API_URL

# 5. Restart dev server
npm run dev
```

### Tests Pass Locally but Fail in Production

```bash
# 1. Check production build
npm run build

# 2. Preview production build
npm run preview

# 3. Run tests in preview
# Access http://localhost:4173/testing

# 4. Compare environment variables
# Local vs Production - check .env and .env.production

# 5. Check production API endpoint is accessible
curl https://13.212.50.145/api/health
```

---

## 10. QUICK REFERENCE

| Scenario | Command | Expected Result |
|----------|---------|-----------------|
| **Test Local Backend** | `npm run dev` then `/testing` | All green ✅ |
| **Test Production API** | `npm run build && npm run preview` | VITE_API_URL=https://13.212.50.145 |
| **Switch APIs** | `VITE_API_URL=... npm run dev` | Tests use new URL |
| **Clear Cache** | `rm -r dist && npm run dev` | Fresh build |
| **Check Env** | `console.log(import.meta.env)` | See all variables |
| **Test Endpoint** | `fetch(apiUrl + '/endpoint')` | Check response |
| **Export Results** | Download button in `/testing` | JSON file saved |

---

## 11. CONTINUOUS TESTING (CI/CD)

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Build (Dev)
        run: bun run build:dev
      
      - name: Build (Prod)
        run: bun run build
        env:
          VITE_API_URL: https://13.212.50.145
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
      
      - name: Lint
        run: bun run lint
```

---

## 12. TROUBLESHOOTING MATRIX

| Problem | Cause | Solution |
|---------|-------|----------|
| API tests fail | Backend not running | Start backend: `node server.js` |
| API tests timeout | Slow connection | Increase `VITE_API_TIMEOUT` |
| CORS error | Backend CORS disabled | Enable CORS in backend |
| 404 errors | Wrong API URL | Check `VITE_API_URL` in browser |
| Env vars undefined | Cache issue | Hard refresh: Ctrl+Shift+R |
| Build fails | Missing dependencies | Run `npm install` |
| Supabase error | Invalid key | Verify `.env` has valid key |
| Login fails | Auth issue | Check backend auth logic |

---

## Support & Resources

- 📖 [ENVIRONMENT_TESTING_GUIDE.md](./ENVIRONMENT_TESTING_GUIDE.md) - Detailed environment guide
- 📖 [QUICK_COMMANDS.md](./QUICK_COMMANDS.md) - Command reference
- 📖 [ENV_SETUP.md](./ENV_SETUP.md) - Environment setup
- 🔗 [Vite Docs](https://vitejs.dev/)
- 🔗 [Supabase Docs](https://supabase.com/docs)
