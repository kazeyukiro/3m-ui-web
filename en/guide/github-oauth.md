---
title: GitHub OAuth
---

# GitHub OAuth

3m-ui supports optional **GitHub OAuth** login for the admin panel. Password login and TOTP remain available.

## Setup

1. On GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set the **Authorization callback URL** to:

   `https://<panel-public-domain>/api/v1/auth/oauth/github/callback`

   The real value is the panel's `public_url` plus that fixed path (falling back to the request host when `public_url` is unset), and must match the GitHub App registration exactly.

3. In the panel **Settings → Security & backup → GitHub OAuth**:
   - Enter **Client ID** / **Client Secret**
   - **Allowed GitHub usernames** (`allowed_logins`, comma-separated, case-insensitive): used to bind a local admin on first login
   - Enable and save

4. A "Sign in with GitHub" option appears on the login page.

## Binding rules

- An already-linked `github_id` logs straight into that user; the allowlist does not apply
- For an unlinked account, the GitHub login must be in `allowed_logins`, otherwise the login is rejected
- Allowed and a local user with the same username exists (case-insensitive): link and log in
- No such user and the system has exactly one `admin`: link to that administrator
- Everything else is rejected; create an admin matching the GitHub login, or link the account manually first

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/auth/oauth/github` | Public: whether OAuth is enabled |
| GET | `/api/v1/auth/oauth/github/start` | Redirect to GitHub authorization |
| GET | `/api/v1/auth/oauth/github/callback` | Callback; success redirects to `/login?oauth_token=...`, failure to `/login?oauth_error=...` |
| GET/PUT | `/api/v1/auth/oauth/github/settings` | Admin read/write of the configuration |

## Notes

- Disable OAuth anytime to fall back to password (+ optional TOTP)
- Keep the panel URL stable: changing host, `public_url` or `web_path` breaks the callback until the GitHub App settings are updated
- The panel server must be able to reach `github.com` and `api.github.com`
