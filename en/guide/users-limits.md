---
title: User limits — IP & subscription pull
---

# User limits — IP & subscription pull

Per-user controls in the panel:

## Device / IP limit

- Caps concurrent online IPs observed from the core connection stats.
- When exceeded, new connections may be rejected until a slot frees or the counter resets (implementation follows core + panel tracking window).

## Subscription pull limit

- Rate-limits how often a subscription token may be fetched.
- Protects against token abuse and aggressive client refresh loops.

## Related

- Traffic quota and expiry are separate (see Users & traffic / per-node traffic).
- First-use start and periodic reset are configured on the user form.
