# QA Test Plan - Lanka-Pass-Travel-Frontend

**Project**: Lanka-Pass-Travel-Frontend
**Generated**: 2026-02-09

**How To Use**
Copy each row into Jira as a task. The `Jira Key` column is a suggested ID and can be replaced with your project key.

**Functional Testing**
| Jira Key | Flow/Component | Scope/Files | Scenarios | Tools/Methods | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| QA-FUNC-001 | Vendor Onboarding E2E | `src/pages/Onboarding.tsx`, `src/components/onboarding/*`, `src/services/vendorService.ts` | Step validation per step, OTP send/verify/resend, file uploads, submission, success redirect, PDF download | Playwright or Cypress, MSW for API mocks | Onboarding completes only when valid, OTP enforces 6 digits and cooldown, uploads succeed or show errors, success page and download work |
| QA-FUNC-002 | Vendor Login and Role Enforcement | `src/pages/VendorLogin.tsx`, `src/contexts/AuthContext.tsx` | Vendor login success, admin/manager blocked, redirect to vendor dashboard, error toasts | Playwright or Cypress | Only vendor role signs in, non-vendor is blocked with correct messaging |
| QA-FUNC-003 | Admin Login and Role Enforcement | `src/pages/AdminLogin.tsx`, `src/services/supabaseService.ts` | Admin/manager login, vendor blocked, redirect to admin dashboard | Playwright or Cypress | Only admin/manager access admin, others are logged out and warned |
| QA-FUNC-004 | Session Timeout Handling | `src/lib/api.ts`, `src/components/auth/SessionTimeoutModal.tsx` | 401/403 triggers modal, logout, redirect to onboarding | Playwright or Cypress with API stubs | Modal appears once per expiry, user is logged out, redirect is correct |
| QA-FUNC-005 | Force Password Reset Flow | `src/components/auth/ForcePasswordResetModal.tsx`, `src/services/authService.ts` | User with `requires_password_reset` forced to change password | Component tests, Playwright | Access blocked until reset completes, reset clears flag |
| QA-FUNC-006 | Vendor Dashboard Data Load | `src/pages/VendorDashboard.tsx`, `src/services/vendorService.ts` | Profile/stats/services fetch, loading state, error fallback | Playwright or Cypress | Data loads correctly, failures show fallback state |
| QA-FUNC-007 | Vendor Services CRUD | `src/components/dashboard/ServicesList.tsx` | Create, edit, delete, status change, image upload, validation | Playwright or Cypress | CRUD works, validation blocks invalid inputs, status persists |
| QA-FUNC-008 | Vendor Profile Update and Requests | `src/components/dashboard/ProfileForm.tsx`, `src/services/chatService.ts` | Update profile, document uploads, approval request flow | Playwright or Cypress | Update requests created when required, pending indicators display |
| QA-FUNC-009 | Media Gallery Upload and Delete | `src/components/dashboard/MediaGallery.tsx` | Upload cover/logo/gallery/video, delete gallery image, preview | Playwright or Cypress | Uploads persist and gallery updates without reload, delete works |
| QA-FUNC-010 | Admin Vendor Approval and Status Actions | `src/pages/AdminDashboard.tsx`, `src/services/vendorService.ts` | Approve, reject with reason, terminate, freeze/activate, public toggle | Playwright or Cypress | Status changes persist and UI reflects updates |
| QA-FUNC-011 | Admin Service Commission and Status | `src/pages/AdminDashboard.tsx` | Commission update, service status update, vendor notification | Playwright or Cypress | Commission calculation updates, status persists, notification sent |
| QA-FUNC-012 | Admin Manager Management | `src/pages/AdminDashboard.tsx`, `src/services/vendorService.ts` | Create/delete manager, reset password | Playwright or Cypress | Manager list updates, reset prompt works |
| QA-FUNC-013 | Export Vendors | `src/services/vendorService.ts` | Export vendors CSV | Playwright or Cypress | Export triggers download with correct filename |
| QA-FUNC-014 | Featured Vendors on Landing | `src/components/landing/FeaturedVendors.tsx` | Loading, empty state, vendor render, onboarding link | Playwright or Cypress | Section hidden when empty, displays correctly when populated |

**Compatibility Testing**
| Jira Key | Flow/Component | Scope/Files | Scenarios | Tools/Methods | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| QA-COMP-001 | Responsive Layout Coverage | Landing, onboarding, vendor dashboard, admin dashboard | Mobile, tablet, desktop breakpoints | BrowserStack or Sauce Labs | No clipped content or broken navigation |
| QA-COMP-002 | OTP and Phone Input on Mobile | `src/components/onboarding/Step1VendorBasics.tsx` | OTP entry, resend, phone input on iOS Safari and Android Chrome | Real device, BrowserStack | OTP and validation work across devices |
| QA-COMP-003 | File Upload Across Browsers | Media uploads and service images | Upload images/videos on Chrome, Edge, Firefox, Safari | BrowserStack, real device | Upload and preview behavior consistent |
| QA-COMP-004 | SPA Deep-Linking | `.htaccess`, `src/App.tsx` | Direct load of `/onboarding`, `/vendor-dashboard`, `/admin` | Manual on staging | Routes load correctly without server 404 |

**Performance Testing**
| Jira Key | Flow/Component | Scope/Files | Scenarios | Tools/Methods | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| QA-PERF-001 | Landing Page Web Vitals | Landing page | LCP, CLS, TTI on mobile/desktop | Lighthouse, WebPageTest | LCP < 2.5s, CLS < 0.1, TTI < 3.5s |
| QA-PERF-002 | Dashboard Data Load | Vendor and admin dashboards | Initial data fetch and render time | Lighthouse, browser profiling | Render within 2s after API response |
| QA-PERF-003 | Service List Rendering Under Load | `src/components/dashboard/ServicesList.tsx` | 200+ services, scroll/edit | React Profiler | No major UI lag or freeze |
| QA-PERF-004 | API Load Test | Vendor/admin endpoints | 100 concurrent users | k6 or Artillery | Median latency < 1s, error rate < 1% |

**Security Testing**
| Jira Key | Flow/Component | Scope/Files | Scenarios | Tools/Methods | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| QA-SEC-001 | Role-Based Access Control | Protected routes and admin endpoints | Vendor attempts admin routes and APIs | Playwright, manual API testing | Unauthorized roles blocked |
| QA-SEC-002 | Session Token Handling | `src/lib/api.ts`, `src/services/supabaseService.ts` | Token expiry, refresh flow, replayed tokens | Burp Suite | Expired tokens denied, refresh works as designed |
| QA-SEC-003 | File Upload Validation | Upload endpoints | Non-image payloads, oversized files | OWASP ZAP, manual | Server rejects disallowed types/sizes |
| QA-SEC-004 | Chat Message Injection | `src/services/chatService.ts` | XSS payloads in chat messages | OWASP ZAP, manual | Messages render as text, no script execution |
| QA-SEC-005 | Dependency Vulnerability Scan | Dependencies | Run security audit | `npm audit`, Snyk | No critical/high issues untracked |

**Usability Testing**
| Jira Key | Flow/Component | Scope/Files | Scenarios | Tools/Methods | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| QA-UX-001 | Onboarding Completion Usability | Onboarding flow | First-time vendor completes flow without guidance | Moderated user test | 80%+ completion without support |
| QA-UX-002 | Error Messaging and Recovery | Onboarding, login, service creation | Invalid inputs and recovery | Heuristic review | Errors are clear and actionable |
| QA-UX-003 | Admin Approval Efficiency | Admin dashboard | Approve or reject vendor under 2 minutes | Task-based session | Workflow is efficient and clear |
| QA-UX-004 | Accessibility Baseline | Core pages | Keyboard navigation, screen reader checks | axe, manual | No critical accessibility violations |
