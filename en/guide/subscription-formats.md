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

All three are emitted as native formats; no subconverter needed.

- **Loon**: one node per line in `[Proxy]`, with the password or UUID in double quotes as in the official examples (the manual only requires quotes when the value contains a comma, but every format line and example uses them, and Loon adds them when saving), e.g. `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**: a complete mini profile (empty `[General]`, `[Proxy]`, a `[Proxy Group]` listing only real nodes, and `[Rule]`). VMess is written as `username=<UUID>`, with `encrypt-method` only for `aes-128-gcm` / `chacha20-ietf-poly1305`; `vmess-aead` is a separate switch that has to match the server and can't be derived from the cipher, so it's left out. VLESS (iOS 6.0.0+ / Mac 6.12.0+) uses `vless,host,port,username=` and covers REALITY, Vision, WS, gRPC, XHTTP and VLESS Encryption.
- **Quantumult X**: one node per line in `[server_local]`, e.g. `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

### Protocol matrix

| Protocol | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2 (salamander / port hopping / download bandwidth) | ✅ `salamander-password`, `server-ports`, `download-bandwidth` | ✅ `salamander-password`, `port-hopping`, `download-bandwidth` | ❌ commented out (no Hysteria2) |
| Shadowsocks (incl. simple-obfs) | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` + `obfs=http/tls` |
| VMess | ✅ | ✅ `username=` + optional `encrypt-method` | ✅ `method` limited to `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS | ✅ | ✅ `vless,host,port,username=` (iOS 6.0.0+ / Mac 6.12.0+) | ✅ `vless-flow=` |
| VLESS REALITY | ✅ | ✅ `reality-public-key` / `reality-short-id` | ✅ `reality-base64-pubkey` / `reality-hex-shortid` |
| VLESS Vision | ✅ | ✅ `flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443` | ✅ `vless-flow=` |
| VLESS gRPC | ❌ commented out | ✅ `grpc=true` / `grpc-service-name` / `grpc-mode` | ❌ commented out |
| Trojan (tls/ws) | ✅ | ✅ | ✅ (tls via `over-tls=true` + `tls-host`, ws via `obfs=wss`) |
| TUIC v4 / v5 | ❌ commented out | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` | ❌ commented out (no TUIC) |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| WebSocket | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` |
| http transport (vmess/vless) | ✅ `transport=http` | ❌ commented out | ❌ commented out |
| XHTTP (incl. `splithttp`) | ❌ commented out | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode` | ❌ commented out |
| HTTPUpgrade / mKCP | ❌ commented out | ❌ commented out (excluded by the manual) | ❌ commented out |
| quic / kcp and others | ❌ commented out | ❌ commented out | ❌ commented out |
| VLESS Encryption | ❌ commented out | ✅ `encryption=` passthrough | ❌ commented out |

Surge supports these VLESS transport and security combinations ([manual](https://manual.nssurge.com/policies/vless.html)):

| Transport | Security | Vision |
|---|---|---|
| RAW / TCP | none, TLS, REALITY | needs TLS, REALITY or VLESS Encryption |
| WebSocket | none, TLS | needs VLESS Encryption |
| gRPC | TLS, REALITY | not supported |
| XHTTP | none, TLS, REALITY | needs VLESS Encryption |

VLESS Encryption can sit on top of any of them. HTTPUpgrade and mKCP aren't supported. With REALITY, `tls=true` and `skip-cert-verify` are left out, and so are `fp` / `spx`. Trojan and VMess REALITY are still commented out.

XHTTP share links map like this: `type=xhttp` (or `splithttp`) plus `path` / `host` / `mode` become `xhttp=true`, `xhttp-path`, `xhttp-host` and `xhttp-mode`; `xhttp-mode` accepts `auto`, `packet-up`, `stream-up` or `stream-one`.

Some parameters have a fixed value set (`flow`, `encryption`, `reality-short-id`, `grpc-mode`, `xhttp-mode`, `ws-path`, VMess `encrypt-method`, SS cipher and `obfs`, Loon's cipher / flow / obfs); a value outside that set comments out the whole line rather than dropping the parameter and falling back to a default. A VMess node with `scy=auto`, for instance, is skipped on Surge. The `extra`, `pcs` and `vcn` fields from the official mapping table aren't handled yet and are simply left out.

quic / kcp, and VLESS Encryption on Loon and QX, are just not implemented by the exporter — that is not the same as the manual rejecting them.

Three behaviours differ from the Loon doc examples on purpose, kept from real-device testing: AnyTLS REALITY is reduced to the password only, Trojan REALITY always gets `over-tls=true`, and Hysteria2 still writes `server-ports` for a single port (see the note below).

> SIP003 plugins kcptun / shadow-tls / restls / jls have no equivalent in any of the three clients and are commented out.
>
> Loon Hysteria 2 nodes **always** carry `server-ports` — Loon does not dial without the field: a hopping range renders as `server-ports="443,5000:6000"` (colon separates ranges), a single-port node falls back to the main port (`server-ports="13290"`). Surge's `port-hopping` is optional and is only emitted when hopping exists.

## TUIC / Hysteria2 share links

Exported URIs include client-oriented params (`sni`, `alpn`, `congestion_control`, `allow_insecure` / `allowInsecure`, etc.). Classic v2rayNG may list `tuic://` but not dial QUIC; prefer Clash Meta / NekoBox / Hiddify for those protocols.
