# Simple Frontend for Gateway Auth Test

This is a **very** minimal static frontend used to test the Google OAuth flow exposed by the gateway service.

## Prerequisites

1. `node` ≥ 18 installed (for the static server)
2. The gateway API must be running on `http://localhost:4000` and correctly configured with Google OAuth credentials.

## Usage

```bash
cd frontend
npm run dev      # serves the static files on http://localhost:5173
```

Workflow:

1. Open your browser at <http://localhost:5173> and click **Login with Google**.
2. Complete the Google consent screen and, upon success, the gateway will redirect you to `/dashboard`.
3. The dashboard page automatically calls the protected endpoint `/api/v1/hello` and displays the greeting.

> ⚠️  In production you would implement proper logout and CSRF protection. This demo is intentionally minimal. 