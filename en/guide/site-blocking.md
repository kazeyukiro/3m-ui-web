---
title: Site splitting and blocking
description: 3m-ui · Split and block sites with routing rules
---

# Site splitting and blocking

The panel accepts custom Mihomo rules to route traffic by destination and to block selected sites. Rules are written on the **Routing** page in one of two scopes, which are stored separately:

| Tab | Takes effect on | Where it goes |
|-----|-----------------|---------------|
| Client subscription | The devices using the subscription | Into the `proxy-groups` and `rules` of the Mihomo/Clash subscription |
| Server egress | The panel's own Mihomo process | Decides which outbound carries traffic after it enters a node |

Which scope a blocking rule belongs to depends on whose traffic is being blocked. To block traffic on your own devices, write the rule in **Client subscription**. To block traffic passing through the panel's link, write it in **Server egress**.

## Blocking a site

Mihomo drops a matching connection when its target is `REJECT`. To block one domain, use exact or suffix matching:

```text
DOMAIN,ads.example.com,REJECT
DOMAIN-SUFFIX,tracker.example.com,REJECT
```

To block a category of sites in bulk, use a GEOSITE category, for example the built-in ad list:

```text
GEOSITE,category-ads-all,REJECT
```

Rules are evaluated from top to bottom and evaluation stops at the first match. The fallback `MATCH` rule must come after all blocking rules; placed earlier, it prevents them from matching.

The **Client subscription** scope includes a **Sample ad domains → REJECT** template as a starting point. The **Batch import** button at the top right of the rule editor accepts multiple lines at once, and the backend reports the line number and reason for every rejected line. Rule types and parameters follow the [official mihomo documentation](https://wiki.metacubex.one/config/rules).

## Splitting traffic between outbounds

Splitting is written by pointing a domain at a policy group rather than at `REJECT`:

```text
DOMAIN-SUFFIX,example.com,My Node
GEOSITE,netflix,Streaming Group
MATCH,DIRECT
```

Policy groups are maintained in the group section above the rule editor, and nodes are added under **Outbounds**. Server-side outbound nodes are also maintained there; the Routing page only selects them as rule targets. A rule target must exist — a typo is rejected when the configuration is generated.

## How rules reach clients

Rules written in the **Client subscription** scope enter that user's subscription once saved. The client picks them up on the next subscription refresh, with no configuration needed on the device. Policy-group members in the subscription are replaced with that subscription's nodes, and server-only fields are removed.

Rules written in the **Server egress** scope affect only the panel's Mihomo process and are never written into a client subscription. The two scopes are stored independently and are never copied into one another.

Update the Geo data under **System settings → Proxy & Geo** before using GEOSITE or GEOIP rules.

## See also

- [Routing](./routing.md): fields of both scopes, batch-import details, and rule providers
- [Outbounds](./outbounds.md): where the nodes used as rule targets come from
- [DNS settings](./dns.md): resolution behaviour of the panel's Mihomo core
