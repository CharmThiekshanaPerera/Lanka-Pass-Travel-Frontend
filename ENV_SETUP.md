# Environment Configuration Setup Guide

## Overview

This project uses multiple environment files to manage configuration across different environments (development, local, and production). All environment files use the Vite convention with `VITE_` prefix for client-side variables.

## Environment Files Structure

### 1. **`.env`** - Development Environment (Committed)
Default configuration for development. This file is committed to the repository and contains non-sensitive defaults.

**Key settings:**
- API URL: `http://localhost:8000`
- Environment: `development`
- Debug mode: `true`
- Analytics: `false`
- HTTPS cookies: `false`

### 2. **`.env.local`** - Local Development (Git-Ignored)
Local overrides with sensitive data for your personal development environment. This file is git-ignored.

**Key settings:**
- Override API URL if needed
- Supabase credentials for local testing
- Local database credentials (if applicable)
- Test API keys

**Usage:** Copy from `.env.example` and customize for your local machine.

### 3. **`.env.production`** - Production Environment (Git-Ignored)
Deployment configuration optimized for production. This file is git-ignored and used in CI/CD pipelines.

**Key settings:**
- API URL: `https://13.212.50.145` (production API)
- Environment: `production`
- Debug mode: `false`
- Analytics: `true`
- HTTPS cookies: `true`
- Production API keys and credentials

**Usage:** Deploy via CI/CD environment variables or secure secret management.

### 4. **`.env.example`** - Template (Committed)
Template file that documents all available configuration options. Share this with your team.

## Environment Variables Reference

### API Configuration
| Variable | Purpose | Dev | Local | Prod |
|----------|---------|-----|-------|------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` | `http://localhost:8000` | `https://13.212.50.145` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `30000` | `30000` | `30000` |

### Supabase Configuration
| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anonymous key |

### Application Configuration
| Variable | Purpose |
|----------|---------|
| `VITE_APP_NAME` | Application name |
| `VITE_APP_VERSION` | Application version |
| `VITE_ENVIRONMENT` | Current environment (development, local, production) |
| `VITE_DEBUG_MODE` | Enable debug logging (false in production) |

### Authentication
| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_SESSION_TIMEOUT` | Session timeout in milliseconds | `1800000` (30 mins) |
| `VITE_PASSWORD_RESET_EXPIRY` | Password reset token expiry (minutes) | `15` |
| `VITE_SESSION_WARNING_TIME` | Warn before session timeout (ms) | `300000` (5 mins) |

### Feature Flags
| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_ENABLE_ADMIN_PANEL` | Enable admin dashboard | `true` |
| `VITE_ENABLE_VENDOR_CHAT` | Enable vendor chat feature | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` (dev), `true` (prod) |

### Security Configuration
| Variable | Purpose | Dev | Prod |
|----------|---------|-----|------|
| `VITE_SECURE_COOKIES` | Use secure cookies | `false` | `true` |
| `VITE_MAX_FILE_UPLOAD_SIZE` | Max upload size (MB) | `50` | `10` |
| `VITE_ALLOWED_FILE_TYPES` | Allowed upload file types | `jpg,jpeg,png,pdf,doc,docx,xlsx` | same |

### Third-Party Services (Optional)
| Variable | Purpose |
|----------|---------|
| `VITE_ANALYTICS_ID` | Google Analytics tracking ID |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN |
| `VITE_PAYMENT_API_KEY` | Payment gateway API key (test/live) |
| `VITE_EMAIL_SERVICE_KEY` | Email service API key |

### Storage & Pagination
| Variable | Purpose |
|----------|---------|
| `VITE_STORAGE_PREFIX` | LocalStorage key prefix |
| `VITE_ITEMS_PER_PAGE` | Default items per page (tables) |
| `VITE_MAX_ITEMS_PER_PAGE` | Maximum items per page |

## Setup Instructions

### For New Developers

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lanka-Pass-Travel-Frontend
   ```

2. **Create your local environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Update `.env.local` with your credentials**
   - Get Supabase credentials from the team lead
   - Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Keep API URL as `http://localhost:8000` (unless running backend locally)

4. **Install dependencies and start development**
   ```bash
   bun install
   bun run dev
   ```

### For Production Deployment

1. **Set environment variables in your deployment platform** (GitHub Actions, Vercel, AWS, etc.)
   - Use `.env.production` as a reference
   - Provide actual production values via secure secret management

2. **Critical variables for production:**
   ```
   VITE_API_URL=https://13.212.50.145
   VITE_SUPABASE_URL=https://your-production-project.supabase.co
   VITE_SUPABASE_ANON_KEY=<production-key>
   VITE_ENVIRONMENT=production
   VITE_DEBUG_MODE=false
   VITE_SECURE_COOKIES=true
   VITE_ENABLE_ANALYTICS=true
   ```

## Important Notes

### Security
- ✅ `.env` and `.env.example` are committed to the repository
- ❌ `.env.local` and `.env.production` are git-ignored (never commit secrets)
- ❌ Never hardcode API keys or credentials in source code
- ✅ Use environment variables for all sensitive data

### Vite Integration
- All environment variables must start with `VITE_` to be accessible in the client-side code
- Access variables via `import.meta.env.VITE_*`
- Build-time: Variables are replaced during the build process
- Runtime: Cannot change environment variables after build

### Development vs Production
- Use `.env.local` for local development overrides
- Use `.env.production` for production-specific configurations
- Production builds should never have `VITE_DEBUG_MODE=true` or `VITE_SECURE_COOKIES=false`

## Troubleshooting

### Variables not loading
1. Ensure variable name starts with `VITE_`
2. Restart Vite dev server after changing `.env.local`
3. Use `import.meta.env.VITE_API_URL` (not `process.env`)

### Mixed environments
1. Clear `.env.local` and restart
2. Check which environment file is being loaded (depends on NODE_ENV or --mode flag)

### Production variables not available
- Ensure environment variables are set in your CI/CD platform
- Variables must be set before the build step
- Use `vite build --mode production` for production builds

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [.env.example](./env.example) - Template with all available options
- Backend API documentation: Check your backend repository
- Supabase documentation: https://supabase.com/docs
