---
title: Outbounds
description: 3m-ui · Outbound proxies for the panel's Mihomo process
---

# Outbounds

**Listeners** manage how users reach Mihomo. **Outbounds** manage the `proxies:`
of the serving Mihomo process itself — how traffic leaves the host.

The three scopes are independent and never overwrite each other:

| Scope | Where | Affects |
|-------|-------|---------|
| Listeners (inbound) | Nodes page | How users connect |
| **Server outbounds** | **Outbounds + Routing → Server egress** | **How the panel's Mihomo process reaches the internet** |
| Client subscription | Routing → Client subscription | Only the user's subscription YAML |

Outbound definitions are server-side only. Client subscription nodes stay with the
subscription generator.

## Supported protocols

Same list as inbound management plus WireGuard: Shadowsocks, Snell, VMess,
VLESS, Trojan, Hysteria2, TUIC v4/v5, ShadowQUIC, AnyTLS, Mieru, Sudoku,
TrustTunnel, HTTP, SOCKS, WireGuard.

The UI writes Mihomo's own names: Shadowsocks → `ss`, SOCKS → `socks5`, both TUIC
versions → `tuic` with their own credentials. WireGuard accepts a single root peer
or a structured peer list below.

## The form

**Basic connection** fields come first; **optional parameters** — protocol,
transport, TLS, dial, multiplexing, WireGuard — are grouped underneath using
Mihomo's field names (the catalogue follows the bundled Mihomo v1.19.33 option
structs).

Optional booleans are **tri-state**: enabled, disabled, or Mihomo default.
Clearing an optional field restores the core default instead of writing `false`.

## Save and apply

1. Save the outbound on the Outbounds page — it is persisted in the panel DB;
2. Pick an enabled outbound as the target under **Routing → Server egress** and save routing;
3. Click **Apply** to generate, validate and reload Mihomo.

Saving alone does not change the running core. Only enabled outbounds reach the
generated YAML; disabled ones stay editable in the database.

## Rename and reference protection

Renaming is atomic: server rule targets, group members, rule-provider download
proxies and other outbounds' `dialer-proxy` references are updated together.
Matching domains, regex payloads and client subscription configuration are
preserved.

Delete and disable are blocked while references remain. The request fails with
409 and the error lists where the references are (e.g.
`dialer-proxy of chain2`) — remove them first.

## WARP

A WARP account registered in Settings appears automatically as one **enabled,
read-only** `WARP` outbound. Registration keeps living in Settings; the outbound
list never exposes its private key or Cloudflare token, and links back to
Settings for account management.

Account deletion is blocked while rules, groups, providers, dialer references,
WARP domains or global WARP still use it. Apply again after deleting the account.

## Connection test

Every outbound has a **Test connection** button on desktop and mobile. It opens
diagnostics with the result, request duration, endpoint, target and each test
stage.

- Reuses the isolated Mihomo client and the fixed HTTP 204 targets of the inbound test;
- Tests the **saved** settings, including required dialer proxies and groups (and Settings-managed WARP);
- Does **not** require applying the configuration and never reloads the serving core;
- Credentials and WARP keys stay on the server and are never returned in the result;
- Results describe this server's route to the test targets — not every destination;
- Refreshing the page or changing the outbound clears the displayed result;
- Disabled outbounds cannot be tested.

> **Wrong credentials do not silently bypass:** with a bad password the result is
> `unavailable` and the node sees the authentication rejected — traffic does not
> quietly fall through to direct. A `dialer-proxy` chain behaves the same way: a
> two-hop chain logs `CONNECT <second hop>` on the first hop, proving the first
> hop is actually used.

> **`client_start_failed`**: the Mihomo binary used by the test must live under one
> of the panel's allowed prefixes (`/usr/local/lib/3m-ui/`, `/usr/local/bin/`,
> `/usr/bin/`, `/opt/`). A core installed in a temporary directory produces this
> error; move it into one of those paths and the test works again.

## Storage and custom fragments

Definitions live in `panel_settings[server-routing].proxies`, with
`disabledOutboundNames` as panel-only metadata beside them. No table or schema
migration is added. The generator writes the enabled list, including an empty one
when the last outbound is removed.

**Hand-written proxies in a custom fragment block generation.** If an enabled
fragment has a non-empty `proxies:` section, generation fails and names the
fragment:

```
custom config "hand-written" defines proxies — move these entries to 出站管理 and remove the fragment's proxies before applying
```

Move those nodes into Outbounds and delete the fragment's `proxies:` section.
Existing panel-owned server-routing definitions are unaffected.

## API

All endpoints require panel authentication and use `/api/v1`:

| Method | Endpoint | Behaviour |
| --- | --- | --- |
| GET | `/config/server-outbounds` | List `{proxy, enabled, managed}` entries, including configured WARP |
| POST | `/config/server-outbounds` | Create a `{proxy, enabled}` entry |
| PUT | `/config/server-outbounds?name=existing` | Edit or rename an entry |
| DELETE | `/config/server-outbounds?name=existing` | Delete an unreferenced entry |
| POST | `/config/server-outbounds/enabled` | Atomically set `{names: [...], enabled: boolean}` |
| POST | `/config/server-outbounds/connection-check?name=existing` | Test saved settings and dialer dependencies; return state, timing and diagnostic steps |
| PATCH | `/config/server-routing` | Update routing fields while preserving outbound definitions and disabled state |

Names in query parameters must be URL encoded. Invalid definitions return 400,
missing entries 404, dependency conflicts 409. The routing PATCH accepts `rules`,
`proxyGroups`, `warpDomains`, `warpGlobal` and `ruleProviders`; omitted fields stay
unchanged. The full-replacement routing PUT remains available.

> When calling from a script, send `proxy` fields **flat** (directly on the `proxy`
> object) without an `options` wrapper. A nested payload is accepted without
> error, but fields such as `dialer-proxy` land in an `options:` sub-block that
> Mihomo ignores — a two-hop chain silently degrades to one hop. The frontend and
> the OpenAPI schema both send flat fields.
