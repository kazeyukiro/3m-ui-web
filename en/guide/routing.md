---
title: Routing
description: 3m-ui · Client subscription and server egress
---

# Routing

The **Routing** page has two scopes:

| Tab | Stored as | Affects |
|-----|-----------|---------|
| **Client subscription** | `visual-config` | Mihomo/Clash **subscription** YAML (`proxy-groups` / `rules`) only |
| **Server egress** | `server-routing` | **Panel Mihomo process** after traffic hits listeners (for panel Mihomo egress) |

## Batch import (both scopes)

Both tabs share one **Batch import** button in the top-right of the rule editor.

1. Paste one Mihomo rule per line. Lines starting with `#` are comments; blank lines are skipped.
2. Click Parse & preview. The backend checks every line against the [official mihomo rule docs](https://wiki.metacubex.one/config/rules) and reports unknown rule types instead of guessing:
   - accepted rules are shown normalized, e.g. `GEOIP,CN` → `GEOIP,cn`, bare IPs gain `/32`, `NETWORK,udp` → `NETWORK,UDP`;
   - rejected lines show a line number and reason, and the rest of the batch still parses;
   - duplicates within the batch are dropped.
3. Confirmed rules go in just before the trailing MATCH rule — anything after MATCH never matches. Rules you already have are skipped and reported.

A single import is capped at **5000** rules. Rule targets (`PROXY`, group names, …) must exist; a typo is rejected by the core at **Generate & apply**.

Rule types and params follow the official docs exactly: 37 rule types (including the `AND` / `OR` / `NOT` / `SUB-RULE` logic rules); `no-resolve` / `src` params are only accepted on rules about the target IP (`IP-CIDR`, `IP-SUFFIX`, `GEOIP`, `IP-ASN`, `RULE-SET`, …). Preview endpoint: `POST /api/v1/config/rules/parse` (never persists).

::: warning RULE-SET caveat
`RULE-SET,<name>,<TARGET>` references a rule-provider **in the same config**. In the server-egress scope, declare a same-named provider under **Rule providers (rule-set)** below; it takes effect on **Save → Generate & apply**. The client-subscription generator only emits the `rules` section (never `rule-providers`), so a RULE-SET rule in the client scope requires the client's own config to already define the same-named provider — otherwise the core errors with `rule set [<name>] not found` (mihomo behaviour, not an import-validation issue).
:::

## Client subscription

- Community templates (YiXuanZX / echs-top / AIsouler) fill groups + rules for the **client** YAML. Switching a template **replaces** rules and groups (does not only append).
- After save, **update the subscription in the client**.
- These rules are not merged into the serving `config.yaml`.

GEOSITE/GEOIP templates need MetaCubeX geodata — update under **Settings → Proxy & Geo**.

## Server egress

No community templates on this tab. Use **WARP domains** (after registering WARP in Settings) plus custom rules. Default remains `MATCH,DIRECT`.

The outbounds (proxy nodes) these rules point at are managed on the [Outbounds](./outbounds.md) page; this tab only picks one as the target. For the core's own DNS behaviour see [DNS settings](./dns.md).

## Server egress detail

Controls how traffic **leaves the VPS** after a user connects to a node.

- Default: `MATCH,DIRECT` (historical behaviour — all egress direct from the host).
- You can add Mihomo rules and optional `proxies` / `proxy-groups` (e.g. a WARP outbound from Settings).
- **Save → Generate & apply** so the core reloads.
- API: `GET/PUT /api/v1/config/server-routing`  
  body example: `{ "proxies": [], "proxyGroups": [], "rules": ["MATCH,DIRECT"], "warpDomains": [], "ruleProviders": [] }`
- If no `MATCH,...` line is present, the panel appends `MATCH,DIRECT`.

Server-side GEOIP/GEOSITE rules also need local Geo data.

## Config engine

**Generate & apply** rebuilds listeners and applies **server egress** into the serving config. Client community rules stay subscription-only.

Cloudflare WARP registration is under **Settings**. See [WARP](./warp.md).


## Rule providers (rule-set)

Server egress can declare Mihomo **`rule-providers`** ([docs](https://wiki.metacubex.one/config/rule-providers/)).

1. **Routing → Server egress → Rule providers → Add rule provider**  
2. **Save → Generate & apply** so `rule-providers:` is written (default path `./rule-providers/{name}.{format}` under Mihomo `-d`)  
3. Rule line: `RULE-SET,<name>,<TARGET>`  
4. Hot update: Mihomo `PUT /providers/rules/{name}`  

API: `ruleProviders` on `server-routing`; `PUT /api/v1/config/rule-providers/{name}/update`; `GET /api/v1/config/rule-providers/status`
