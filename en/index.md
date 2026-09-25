---
layout: home

hero:
  name: 3m-ui
  text: Mihomo server panel
  tagline: Lightweight self-hosted panel for nodes, users, subscriptions, certificates and ops.
  image:
    src: /logo.png
    alt: 3m-ui
  actions:
    - theme: brand
      text: Get started
      link: /en/guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/kazeyukiro/3m-ui

features:
  - title: Nodes & protocols
    details: Manage Mihomo inbound listeners (VLESS, VMess, Trojan, Shadowsocks, Hysteria2, TUIC, and more) with Reality, TLS, quick create and batch certificates.
  - title: Users & subscriptions
    details: Quick-create users, traffic and expiry, per-node multipliers; export Mihomo YAML, URI, sing-box and more.
  - title: Routing & client config
    details: Visual rules and proxy-group templates (including CN GEOSITE/GEOIP direct); client-side routing in subscriptions.
  - title: Panel operations
    details: Install, update, restart, stable/pre channels, backup/restore, panel SSL (domain and IP certs), Telegram alerts.
  - title: Multi-node cluster
    details: Register remote panels, health checks, merge remote nodes into a local user’s subscription.
  - title: Self-hosted & scriptable
    details: Single binary or Docker, SQLite, REST API; the 3m-ui menu covers port changes, admin reset and config rescue.
---

<div class="install-block">

### One-line install

```bash
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sudo sh
```

Default panel port **8080**. Update:

```bash
sudo 3m-ui update
```

</div>
