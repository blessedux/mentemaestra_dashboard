# Production Auth Checklist (Privy)

If login or organization selection fails in production, use this checklist.

## 1. Environment variable

In your hosting (e.g. Vercel → Project → Settings → Environment Variables), set:

- **`NEXT_PUBLIC_PRIVY_APP_ID`** – Your Privy App ID (from [Privy Dashboard](https://dashboard.privy.io)).

Without this, the app will show “Authentication not configured” in production.

## 2. Privy Dashboard – Allowed domains

1. Go to [Privy Dashboard](https://dashboard.privy.io) → **Configuration** → **App settings** → **Domains**.
2. Add your **production domain** (e.g. `your-app.vercel.app` or `app.mentemaestra.com`).
3. Use the exact domain users see in the browser (no `https://`, no trailing slash).

If the domain is not allowed, email/Google login can fail or redirect incorrectly.

## 3. Privy Dashboard – OAuth redirect URLs (Google login)

If you use **Google** login:

1. Go to **Configuration** → **App settings** → **Advanced**.
2. Under **Allowed OAuth redirect URLs**, add your production URLs, for example:
   - `https://your-app.vercel.app`
   - `https://app.mentemaestra.com`
3. Requirements: **https**, exact match, no wildcards, and the domain must be in **Allowed domains**.

## 4. App flow after login

- After login, users are sent to **/projects** to choose an organization (website).
- If they already have a selected project (in this browser), they go to **/dashboard**.
- If you see “No Projects Available” on /projects, the user’s email has no websites assigned. Add an assignment in **/admin/assignments** (admin only).

## 5. Quick checks

- **Can’t select email / login does nothing**  
  → Check `NEXT_PUBLIC_PRIVY_APP_ID` and that the production domain is in Privy **Domains** and (for Google) **Allowed OAuth redirect URLs**.

- **Login works but no organizations**  
  → User has no websites assigned. Use **/admin/assignments** to assign their email to a website.

- **Redirects to dashboard with no project**  
  → Fixed in app: after login we redirect to **/projects** when no project is selected, so the user can pick an organization first.
