---
title: Listener runtime status
---

# Listener runtime status

This page describes how 3m-ui decides a listener is **running** versus merely **enabled**.

## States

| State | Meaning |
|-------|---------|
| Enabled | Stored in DB and intended to be compiled into config |
| Applied | Present in the last successfully applied Mihomo config |
| Live | Core reports the inbound as active (when API is available) |

## Update path

1. Save listener in the panel  
2. **Generate → Validate → Apply**  
3. Core reloads; runtime badges refresh on the next poll  

## Traffic & connections

Active connection counts (TCP/UDP) come from the core statistics API and feed the dashboard charts.

## Common failures

- Port conflict or permission denied on bind  
- TLS/certificate path missing at apply time  
- Core crashed or not started after apply  

Check panel logs and Mihomo logs under the data directory configured for your install.
