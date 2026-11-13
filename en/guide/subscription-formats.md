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

- **Loon**: `[Proxy]` lines `proto,addr,port,password/params…`; the [official format lines and full examples](https://nsloon.app/en/docs/Node) **always wrap positional passwords / UUIDs in double quotes**, and the exporter follows that form (verbatim: `Arguments are separated by ASCII commas. Enclose a password, path, or argument value in double quotes if it contains an ASCII comma.`), e.g. `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**: a complete mini profile (empty `[General]` + `[Proxy]` + a `[Proxy Group]` referencing only real nodes + `[Rule]`); VMess uses the documented `username=<UUID>` form, emitting `encrypt-method` only for the two documented values `aes-128-gcm` / `chacha20-ietf-poly1305` — `vmess-aead` is an independent boolean that "must match the server's setting" and the manual gives no rule to derive it from the cipher, so it is **not emitted**; VLESS (Surge iOS 6.0.0+ / Mac 6.12.0+) uses `vless,host,port,username=` and supports REALITY (`reality-public-key` / `reality-short-id`), Vision (`flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443`), WS (`ws=true` / `ws-path` / `ws-headers`), gRPC (`grpc=true` / `grpc-service-name` / `grpc-mode`), XHTTP (`xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode`) and VLESS Encryption (`encryption=` passthrough)
- **Quantumult X**: `[server_local]` lines `proto=host:port, key=value, …, tag=name`, e.g. `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

### Protocol matrix

| Protocol | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2 (salamander / port hopping / download bandwidth) | ✅ `salamander-password`, `server-ports`, `download-bandwidth` | ✅ `salamander-password`, `port-hopping`, `download-bandwidth` | ❌ commented out (QX has no Hysteria2) |
| Shadowsocks (incl. simple-obfs) | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` keyword + `obfs=http/tls` |
| VMess (ws/tls) | ✅ | ✅ `username=` + optional `encrypt-method` (`aes-128-gcm` / `chacha20-ietf-poly1305`) | ✅ `method` limited to `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS (incl. xtls-rprx-vision) | ✅ | ✅ `vless,host,port,username=` (Surge iOS 6.0.0+ / Mac 6.12.0+), see matrix below | ✅ `vless-flow=` passthrough |
| VLESS REALITY | ✅ | ✅ `reality-public-key` / `reality-short-id` (VLESS only; Trojan/VMess REALITY still commented out) | ✅ `reality-base64-pubkey`/`reality-hex-shortid` |
| VLESS Vision flow | ✅ | ✅ `flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443` (RAW needs TLS / REALITY; with VLESS Encryption also usable on WS / XHTTP; never on gRPC) | ✅ `vless-flow=` |
| VLESS gRPC | ❌ commented out | ✅ `grpc=true` / `grpc-service-name` (VLESS only, needs TLS or REALITY) | ❌ commented out |
| Trojan (tls/ws) | ✅ | ✅ | ✅ (tls via `over-tls=true`+`tls-host`, ws via `obfs=wss`) |
| TUIC v4 / v5 | ❌ commented out | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` | ❌ commented out (QX has no TUIC) |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| WebSocket transport | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` under TLS |
| http transport (vmess/vless) | ✅ `transport=http` | ❌ commented out | ❌ commented out |
| XHTTP (incl. `splithttp` alias) | ❌ commented out | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode` | ❌ commented out |
| HTTPUpgrade / mKCP transport | ❌ commented out | ❌ commented out ([official manual](https://manual.nssurge.com/policies/vless.html) explicitly excludes them) | ❌ commented out |
| quic / kcp and other transports | ❌ commented out (not implemented by the exporter) | ❌ commented out (not implemented by the exporter) | ❌ commented out (not implemented by the exporter) |
| VLESS Encryption (`mlkem768x25519plus…`) | ❌ commented out (not implemented by the exporter) | ✅ `encryption=` passthrough (official mapping: `encryption → encryption`) | ❌ commented out (not implemented by the exporter) |

> **Surge VLESS combinations** (verbatim `Supported combinations` table in the [official manual](https://manual.nssurge.com/policies/vless.html)): RAW/TCP supports `none` / `TLS` / `REALITY`, Vision requires TLS, REALITY or VLESS Encryption; WebSocket supports `none` / `TLS`, Vision requires VLESS Encryption; gRPC supports only `TLS` / `REALITY` and never Vision; XHTTP supports `none` / `TLS` / `REALITY`, Vision requires VLESS Encryption. Verbatim: `VLESS Encryption can be added to any of these combinations. HTTPUpgrade and mKCP transports are not supported.` `fp` / `spx` are not used (Surge sends its own BoringSSL ClientHello); REALITY emits neither `tls=true` nor `skip-cert-verify`.
>
> **XHTTP parameter mapping** (official `Share Link Parameters` table): `type=xhttp` (or `splithttp`) + `path` / `host` / `mode` → `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode`; `xhttp-mode` has the closed set `auto` / `packet-up` / `stream-up` / `stream-one`. REALITY `pbk` / `sid` → `reality-public-key` / `reality-short-id`.
>
> **Closed value sets and whole-line degradation**: for every parameter the manuals define as a closed set (`flow`, the `mlkem768x25519plus.*` prefix of `encryption`, `reality-short-id` up to 16 hex digits, `grpc-mode` = `gun` / `multi`, the four `xhttp-mode` values above, `ws-path` starting with `/`, the two VMess `encrypt-method` values, SS `encrypt-method` / `obfs`, and the Loon cipher / flow / obfs sets), a share-link value outside the set degrades the **whole line to a comment** — no parameter is silently omitted to take a default, and no undocumented value is emitted. A VMess node with `scy=auto` is therefore degraded on Surge. The official mapping entries `extra` and `pcs` / `vcn` are not mapped yet, are not emitted, and are **not claimed to be unsupported by the manual**.
>
> **Three behaviours kept from real-device testing, which do not exactly match the doc examples (disclosed honestly)**: Loon AnyTLS REALITY degrades to password-only, Loon Trojan REALITY always emits `over-tls=true`, and Loon Hysteria2 still emits `server-ports` for a single port (see the note below).

> For SIP003 plugins on Shadowsocks, kcptun / shadow-tls / restls / jls have no equivalent in any of the three clients and are commented out as well.

> Loon Hysteria 2 nodes **always** carry `server-ports` — Loon does not dial without the field: a hopping range renders as `server-ports="443,5000:6000"` (colon separates ranges), a single-port node falls back to the main port (`server-ports="13290"`). Surge's `port-hopping` is optional and is only emitted when hopping exists.

## TUIC / Hysteria2 share links

Exported URIs include client-oriented params (`sni`, `alpn`, `congestion_control`, `allow_insecure` / `allowInsecure`, etc.). Classic v2rayNG may list `tuic://` but not dial QUIC; prefer Clash Meta / NekoBox / Hiddify for those protocols.
