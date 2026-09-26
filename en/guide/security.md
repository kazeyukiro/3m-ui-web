---
title: Security
description: 3m-ui · Security
---

## Security

Change the admin password on first login. Prefer unique JWT/credential secrets in config. Restrict panel port exposure; use HTTPS when possible.


## GitHub OAuth

Optional panel login via GitHub. Configure under **Settings → Security → GitHub OAuth**.

1. Create a GitHub OAuth App; callback URL: `https://<public_url>/api/v1/auth/oauth/github/callback`
2. Set Client ID / Secret and allowed GitHub usernames (for first-time bind)
3. Enable; the login page shows **Continue with GitHub**

Password login remains available. See the main repo `docs/github-oauth.md`.
