# API Documentation — Lanka Pass Travel (Frontend)

This document provides a concise reference for the frontend's external API usage and contains Postman-ready requests and example test data to validate local and production backends.

---

**Base URLs**

- Development (local): http://localhost:8000
- Production: https://13.212.50.145

Set `{{API_URL}}` in Postman to switch quickly between environments.

---

## 1) Quick test endpoints

### 1.1 GET /api/health
- Purpose: Verify backend is reachable and healthy.
- Method: GET
- URL: `{{API_URL}}/api/health`
- Example success response (200):
```
{ "status": "ok", "uptime": 12345 }
```

Postman: Create GET request to `{{API_URL}}/api/health` and send.

cURL:
```bash
curl -s -X GET "{{API_URL}}/api/health" -H "Accept: application/json"
```

---

### 1.2 POST /api/auth/login
- Purpose: Validate authentication endpoint and test login flow.
- Method: POST
- URL: `{{API_URL}}/api/auth/login`
- Headers: `Content-Type: application/json`

Example request body (use these dummy test credentials in Postman):
```json
{
  "email": "testuser@lankapass.test",
  "password": "Test@1234"
}
```

Expected behaviors:
- 200: Login success (returns access token + user object)
- 400/401: Invalid credentials — accepted as a valid test response showing the endpoint is present

Example success response (typical):
```json
{
  "accessToken": "eyJhbGci...",
  "user": { "id": "abc123", "email": "testuser@lankapass.test", "role": "vendor" }
}
```

cURL:
```bash
curl -s -X POST "{{API_URL}}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@lankapass.test","password":"Test@1234"}'
```

Notes:
- If your backend enforces stricter test account policies, replace the body with a valid test user from your database.
- The frontend expects a Bearer token in `Authorization: Bearer <token>` for authenticated calls.

---

## 2) Supabase quick check (client-side)

The frontend uses Supabase for some functionality. You can validate Supabase connectivity from Postman using the REST interface.

- Supabase base: `{{SUPABASE_URL}}` (e.g. `https://azrdrjbrwdahwnkuufvw.supabase.co`)
- Use the ANON key (frontend): `{{SUPABASE_ANON_KEY}}`

Example: list rows from a public table `profiles` (if exists)

Request:
- Method: GET
- URL: `{{SUPABASE_URL}}/rest/v1/profiles?select=*`
- Headers:
  - `apikey: {{SUPABASE_ANON_KEY}}`
  - `Authorization: Bearer {{SUPABASE_ANON_KEY}}`

cURL:
```bash
curl -s -X GET "{{SUPABASE_URL}}/rest/v1/profiles?select=*" \
  -H "apikey: {{SUPABASE_ANON_KEY}}" \
  -H "Authorization: Bearer {{SUPABASE_ANON_KEY}}"
```

If you do not have `profiles` table, use any public table name or skip this test. Do NOT expose service_role keys in Postman environment.

---

## 3) Common frontend API calls (examples)

These are examples of requests the frontend makes — useful for testing flows in Postman.

- Fetch vendor list
  - GET `{{API_URL}}/api/vendors?page=1&limit=10`
- Get vendor by id
  - GET `{{API_URL}}/api/vendors/{vendorId}`
- Create booking (authenticated)
  - POST `{{API_URL}}/api/bookings`
  - Body:
  ```json
  {
    "vendorId": "vendor_123",
    "userId": "user_abc",
    "serviceId": "service_456",
    "startDate": "2026-03-01T09:00:00.000Z",
    "endDate": "2026-03-01T11:00:00.000Z",
    "notes": "Test booking from Postman"
  }
  ```
  - Headers: `Authorization: Bearer {{ACCESS_TOKEN}}`, `Content-Type: application/json`

Note: Replace paths with your backend's actual routes if they differ. These examples are standard REST patterns used by the frontend.

---

## 4) Postman setup (environment + collection variables)

Create a Postman environment (e.g. `LP-Local`, `LP-Prod`) and add the following variables:

- `API_URL` = http://localhost:8000 (or https://13.212.50.145 for production)
- `SUPABASE_URL` = https://azrdrjbrwdahwnkuufvw.supabase.co
- `SUPABASE_ANON_KEY` = your-anon-key-here
- `ACCESS_TOKEN` = (set after successful login)
- `TEST_USER_EMAIL` = testuser@lankapass.test
- `TEST_USER_PASSWORD` = Test@1234

How to use in Postman:
1. Import requests (create new requests manually using the endpoints in this doc).
2. Use `{{API_URL}}` and `{{ACCESS_TOKEN}}` in URLs and Authorization header.
3. Run login request first and copy `accessToken` to the environment variable `ACCESS_TOKEN`.

Tip: Postman test script to auto-save token (paste into Tests tab of the login request):
```javascript
// Save accessToken to environment
if (pm.response.code === 200) {
  const body = pm.response.json();
  if (body.accessToken) {
    pm.environment.set("ACCESS_TOKEN", body.accessToken);
  }
}
```

---

## 5) Example Postman collection snippets (JSON bodies)

A minimal collection of useful bodies for immediate testing.

- Login body:
```json
{
  "email": "{{TEST_USER_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}
```

- Create booking body sample (see section 3 for keys):
```json
{
  "vendorId": "vendor_123",
  "userId": "user_abc",
  "serviceId": "service_456",
  "startDate": "2026-03-01T09:00:00.000Z",
  "endDate": "2026-03-01T11:00:00.000Z",
  "notes": "Test booking via Postman"
}
```

---

## 6) CORS & common headers

- Frontend will call `{{API_URL}}` from the browser; ensure backend includes the proper CORS origins (see `.env.production`: `VITE_CORS_ORIGINS`).
- For authenticated requests, set header:
  - `Authorization: Bearer {{ACCESS_TOKEN}}`
  - `Content-Type: application/json`
  - For Supabase REST: `apikey` and `Authorization` as shown earlier.

---

## 7) Troubleshooting quick hits

- "Network Error / CORS blocked": Ensure backend `Access-Control-Allow-Origin` includes your frontend origin (http://localhost:5173 or preview port).
- "401 Unauthorized after login": Confirm `ACCESS_TOKEN` is saved and the header is `Authorization: Bearer {{ACCESS_TOKEN}}`.
- "404 Not Found": Verify endpoint path and `{{API_URL}}` value.
- Timeouts: Increase `VITE_API_TIMEOUT` in `.env` and the `request` timeout in Postman settings.

---

## 8) Security notes

- Do NOT store `service_role` keys or any server-only secret in Postman environment that may be shared.
- On production teams, store Postman environments in private workspaces only.

---

## 9) Want a Postman collection file?
If you'd like, I can generate a Postman collection JSON with the above requests and a matching environment file (`LP-Local.postman_environment.json`) for immediate import — tell me whether you want `local` or `production` default values and I'll add both.

---

## 10) References
- Frontend envs: `.env`, `.env.production`, `.env.local`
- Supabase project: https://azrdrjbrwdahwnkuufvw.supabase.co
- Production API: https://13.212.50.145


*Generated: Feb 9, 2026 — use this as a living doc; update as backend expands.*
