---
title: Cluster / multi-node
---

# Cluster / multi-node

Register remote 3m-ui panels, health-check them, and merge their nodes into a user's subscription.

## Concepts

- **Remote panel**: base URL + API credential for another 3m-ui instance.
- **Node mirror**: a remote listener reflected into local subscription output.
- **Push**: optionally push selected local listeners to a remote (disabled by default; rename/port as needed).

## Subscription merge

Bound users can receive local listeners plus mirrored remote proxies in one Clash/v2ray document.

## Safety

- Prefer HTTPS and restricted API tokens on remotes.
- Health checks skip dead remotes so one outage does not empty the whole subscription.
