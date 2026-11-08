---
title: Per-node traffic & multiplier
---

# Per-node traffic & multiplier

## Traffic multiplier

Each listener can set a **traffic multiplier** (`traffic_multiplier`). Billing toward a user's quota is:

```text
billed = actual_bytes × node_multiplier
```

Example: multiplier `1.5` means 1 GiB transferred counts as 1.5 GiB against `traffic_limit`. The billed value is rounded to the nearest integer.

## Behaviour

- The multiplier defaults to `1`; `<= 0` is treated as `1`, and values above `100` are clamped to `100`
- Per-node stats in the panel show raw and billed usage where available
- Changing the multiplier affects **future** accounting only; historical rows keep both raw and billed bytes and are not recalculated when the multiplier changes
- Changing the multiplier does not rewrite quota a user has already consumed

## Per-node stats

Node and user traffic stats depend on Mihomo connection data. A core reload or incomplete protocol fields can leave the stats briefly empty; check the Listener configuration and user bindings, then watch the dashboard / user page again.

## Tips

- Use higher multipliers on expensive transit nodes; `1` on local/free capacity
- Combine with user traffic limits and expiry for package-style plans
