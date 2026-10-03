---
title: Core updates
---

# Core updates

How the panel updates the bundled **Mihomo** core.

## Channels

- **Stable** (default): pinned core versions shipped with panel releases / distribution metadata.
- **Pre-release**: must be selected explicitly; see [Pre-release channel](./dev-channel).

## Update

1. Ensure outbound HTTPS to GitHub (or your mirror).
2. Use the **Core** page in the UI or the package CLI (`3m-ui update` / core-specific commands for your install type).
3. **Validate** generated config after the binary changes; **Apply** only when validation succeeds.

## Safety

- Prefer stable unless you are testing.
- Keep a backup of the data directory before major upgrades.
- If the core fails to start, roll back to the previous binary from the package or reinstall the last good release bundle.

## Related

- [Install & upgrade](./install)
- [Core overview](./core)
