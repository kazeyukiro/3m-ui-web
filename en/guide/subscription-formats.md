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

All three are generated in native format and do not require a subconverter.

- **Loon**: one node per line in `[Proxy]`, with the password or UUID enclosed in double quotes. The manual only mandates quoting when the value contains a comma, but every format line and example uses quotes, and Loon adds them when saving the configuration. For example: `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**: a complete mini profile consisting of an empty `[General]`, `[Proxy]`, a `[Proxy Group]` that references only real nodes, and `[Rule]`. VMess is written as `username=<UUID>`, and `encrypt-method` is emitted only for `aes-128-gcm` or `chacha20-ietf-poly1305`. `vmess-aead` is an independent Boolean that must match the server setting; the manual defines no rule for deriving it from the cipher, so it is not emitted. VLESS (iOS 6.0.0+ / Mac 6.12.0+) is written as `vless,host,port,username=` and supports REALITY, Vision, WS, gRPC, XHTTP and VLESS Encryption.
- **Quantumult X**: one node per line in `[server_local]`, for example `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

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

The supported VLESS transport and security combinations in Surge are as follows ([manual](https://manual.nssurge.com/policies/vless.html)):

| Transport | Security | Vision |
|---|---|---|
| RAW / TCP | none, TLS, REALITY | requires TLS, REALITY or VLESS Encryption |
| WebSocket | none, TLS | requires VLESS Encryption |
| gRPC | TLS, REALITY | not supported |
| XHTTP | none, TLS, REALITY | requires VLESS Encryption |

VLESS Encryption may be added to any of these combinations; HTTPUpgrade and mKCP are not supported. With REALITY, `tls=true` and `skip-cert-verify` are omitted, as are `fp` / `spx`. Trojan and VMess REALITY remain commented out.

XHTTP share-link parameters map as follows: `type=xhttp` (or `splithttp`) together with `path` / `host` / `mode` are emitted as `xhttp=true`, `xhttp-path`, `xhttp-host` and `xhttp-mode`; `xhttp-mode` accepts only `auto`, `packet-up`, `stream-up` or `stream-one`.

For parameters with a fixed value set (`flow`, `encryption`, `reality-short-id`, `grpc-mode`, `xhttp-mode`, `ws-path`, VMess `encrypt-method`, the SS cipher and `obfs`, and Loon's cipher / flow / obfs), a value outside that set degrades the entire line to a comment rather than omitting the parameter and falling back to a default. A VMess node with `scy=auto`, for example, is skipped on Surge. The `extra`, `pcs` and `vcn` entries in the official mapping table are not yet mapped and are therefore omitted.

quic / kcp and VLESS Encryption on Loon and QX are not yet implemented by the exporter; this does not mean the manual rejects them.

The following three behaviours differ from the Loon documentation examples and are retained on the basis of real-device testing: AnyTLS REALITY is reduced to the password only, Trojan REALITY always emits `over-tls=true`, and Hysteria2 still emits `server-ports` for a single port (see the note below).

> SIP003 plugins kcptun / shadow-tls / restls / jls have no equivalent in any of the three clients and are handled as commented-out entries.
>
> Loon Hysteria 2 nodes **always** carry `server-ports`, as Loon does not dial without the field: a hopping range is rendered as `server-ports="443,5000:6000"` (a colon separates ranges), and a single-port node falls back to the main port (`server-ports="13290"`). Surge's `port-hopping` is optional and is emitted only when hopping exists.

## TUIC / Hysteria2 share links

Exported URIs include client-oriented params (`sni`, `alpn`, `congestion_control`, `allow_insecure` / `allowInsecure`, etc.). Classic v2rayNG may list `tuic://` but not dial QUIC; prefer Clash Meta / NekoBox / Hiddify for those protocols.
