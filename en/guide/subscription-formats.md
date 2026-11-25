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
| `quanx` / `quantumult` / `qx` | Quantumult X node section: `[server_local]` plus one node per line (native format — see below) |
| `qx-nodes` / `quanx-nodes` / `qx-snippet` / `quantumult-nodes` | The same node lines without a section header; intended for an added subscription (`server_remote`) |
| `shadowrocket` | Base64 share-link list, identical to `v2ray` except that AnyTLS links keep only `sni` and `insecure` |

Some clients hardcode short paths, which are registered as well: `/api/v1/client/json/<token>` forces singbox, `/api/v1/client/clash/<token>` forces clash, `/api/v1/client/v2ray/<token>` forces v2ray; root-level `/sub/<token>`, `/json/<token>`, `/clash/<token>`, `/v2ray/<token>` behave the same. Short paths only cover clash/v2ray/singbox — use `?target=` for everything else.

`quanx` and `qx-nodes` emit identical node lines and differ only in the header: `quanx` starts with `[server_local]` for a configuration import, `qx-nodes` carries no header at all for an added subscription (`server_remote`). Neither substitutes for the other: a document with a section header is rejected as a remote resource with `Response invalid`.

Neither writes `[general]`, `[dns]`, `[policy]` or `[filter_local]`. QX merges a configuration import by section, so emitting those replaces the settings, policy groups and routing rules already in the app, and an import whose policy members do not resolve to imported tags is rejected outright.

## Address family and diagnostics

Both QX targets write the dial address of Hysteria2, TUIC and ShadowQUIC as an IPv4 literal by default. These protocols use QUIC: when a hostname has both A and AAAA records, the client may select IPv6; if the server's IPv6 route is unreachable, the connection times out, while TCP nodes on the same host are unaffected. SNI remains the original hostname, so certificate validation is unchanged. If IPv4 resolution fails, the hostname is kept and the node is still emitted.

Loon, Surge, sing-box, Shadowrocket and the URI lists (`uri` / `v2ray`) keep the hostname by default; `?af=4` applies the same policy when needed. The parameter applies to every `?target=` value; a single-listener access-token subscription serves YAML or the Shadowrocket list only and does not read it.

`?af=` overrides the policy:

| Value | Behaviour |
|---|---|
| absent | Client default: QX pins UDP protocols to IPv4, all other targets keep the hostname |
| `4` / `ipv4` / `v4` | Force UDP protocols to the IPv4 literal |
| `auto` / `0` / `host` | No rewrite; emit the hostname exactly as exported |
| `6` / `ipv6` | Not supported; returns 422 |

To check the rendering of individual nodes, use `?target=diag`. `&client=` selects `loon`, `surge`, `quanx` or `qx-nodes` (default `qx-nodes`); `?af=` follows the same rules as above. The response is JSON with one entry per node: the rendered line, dial address, skip decision and reason, and any address-family note. The endpoint reports rendering only and writes no profile.

```
/api/v1/client/sub/<token>?target=diag&client=qx-nodes&af=auto
```

## UA auto-detection

Without `?target=`, the default format is chosen from the User-Agent:

| UA keyword | Format |
|---|---|
| `clash` / `mihomo` / `meta` / `stash` / `verge` / `flclash` | Mihomo YAML |
| `sing-box` / `sfa` / `sfm` / `sfi` / `singbox` | sing-box JSON |
| `shadowrocket` | Base64 share-link list (AnyTLS trimmed) |
| `surge` | Surge |
| `quantumult` | Quantumult X |
| `loon` | Loon |
| `v2ray` / `v2rayng` / `streisand` / `hiddify` / `nekobox`, etc. | Base64 share-link list |

When no keyword matches, Clash-style is used. Pass `?target=` explicitly for a stable output.

## sing-box version handling

The exported JSON switches field sets by client core version. The two branches are mutually exclusive: 1.12 / 1.13 reject the whole document with `json: unknown field` when they see `http_clients` or `route.default_http_client`, while 1.14 deprecated the implicit HTTP client that remote rule-sets used and removes it in 1.16.

Cores at or above 1.14 receive an explicit `http_clients` whose `detour` points at `proxy`, matching the previous implicit behaviour; older cores do not. The version is read from `sing-box x.y.z` in the User-Agent (SFA sends `SFA (sing-box 1.14.4; language zh_CN)`) and can be forced with `?sbver=1.14`.

The compatibility floor is sing-box 1.12.0. 1.11 and earlier use the removed legacy DNS server format, which cannot coexist with the 1.12+ format.

Outbounds are rendered directly from the node model, with no Clash / Mihomo intermediate structure. Share-link parameters map to official outbound fields by type, using the names in sing-box's outbound reference. VLESS `encryption` is written only when its value is not `none`: older cores report an unknown field and reject the entire document, while omitting it has the same effect as the default.

### Subscription link forms

The host comes from `PUBLIC_URL` and the prefix from `sub_path`, which defaults to `/api/v1/client/sub`. The table below omits the common prefix:

| Appended | Behaviour |
|---|---|
| nothing | Client format selected from the User-Agent |
| `?target=singbox` | Always sing-box JSON; the version still comes from the User-Agent |
| `&sbver=1.14` | Added to the row above; forces the 1.14 form |

The full form:

```
https://example.com/api/v1/client/sub/<token>?target=singbox&sbver=1.14
```

`sbver` compares major and minor only, so `1.14` and `1.14.4` are equivalent; an unparsable value is ignored and the User-Agent decides. It is read only while rendering a sing-box document and has no effect on other formats.

The copy buttons on the subscription page hand out the bare link, leaving the form to the client User-Agent. `sbver` is needed only when the User-Agent carries no version, which happens with some forks and with third-party converters fetching on the client's behalf. Do not add `sbver=1.14` for such a client if its core is below 1.14, since the document would then be rejected over `http_clients`.

The sing-box deep link requires the inner query to be encoded as a whole:

```
sing-box://import-remote?url=https%3A%2F%2Fexample.com%2Fapi%2Fv1%2Fclient%2Fsub%2F<token>%3Ftarget%3Dsingbox%26sbver%3D1.14
```

## Apple clients (Loon / Surge / Quantumult X)

All three are generated in native format and do not require a subconverter.

- Loon: one node per line in `[Proxy]`, with the password or UUID enclosed in double quotes. The manual only mandates quoting when the value contains a comma, but every format line and example uses quotes, and Loon adds them when saving the configuration. For example: `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- Surge: a complete mini profile consisting of an empty `[General]`, `[Proxy]`, a `[Proxy Group]` that references only real nodes, and `[Rule]`. VMess is written as `username=<UUID>`, and `encrypt-method` is emitted only for `aes-128-gcm` or `chacha20-ietf-poly1305`. `vmess-aead` is an independent Boolean that must match the server setting; the manual defines no rule for deriving it from the cipher, so it is not emitted. VLESS (iOS 6.0.0+ / Mac 6.12.0+) is written as `vless,host,port,username=` and supports REALITY, Vision, WS, gRPC, XHTTP and VLESS Encryption.
- Quantumult X: the `[server_local]` section only, one node per line, for example `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`. No other section is written, for the reason given above: QX merges by section and a node source must not overwrite the user's own policies and rules. An anytls line follows the official `sample.conf` example and carries `over-tls`, `tls-host` and `tls-verification`, never `tls-alpn`.

Loon, Surge and QX share one assembly pipeline: node enumeration, name deduplication and naming rules are the same, so all three profiles are built from the same node set. Protocols a client does not support are still degraded to a comment by that client's own rules, as the table below shows. Nodes from a remote mirror are named `R<remote server ID>-<name>`, as in the Clash export. The share-link fragment belongs to the upstream client and is not used as the node name here.

### Protocol matrix

| Protocol | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2 (salamander / port hopping / download bandwidth) | ✅ `salamander-password`, `server-ports`, `download-bandwidth` | ✅ `salamander-password`, `port-hopping`, `download-bandwidth` | ✅ `password`, `salamander-password`, `port-hopping`, `port-hopping-interval`, `tls-verification`, `download-bandwidth` (see below) |
| Shadowsocks (incl. simple-obfs) | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` + `obfs=http/tls` |
| VMess | ✅ | ✅ `username=` + optional `encrypt-method` | ✅ `method` limited to `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS | ✅ | ✅ `vless,host,port,username=` (iOS 6.0.0+ / Mac 6.12.0+) | ✅ `vless-flow=` |
| VLESS REALITY | ✅ | ✅ `reality-public-key` / `reality-short-id` | ✅ `reality-base64-pubkey` / `reality-hex-shortid` |
| VLESS Vision | ✅ | ✅ `flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443` | ✅ `vless-flow=` |
| VLESS gRPC | ❌ commented out | ✅ `grpc=true` / `grpc-service-name` / `grpc-mode` | ❌ commented out |
| Trojan (tls/ws) | ✅ | ✅ | ✅ (tls via `over-tls=true` + `tls-host`, ws via `obfs=wss`) |
| TUIC v4 / v5 | ❌ commented out | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` | ❌ commented out (no TUIC) |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| Mieru | ✅ `username=` + `password=` (TCP transport only) | ❌ commented out | ✅ `username=` + `password=` |
| Snell (v4 / v5) | ✅ `version=4/5`, `obfs=http`, `obfs-host`, `obfs-uri`, `udp` | ❌ commented out | ❌ commented out |
| WebSocket | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` |
| http transport (vmess/vless) | ✅ `transport=http` | ❌ commented out | ✅ `obfs=http` (plain text only) |
| XHTTP | ✅ VLESS/VMess/Trojan: `transport=xhttp` / `path` / `host` / `alpn` / `xhttp-mode` | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode` (incl. `splithttp`) | ❌ commented out |
| HTTPUpgrade / mKCP | ❌ commented out | ❌ commented out (excluded by the manual) | ❌ commented out |
| quic / kcp and others | ❌ commented out | ❌ commented out | ❌ commented out |
| VLESS Encryption | ❌ field ignored | ✅ `encryption=` passthrough | ❌ field ignored |

Loon's XHTTP follows the [official documentation](https://nsloon.app/en/docs/Node): it is emitted as a `transport` value for VLESS, VMess and Trojan, with the fields `transport=xhttp`, `path`, `host`, `over-tls`, `alpn` and `xhttp-mode`. `xhttp-mode` accepts `auto`, `packet-up`, `stream-up` and `stream-one` (default `auto`); a value outside that set degrades the whole line. As the manual states, VLESS nodes omit `flow` under XHTTP. The share-link `mode` field maps to `xhttp-mode`. Only the basic parameters documented by Loon are exported; the remaining `xhttp-*` advanced parameters are not yet mapped and are therefore omitted.

Loon 3.5.4 added Snell and Tailscale, and the node reference also documents WireGuard and Mieru. The panel writes Snell and Mieru lines:

- Snell is emitted as `Snell,server,port,"PSK",version=4|5`. With HTTP obfuscation the line also carries `obfs=http`, `obfs-host` and `obfs-uri`; when the listener enables UDP it carries `udp=true` and `block-quic=false`. A `version` outside 4 and 5, or an obfuscation mode other than `none` / `http`, degrades the whole line to a comment.
- Mieru is emitted as `mieru,server,port,"username","password"`. Loon dials the Mieru TCP listener only, so a node with `transport=UDP` degrades to a comment. `transport`, `multiplexing` and `traffic-pattern` have no Loon argument and are not written.

WireGuard and Tailscale are not exported. The panel has neither listener type and does not parse their links, so the required fields — `interface-ip`, `private-key`, `peers`, or `auth-key` and `exit-node` — have no source, and a generated node could not connect.

The supported VLESS transport and security combinations in Surge are as follows ([manual](https://manual.nssurge.com/policies/vless.html)):

| Transport | Security | Vision |
|---|---|---|
| RAW / TCP | none, TLS, REALITY | requires TLS, REALITY or VLESS Encryption |
| WebSocket | none, TLS | requires VLESS Encryption |
| gRPC | TLS, REALITY | not supported |
| XHTTP | none, TLS, REALITY | requires VLESS Encryption |

VLESS Encryption may be added to any of these combinations; HTTPUpgrade and mKCP are not supported. Under REALITY, Surge emits neither `tls=true` nor `skip-cert-verify`, and `fp` / `spx` are never emitted. Trojan and VMess REALITY remain commented out.

For parameters with a fixed value set (`flow`, `reality-short-id`, `grpc-mode`, `xhttp-mode`, `ws-path`, VMess `encrypt-method`, the SS cipher and `obfs`, and Loon's cipher / flow / obfs), a value outside that set degrades the entire line to a comment rather than omitting the parameter and falling back to a default. A VMess node with `scy=auto`, for example, is skipped on Surge. `encryption` values are validated only by Surge (they must match the `mlkem768x25519plus.*` format); Loon and Quantumult X do not emit the field and do not degrade the line because of it. The `extra`, `pcs` and `vcn` entries in the official mapping table are not yet mapped and are therefore omitted.

The following three behaviours differ from the Loon documentation examples and are retained on the basis of real-device testing: AnyTLS REALITY is reduced to the password only, Trojan REALITY always emits `over-tls=true`, and Hysteria2 still emits `server-ports` for a single port (see the note below).

On a QX Hysteria2 line, only `tls-host` and `tls-verification` are written; the latter is always present and is `false` for an insecure link. Keys such as `tls-alpn`, `tls-pubkey-sha256` and `tls-cert-sha256` belong to QX's standard-TLS (`over-tls`) lines and are not accepted by the Hysteria2 parser. The panel's forced `alpn=h3` previously broke imports for this reason and is no longer written as `tls-alpn`.

> SIP003 plugins kcptun / shadow-tls / restls / jls have no equivalent in any of the three clients and are handled as commented-out entries.
>
> Loon Hysteria 2 nodes always carry `server-ports`, as Loon does not dial without the field: a hopping range is rendered as `server-ports="443,5000:6000"` (a colon separates ranges), and a single-port node falls back to the main port (`server-ports="13290"`). Surge's `port-hopping` is optional and is emitted only when hopping exists.

## Share links (URI)

Share links have no single specification, so each protocol is described separately: scheme, userinfo form, path and accepted parameters. The encoder emits only what the table defines; listener settings outside that grammar do not appear in the link.

| Protocol | Grammar source | Parameters carried |
|---|---|---|
| Shadowsocks | SIP002 | `plugin` |
| Hysteria2 | the official client's `share` output | `obfs`, `obfs-password`, `sni`, `insecure`, `pinSHA256`, `ech` |
| AnyTLS | anytls-go URI scheme document | `sni`, `insecure` |
| VLESS / Trojan / TUIC | client implementations (Xray / v2rayN, TUIC clients); no normative spec | transport and TLS parameters such as `type`, `path`, `host`, `security`, `pbk`, `sid`, `flow`, `alpn`, `congestion_control` |
| VMess | v2rayN base64(JSON) form | `net`, `path`, `host`, `tls`, `sni` inside the JSON |
| Snell / Sudoku / ShadowQUIC / Mieru / TrustTunnel | no upstream grammar; the panel-defined form is kept | panel fields |

A few implementation details:

- A Hysteria2 link always carries the `/` path, as in `hysteria2://<password>@<host>:<port>/?...`. Up/down bandwidth and `alpn` are outside that grammar; they appear only in the Loon / Surge / QX profiles (`download-bandwidth` and similar).
- The published AnyTLS grammar defines only `sni` and `insecure`. The panel also writes `fp`, which clients read as the TLS ClientHello fingerprint — the v1.4.7 output carried it too; `alpn` and the idle-session settings are still omitted.
- Shadowsocks follows SIP002: ciphers without the `2022-` prefix encode `method:password` as URL-safe Base64 with padding stripped; AEAD-2022 remains unencoded and percent-escaped. A plugin follows the `/` path, and `\`, `;`, `=` and `:` in plugin values are backslash-escaped per TOR_PT rules.
- When a TUIC v4 node carries only a token, the userinfo consists of that token alone and never becomes `tuic://:token@`.

Snell, Sudoku, ShadowQUIC, Mieru and TrustTunnel have no upstream specification to follow; the current form is retained for compatibility with existing subscriptions and should not be treated as a standard.

Classic v2rayNG can list `tuic://` but cannot establish a QUIC connection; Clash Meta, NekoBox and Hiddify are better suited to these protocols.
