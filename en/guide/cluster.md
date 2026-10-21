---
title: Cluster / multi-node
---

# Cluster / multi-node

Register remote 3m-ui panels, health-check them, and merge their nodes into a user's subscription.

## Concepts

- **Remote panel**: base URL + API credential for another 3m-ui instance.
- **Node mirror**: a remote listener reflected into local subscription output.
- **Push**: optionally push selected local listeners to a remote (disabled by default; rename/port as needed).

## Full workflow

1. **Register the remote**: Cluster page → Add node, fill in the panel URL. Then press **Login** and sign in with the remote admin account to obtain a JWT (sync and push both depend on it; re-Login whenever an operation answers 401).
2. **Sync mirrors**: press **Sync**. Remote listeners are cached locally as mirrors, together with their share links and client YAML.
3. **Bind to a user**: Users page → pick a user → **Bind nodes**. The lower half of the modal, **Remote cluster nodes**, is a multi-select of mirrors — choose the ones to distribute and save.
4. **User subscription**: that user's subscription link now carries both local listeners and mirrored remote nodes.

## Subscription merge

Bound users receive local listeners plus mirrored remote nodes in every export format:

| Format | How to get it |
| --- | --- |
| Clash / Mihomo | default subscription output, or `?target=clash` |
| v2ray / BASE64 | `?target=v2ray` (auto-detected by v2rayN / v2rayNG) |
| sing-box | `?target=singbox` |
| Loon / Surge / Quantumult X | `?target=loon` / `surge` / `quanx` |

Mirrored node names carry an `R<remote-id>-` prefix so they never collide with local nodes. A user bound to mirrors only — with no local listener — still gets every format.

## Disable vs delete

- **Disable a remote**: its mirrors are retracted from every subscription immediately; user bindings are kept, and nodes come back automatically once the remote is re-enabled — no re-binding needed.
- **Delete a remote**: mirrors and all user bindings pointing at them are removed; subscriptions no longer contain any node from that remote.

## Safety

- Prefer HTTPS and restricted API tokens on remotes.
- Health checks skip dead remotes so one outage does not empty the whole subscription.
- Mirrors marked "remote off" in the binding modal do not feed subscriptions until the parent remote is enabled again.

Button and field names follow the current panel's Cluster page.
