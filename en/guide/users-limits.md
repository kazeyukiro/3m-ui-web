---
title: User limits — IP & subscription pull
---

# User limits — IP & subscription pull

Per-user controls stored on each proxy user (Users page / API):

## IP limit (`ip_limit`)

Caps the number of **concurrent online source IPs** observed from the core connection stats. The panel polls Mihomo connections about every 5 seconds and closes excess IP connections; this does not block at handshake.

- `0` or empty: unlimited  
- Positive integer: at most that many distinct source IPs

## Subscription pull limit (`sub_pull_limit`)

Rate-limits how often that user's subscription token may be fetched, reducing pressure from token leaks, aggressive refresh loops, or misbehaving clients. Successful downloads are counted in a rolling 24-hour window; exceeding the limit returns `429`.

Both the HTML subscription page and client subscription downloads are counted.

## Related capabilities

- Traffic quota, expiry, first-use start, periodic reset: see [Users & traffic](./users-traffic)  
- Per-node multiplier billing: see [Per-node traffic & multiplier](./node-traffic)

## Quick create

Users page **Quick create** (or `POST /api/v1/users/quick`):

- Username may be empty (auto-generated)  
- Password and UUID are generated and shown **once** in the response / dialog  
- Optional **bind all local nodes**

## Related APIs

- User CRUD: `ip_limit`, `sub_pull_limit` on create/update  
- Subscription: public `/api/v1/client/sub/{token}` (and aliases)
