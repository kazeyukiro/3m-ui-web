---
title: Core updates
---

# Core updates

An admin can pick an official stable or pre-release Mihomo build under **Core → Check for updates**, or **restore the previous version** from the saved binary. This is independent of updating the panel program itself. Checking **does not** install automatically; you confirm manually.

The updater queries roughly the latest 30 GitHub Releases and skips drafts and assets without a SHA-256 digest; full installs generally support the **amd64** and **arm64** Linux architectures.

## Channels

- **Stable**: the default install/update channel, matching the pinned version in the panel release notes
- **Pre-release**: must be selected explicitly; see [Pre-release channel](./dev-channel)

## Behaviour

- The updater downloads only from official Mihomo Release assets and verifies the digest
- It tries to keep the previous binary available for rollback before installing a new core
- After swapping the core, run **Generate → Validate → Apply** again to confirm it starts
- Outbound HTTPS to GitHub (or your mirror) is required

## Relationship to panel updates

- `3m-ui update` / the one-click installer updates the **panel** (and its bundled core policy)
- The in-panel **Core update** replaces only the **Mihomo** binary

Do not confuse the two. If something breaks, restore the previous core first or reinstall a known-good release bundle.

## Safety

- Prefer stable unless you are testing
- Back up the data directory before major upgrades
- If the core fails to start, roll back to the previous binary or reinstall the last good release

## Related

- [Install & upgrade](./install)
- [Core overview](./core)
