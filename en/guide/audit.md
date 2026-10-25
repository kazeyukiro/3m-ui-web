---
title: Website audit
description: 3m-ui · Website audit (blocklist)
---

# Website audit

**Website audit** is a **server-side blocklist**: any domain or IP on the list is rejected (Mihomo `REJECT`) for every client behind the node — blocked before an outbound connection is ever established.

Division of labor with [Routing](./routing):

| Page | Storage | Purpose |
|------|---------|---------|
| Routing → Server outbound | `server-routing` | How traffic **leaves the VPS** after reaching the node (egress rules) |
| Website audit | `blocklist` | Which destinations are **rejected outright** (prepended enforcement) |

The two are stored separately: saving from the routing editor never wipes the blocklist.

## Where and how

Panel sidebar → **Website audit**:

1. **Add entry**: domain / IP, match type (empty = auto-detect), optional remark;
2. **Batch import**: one entry per line, `#` starts a remark, type prefixes supported (see below);
3. **Save**: writes panel settings only — **not yet enforced**;
4. **Generate & apply**: rebuilds the server config and reloads Mihomo — blocking takes effect **immediately**.

The page previews the exact Mihomo rule lines that will be applied, so you can review before saving.

## Match types

| Type | Mihomo rule | Example | Notes |
|------|-------------|---------|-------|
| Exact domain `domain` | `DOMAIN,exact.host,REJECT` | `ads.example.com` | Matches that hostname only |
| Domain suffix `domain-suffix` | `DOMAIN-SUFFIX,zone,REJECT` | `example.com` | Matches the domain and all subdomains |
| Domain keyword `domain-keyword` | `DOMAIN-KEYWORD,substr,REJECT` | `cdn` | Matches when the hostname contains the substring |
| Geosite category `geosite` | `GEOSITE,category,REJECT` | `google` | Bulk blocking by geosite data |
| IP / CIDR `ip-cidr` | `IP-CIDR,net,REJECT` | `1.2.3.4`, `10.0.0.0/8` | Matches by destination IP |

With the type left empty it is auto-detected: IP or CIDR → `ip-cidr`, anything else → `domain-suffix`.

## Batch import format

One entry per line, text after `#` is the remark; a leading `#` is a comment line. Prefixes select the type explicitly:

```
example.com                  # suffix match (default)
full:exact.example.com       # exact domain
suffix:example.com           # domain suffix
keyword:cdn                  # domain keyword
geosite:google               # geosite category
ip:1.2.3.4                   # IP / CIDR
10.0.0.0/8                   # bare IP / CIDR is detected as ip-cidr too
```

Imported text goes through the same validation and normalization as manual entries; duplicates (same type + value) are dropped, first occurrence wins.

Clicking **Import** opens a **preview** first: accepted entries are listed normalized (bare IPs gain `/32`), rejected lines are reported one by one (line number + reason), and the append only happens on confirmation; entries duplicating existing ones are skipped and reported. A single import is capped at **5000** entries.

## Rules and limits

- At most **5000** entries; each value ≤ **253** characters with no commas or whitespace;
- Domain normalization: `*.example.com`, `.example.com` and `example.com` are one suffix rule;
- A bare IP is completed to `/32` (IPv6: `/128`);
- Disabled entries generate no rules; rule order follows list order.

## How enforcement works

After **Generate & apply**, the panel writes the blocklist into the Mihomo server config:

- **Prepended rules**: blocklist rules sit at the very top of the rule list — ahead of every other rule (WARP control-plane DIRECT included) — so a blocked destination is never proxied;
- **Rule mode**: with any active entry the config is forced to `mode: rule` (a global-mode fragment would bypass the whole blocklist);
- **Sniffer**: enabled whenever domain-type entries exist (TLS 443/8443, HTTP 80/8080-8880, with `parse-pure-ip` / `force-dns-mapping` / `override-destination`) so hostnames are recovered from TLS SNI / HTTP Host for matching;
- **DNS**: enabled whenever any entry is active (defaults `1.1.1.1` / `8.8.8.8`, `enhanced-mode: redir-host`).

## Semantics boundary for IP entries

IP rules carry **no** `no-resolve`: when a client dials by domain name, the engine resolves the name at match time and compares the result — so clients dialing by name **and** clients dialing by IP are both blocked (verified on a live node).

The boundary this creates: for **geo-rotating CDNs**, the server's local resolution is only one regional address; blocking that IP only intercepts connections resolved to it, while other regions miss.

> **Recommendation**: for blocking websites prefer **domain-type entries** (suffix / keyword / geosite). Reserve IP entries for owned fixed IPs, datacenter ranges, or targets you have confirmed are fixed.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/config/blocklist` | Read the blocklist (array) |
| PUT | `/api/v1/config/blocklist` | Replace it; returns the normalized list |
| POST | `/api/v1/config/blocklist/parse` | Batch-import **preview** (entries / per-line issues / dedup + truncation counts; never persists) |

Entry shape:

```json
[
  { "type": "domain-suffix", "value": "example.com", "remark": "ads", "enabled": true },
  { "type": "ip-cidr", "value": "10.0.0.0/8", "enabled": false }
]
```

`type` may be empty (auto-detect); entries are validated, normalized and de-duplicated on save (settings key `blocklist`). Run **Generate & apply** afterwards for the rules to reach the Mihomo config.
