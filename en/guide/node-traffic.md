---
title: Per-node traffic & multiplier
---

# Per-node traffic & multiplier

Each listener can set a **traffic multiplier**. Billing toward a user's quota is:

```text
billed = actual_bytes × node_multiplier
```

Example: multiplier `1.5` means 1 GiB transferred counts as 1.5 GiB against `traffic_limit`.

## Behaviour

- Multiplier defaults to `1`.
- Per-node stats in the panel show raw and billed usage where available.
- Changing the multiplier affects **future** accounting; historical rows follow the rules of your panel version.

## Tips

- Use higher multipliers on expensive transit nodes; `1` on local/free capacity.
- Combine with user traffic limits and expiry for package-style plans.
