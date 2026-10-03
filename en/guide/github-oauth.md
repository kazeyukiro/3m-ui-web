---
title: GitHub OAuth
---

# GitHub OAuth

Optional login via GitHub OAuth for the admin UI.

## Setup

1. Create an OAuth App under GitHub → Settings → Developer settings.
2. Authorization callback URL must match the panel public URL and path prefix (`web_path` if set).
3. Put **Client ID** and **Client Secret** in panel system settings (or config).

## Notes

- First-time bind may be restricted to existing local admin depending on version.
- Disable OAuth anytime to fall back to password (+ optional TOTP).
- Keep the panel URL stable; changing host/`web_path` breaks the callback until GitHub app settings are updated.
