---
title: Security
description: 3m-ui · Security
---

# Security

- Change the admin password on first login.
- Use unique JWT / credential secrets in config.
- Restrict panel port exposure; use HTTPS in production.
- The panel ships with a **random path (web_path)** hiding the entry point — the bare domain returns 404 (see [Panel config](./panel-config)).
- Keep SSH and `reset-admin` / `reset-config` as rescue options.


## GitHub OAuth

Optional panel login via GitHub. Configure under **Settings → Security & backup → GitHub OAuth**.

1. Create a GitHub OAuth App; callback URL: `https://<public_url>/api/v1/auth/oauth/github/callback`
2. Set Client ID / Secret and allowed GitHub usernames (for first-time bind).
3. Enable; the login page shows **Continue with GitHub**.

Password login remains available. Full steps: [GitHub OAuth](./github-oauth).
