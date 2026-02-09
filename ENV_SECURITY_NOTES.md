# Frontend Environment Configuration - Security Notes

## âš ï¸ IMPORTANT: Backend vs Frontend Variables

The backend configuration provided contains **sensitive credentials that should NOT be added to the frontend** repository. This document explains the separation:

### Backend-Only Variables (DO NOT ADD TO FRONTEND)
These variables are server-side only and contain sensitive secrets:

```
âŒ SUPABASE_JWT_SECRET=<redacted>
âŒ MONGO_URI=<redacted>
âŒ SENDGRID_API_KEY=<redacted>
âŒ TEXT_LK_API_KEY=<redacted>
âŒ SECRET_KEY=<redacted>
âŒ ALGORITHM=<redacted>
âŒ ACCESS_TOKEN_EXPIRE_MINUTES=<redacted>
âŒ REFRESH_TOKEN_EXPIRE_DAYS=<redacted>
```

**Reason:** These are private keys and database credentials. Exposing them in frontend code would compromise security.

### Frontend-Safe Variables (Added to .env files)
These variables are safe for frontend use:

```
âœ… VITE_SUPABASE_URL=https://azrdrjbrwdahwnkuufvw.supabase.co
âœ… VITE_SUPABASE_ANON_KEY=<public-anon-key-only>
âœ… VITE_SMS_SENDER_ID=TextLKDemo
âœ… VITE_CORS_ORIGINS=https://lankapass.com,https://www.lankapass.com
```

**Reason:** These are public values that don't expose secrets. Always use **ANON_KEY** (not SERVICE_ROLE_KEY) in frontend.

### Backend Configuration Location
Backend variables should be stored in:
- **Backend Repository `.env` file** (git-ignored)
- **CI/CD Secrets Management** (GitHub Secrets, AWS Secrets Manager, etc.)
- **Environment Variables on Server** (Docker, Kubernetes, etc.)

## ðŸ“‹ What Was Added to Frontend .env Files

### Added:
âœ… `VITE_SUPABASE_URL` - Supabase project URL  
âœ… `VITE_SUPABASE_ANON_KEY` - Public anonymous key (placeholder)  
âœ… `VITE_SMS_SENDER_ID` - Text.lk sender ID  
âœ… `VITE_CORS_ORIGINS` - Allowed cross-origin domains  

### NOT Added (Intentionally):
âŒ Any backend API keys  
âŒ Database connection strings  
âŒ JWT secrets  
âŒ Service account credentials  
âŒ Email service API keys  

## ðŸ” Security Best Practices

1. **Frontend Environment Variables**
   - Only include public/non-sensitive values
   - Always prefix with `VITE_` for Vite to expose them to client
   - These get embedded in the build and are visible to users

2. **Backend Environment Variables**
   - Store in backend repository
   - Use secrets management for sensitive data
   - Implement proper access controls

3. **Supabase Configuration**
   - **Frontend:** Use `SUPABASE_ANON_KEY` (restricted permissions)
   - **Backend:** Use `SUPABASE_SERVICE_ROLE_KEY` (full permissions)
   - Never expose service role key in frontend

4. **API Integration**
   - Frontend calls your backend API (`https://13.212.50.145`)
   - Backend handles Supabase, database, SMS, email operations
   - Sensitive operations never execute on client

## ðŸ“ Notes on Provided Backend Variables

From your backend `.env`:

| Variable | Type | Frontend? | Notes |
|----------|------|-----------|-------|
| `SUPABASE_URL` | Public | âœ… Yes (as VITE_SUPABASE_URL) | Project URL is public |
| `SUPABASE_KEY` | Service | âŒ No | This is SERVICE_ROLE_KEY, do not expose |
| `SUPABASE_JWT_SECRET` | Secret | âŒ No | Must stay backend only |
| `MONGO_URI` | Secret | âŒ No | Database connection with credentials |
| `SENDGRID_API_KEY` | Secret | âŒ No | Email service secret |
| `TEXT_LK_API_KEY` | Secret | âŒ No | SMS gateway secret |
| `CORS_ORIGINS` | Public | âœ… Yes (as VITE_CORS_ORIGINS) | Non-sensitive |
| `TEXT_LK_SENDER_ID` | Public | âœ… Yes (as VITE_SMS_SENDER_ID) | Just an identifier |

## ðŸš€ Next Steps

1. **Update Backend Repository**
   - Add the backend variables to your backend `.env` file
   - Ensure `.env` is in `.gitignore`
   - Use secrets management for production deployment

2. **Frontend Supabase Setup**
   - Get the public ANON_KEY from your Supabase project
   - Update `VITE_SUPABASE_ANON_KEY` in each environment file
   - Test Supabase connection from frontend

3. **Production Deployment**
   - Set environment variables in CI/CD platform
   - Ensure backend API URL is set correctly
   - Verify CORS origins are configured

## ðŸ“š References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Client Libraries](https://supabase.com/docs/guides/api)
- [Supabase Auth (Anon vs Service Role)](https://supabase.com/docs/guides/auth)
- [Security Best Practices](https://owasp.org/www-community/attacks/Sensitive_Data_Exposure)

