---
title: WARP
description: 3m-ui · Cloudflare WARP
---

# Cloudflare WARP

3m-ui can **register a Cloudflare WARP account** and return a Mihomo outbound YAML fragment (WireGuard or MASQUE).

## Where

**Settings → Network (Geo section) → Cloudflare WARP**

1. Choose **WireGuard** or **MASQUE**
2. Click **Register WARP**
3. YAML is shown (and copied when clipboard allows)

API:

- `POST /api/v1/system/templates/warp/register?mode=wireguard|masque|both`
- `POST /api/v1/system/templates/warp` — build YAML from operator-supplied keys (advanced)

## What it is / is not

| Yes | No |
|-----|-----|
| One-click register + YAML fragment | Automatic unlock of Netflix / ChatGPT / etc. |
| Use as **client** proxy or **server egress** outbound | Guaranteed streaming/AI region unlock |
| Panel needs **outbound HTTPS** to Cloudflare | Auto-detect unlock and rewrite routing without confirmation |

## Using WARP on the server (egress)

1. Register WARP and copy the `proxies:` entry (name is often `WARP` / `WARP-Masque`).
2. Open **Routing → Server egress**.
3. Add the proxy, then rules such as:

```text
DOMAIN-SUFFIX,openai.com,WARP
DOMAIN-SUFFIX,chatgpt.com,WARP
MATCH,DIRECT
```

4. **Save → Generate & apply**.

Streaming/AI unlock depends on the WARP edge and is **not guaranteed**. See also the main repo [warp.md](https://github.com/kazeyukiro/3m-ui/blob/main/docs/warp.md).
