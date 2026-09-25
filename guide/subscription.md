---
title: 订阅
description: 3m-ui · 订阅
---

# 订阅

## Subscriptions

Each user has a subscription token URL under `/api/v1/client/sub/<token>`.

- Default / Clash Meta: Mihomo client YAML

- `?target=v2ray` / `base64`: **always** Base64 of share links (required by classic clients)

- `?target=singbox`: sing-box JSON

- `?html=1`: HTML info page with QR

`sub_pull_limit` are enforced on the user subscription path (see [Users & traffic](users-traffic.html)). TUIC/Hysteria2 share links include client TLS params.


---

## 补充说明（仓库文档）

# Subscription formats

Public token URL (path may use `web_path` / custom sub base):

`/api/v1/client/sub/{token}` or configured subscription base + token.

## `?target=`

| target | Body |
|--------|------|
| *(empty / clash / default)* | Mihomo / Clash Meta YAML |
| `v2ray` / `base64` | **Always** standard Base64 of newline-separated share links (`vless://`, `vmess://`, `tuic://`, …). Independent of HTML page “encrypt URI list”. |
| `uri` / `raw` | Same links; may be plaintext when encrypt is off |
| `singbox` / `sing-box` | sing-box JSON outbounds |

UA auto-detection may choose Clash vs v2ray-style when `target` is omitted.

## TUIC / Hysteria2 share links

Exported URIs include client-oriented params (`sni`, `alpn`, `congestion_control`, `allow_insecure` / `allowInsecure`, etc.). Classic v2rayNG may list `tuic://` but not dial QUIC; prefer Clash Meta / NekoBox / Hiddify for those protocols.
