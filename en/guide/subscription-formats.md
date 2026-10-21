---
title: Subscription formats & target
---

# Subscription formats & target

Public token URL (path may use `web_path` or the configured subscription base):

`/api/v1/client/sub/{token}`, or configured subscription base + token.

Append `?target=` to switch client formats. When omitted, the format is picked by User-Agent.

## `?target=`

| target | Body |
|--------|------|
| *(empty)* / `clash` / `mihomo` / `meta` | Mihomo / Clash Meta YAML (proxies + groups) |
| `v2ray` / `base64` | **Always** standard Base64 of newline-separated share links (`vless://`, `vmess://`, `tuic://`, …). Independent of the HTML page's "encrypt URI list" option |
| `uri` / `raw` | Same links; may be plaintext when encryption is off |
| `singbox` / `sing-box` / `sfa` / `sfm` | sing-box JSON (default TUN, DNS, routes for newer sing-box releases) plus node outbounds |
| `loon` | Loon plugin config (`[Proxy]` section, native format — see below) |
| `surge` | Surge profile (`[General]` / `[Proxy]` / `[Proxy Group]` / `[Rule]` mini profile, native format — see below) |
| `quanx` / `quantumult` / `qx` | Quantumult X `[server_local]` section (native format — see below) |

Some clients hardcode short paths, which are registered as well: `/api/v1/client/json/<token>` forces singbox, `/api/v1/client/clash/<token>` forces clash, `/api/v1/client/v2ray/<token>` forces v2ray; root-level `/sub/<token>`, `/json/<token>`, `/clash/<token>`, `/v2ray/<token>` behave the same. Short paths only cover clash/v2ray/singbox — use `?target=` for everything else.

## UA auto-detection

Without `?target=`, the default format is chosen from the User-Agent:

| UA keyword | Format |
|---|---|
| `clash` / `mihomo` / `meta` / `stash` / `verge` / `flclash`, Shadowrocket | Mihomo YAML |
| `sing-box` / `sfa` / `sfm` / `sfi` / `singbox` | sing-box JSON |
| `surge` | Surge |
| `quantumult` | Quantumult X |
| `loon` | Loon |
| `v2ray` / `v2rayng` / `streisand` / `hiddify` / `nekobox`, etc. | Base64 share-link list |

When no keyword matches, Clash-style is used. Pass `?target=` explicitly for a stable output.

## Apple clients (Loon / Surge / Quantumult X)

All three are rendered as **native formats in the panel** (no subconverter dependency — they work even without a deployed subconverter):

- **Loon**: `[Proxy]` lines `proto,addr,port,password/params…`, e.g. `vmess-ws = VMess,127.0.0.1,20015,auto,91066351-60f7-44b9-ad7e-c4bcc82524a6,path=/vmessws,host=cdn.example.com,transport=ws,alterId=0,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**: a complete mini profile (empty `[General]` + `[Proxy]` + a `[Proxy Group]` referencing only real nodes + `[Rule]`); VMess uses the documented `username=` + `vmess-aead=true` form
- **Quantumult X**: `[server_local]` lines `proto=host:port, key=value, …, tag=name`, e.g. `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

### Protocol matrix

| Protocol | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2 (salamander / port hopping / download bandwidth) | ✅ `salamander-password`, `server-ports`, `download-bandwidth` | ✅ `salamander-password`, `port-hopping`, `download-bandwidth` | ❌ commented out (QX has no Hysteria2) |
| Shadowsocks (incl. simple-obfs) | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` keyword + `obfs=http/tls` |
| VMess (ws/tls, AEAD) | ✅ | ✅ `username=` + `vmess-aead=true` | ✅ `method` limited to `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS (incl. xtls-rprx-vision) | ✅ | ❌ commented out (Surge has no VLESS) | ✅ `vless-flow=` passthrough |
| REALITY transport | ✅ (VLESS/Trojan/VMess) | ❌ commented out (no reality params in Surge) | ✅ `reality-base64-pubkey`/`reality-hex-shortid` |
| Trojan (tls/ws) | ✅ | ✅ | ✅ (tls via `over-tls=true`+`tls-host`, ws via `obfs=wss`) |
| TUIC v4 / v5 | ❌ commented out | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` | ❌ commented out (QX has no TUIC) |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| WebSocket transport | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` under TLS |
| http transport (vmess/vless) | ✅ `transport=http` | ❌ commented out | ❌ commented out |
| grpc / xhttp / quic transport | ❌ commented out | ❌ commented out | ❌ commented out |

> For SIP003 plugins on Shadowsocks, kcptun / shadow-tls / restls / jls have no equivalent in any of the three clients and are commented out as well.

> Loon Hysteria 2 nodes **always** carry `server-ports` — Loon does not dial without the field: a hopping range renders as `server-ports="443,5000:6000"` (colon separates ranges), a single-port node falls back to the main port (`server-ports="13290"`). Surge's `port-hopping` is optional and is only emitted when hopping exists.

## TUIC / Hysteria2 share links

Exported URIs include client-oriented params (`sni`, `alpn`, `congestion_control`, `allow_insecure` / `allowInsecure`, etc.). Classic v2rayNG may list `tuic://` but not dial QUIC; prefer Clash Meta / NekoBox / Hiddify for those protocols.
