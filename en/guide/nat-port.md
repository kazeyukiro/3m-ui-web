---
title: NAT & ports
description: 3m-ui · NAT & ports
---

# NAT & ports

The panel port (default **8080**) and every listener (node) port must be reachable from clients.

- Allow the matching TCP (and UDP where the protocol needs it) in your cloud security group / firewall
- On home broadband / NAT, forward the ports on your router
- With panel HTTPS enabled, ACME validation usually also needs inbound **80** and/or **443**

A node's access address can differ entirely from the panel domain — fill in the public host/port on the Listener itself.

Set `public_url` so subscription links use your public domain or IP.
