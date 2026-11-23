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
| `quanx` / `quantumult` / `qx` | Quantumult X mini profile: `[general]` + `[server_local]` (native format — see below) |
| `qx-nodes` / `quanx-nodes` / `qx-snippet` / `quantumult-nodes` | Quantumult X node snippet: node lines only, no section headers, for "reference resource" (`server_remote`) |

Some clients hardcode short paths, which are registered as well: `/api/v1/client/json/<token>` forces singbox, `/api/v1/client/clash/<token>` forces clash, `/api/v1/client/v2ray/<token>` forces v2ray; root-level `/sub/<token>`, `/json/<token>`, `/clash/<token>`, `/v2ray/<token>` behave the same. Short paths only cover clash/v2ray/singbox — use `?target=` for everything else.

`qx-nodes` emits exactly the same node lines as `quanx`; only the section headers differ. QX parses a referenced resource as an insert snippet, and a full profile carrying `[general]` / `[server_local]` is rejected as `Response invalid`, so this target writes no headers at all.

## Address family and diagnostics

Quantumult X output (`quanx` and `qx-nodes`) rewrites the dial address of UDP protocols to an IPv4 literal by default: Hysteria2, TUIC and ShadowQUIC run over QUIC, and when a host has both A and AAAA records the client may prefer IPv6 — if the server's IPv6 path is unreachable the tunnel simply times out, while every TCP protocol on the same host keeps working. The TLS SNI stays the original hostname, so certificate validation is unchanged; a failed lookup keeps the hostname instead of dropping the node. Loon and Surge do not rewrite by default.

`?af=` overrides the policy:

| Value | Behaviour |
|---|---|
| absent | Client default: QX pins UDP protocols to IPv4, Loon / Surge keep the hostname |
| `4` / `ipv4` / `v4` | Force UDP protocols to the IPv4 literal |
| `auto` / `0` / `host` | No rewrite; emit the hostname exactly as exported |
| `6` / `ipv6` | Not supported; returns 422 |

To inspect the rendering per node, use `?target=diag` with an optional `&client=` (`loon` / `surge` / `quanx` / `qx-nodes`, default `qx-nodes`); `?af=` applies here too. The response is JSON and reports, for every node, the final node line, dial host, skip decision and reason, and any address-family note. It only reports — no profile is generated.

```
/api/v1/client/sub/<token>?target=diag&client=qx-nodes&af=auto
```

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

## sing-box version handling

The exported JSON switches field sets by client core version. The two branches are mutually exclusive: 1.12 / 1.13 reject the whole document with `json: unknown field` when they see `http_clients` or `route.default_http_client`, while 1.14 deprecated the implicit HTTP client that remote rule-sets used and removes it in 1.16.

Cores at or above 1.14 receive an explicit `http_clients` whose `detour` points at `proxy`, matching the previous implicit behaviour; older cores do not. The version is read from `sing-box x.y.z` in the User-Agent (SFA sends `SFA (sing-box 1.14.4; language zh_CN)`) and can be forced with `?sbver=1.14`.

The compatibility floor is sing-box 1.12.0. 1.11 and earlier use the removed legacy DNS server format, which cannot coexist with the 1.12+ format.

Node outbounds are rendered straight from the node model rather than through the Clash / Mihomo intermediate fields, so each share-link parameter maps to a documented official outbound field (names follow sing-box's outbound reference per type). VLESS `encryption` is written only when it is not `none`: it is a newer field, and older cores reject the whole document over an unknown field, while omitting it is equivalent to the default.

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
- Quantumult X: one node per line in `[server_local]`, for example `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

All three share one assembly pipeline: enumerate the user's bound nodes, apply the address-family policy, deduplicate names, skip unsupported protocols, render the node lines, then add the header and footer. Whether a node appears in a given format, and what it is called, therefore stays consistent across the three. Nodes imported from a remote mirror are always named `R<remote server ID>-<name>`, the same way the Clash exporter names them, rather than taking the fragment of the share link (that is the upstream client's label).

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
| Mieru | ❌ commented out | ❌ commented out | ✅ `username=` + `password=` |
| WebSocket | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` |
| http transport (vmess/vless) | ✅ `transport=http` | ❌ commented out | ✅ `obfs=http` (plain text only) |
| XHTTP | ✅ VLESS/VMess/Trojan: `transport=xhttp` / `path` / `host` / `alpn` / `xhttp-mode` | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode` (incl. `splithttp`) | ❌ commented out |
| HTTPUpgrade / mKCP | ❌ commented out | ❌ commented out (excluded by the manual) | ❌ commented out |
| quic / kcp and others | ❌ commented out | ❌ commented out | ❌ commented out |
| VLESS Encryption | ❌ field ignored | ✅ `encryption=` passthrough | ❌ field ignored |

Loon's XHTTP follows the [official documentation](https://nsloon.app/en/docs/Node): it is emitted as a `transport` value for VLESS, VMess and Trojan, with the fields `transport=xhttp`, `path`, `host`, `over-tls`, `alpn` and `xhttp-mode`. `xhttp-mode` accepts `auto`, `packet-up`, `stream-up` and `stream-one` (default `auto`); a value outside that set degrades the whole line. As the manual states, VLESS nodes omit `flow` under XHTTP. The share-link `mode` field maps to `xhttp-mode`. Only the basic parameters documented by Loon are exported; the remaining `xhttp-*` advanced parameters are not yet mapped and are therefore omitted.

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

A Quantumult X Hysteria2 line carries only `tls-host` and `tls-verification`; the latter is always written and is `false` for an insecure link. Keys such as `tls-alpn`, `tls-pubkey-sha256` and `tls-cert-sha256` belong to QX's standard-TLS (`over-tls`) lines and are rejected by the Hysteria2 parser, so the panel's internal `alpn=h3` never becomes `tls-alpn`.

> SIP003 plugins kcptun / shadow-tls / restls / jls have no equivalent in any of the three clients and are handled as commented-out entries.
>
> Loon Hysteria 2 nodes always carry `server-ports`, as Loon does not dial without the field: a hopping range is rendered as `server-ports="443,5000:6000"` (a colon separates ranges), and a single-port node falls back to the main port (`server-ports="13290"`). Surge's `port-hopping` is optional and is emitted only when hopping exists.

## Share links (URI)

Each protocol's link grammar is described once: scheme, userinfo shape, path, and the parameters that grammar defines. The encoder writes only those parameters, so a listener setting cannot leak into a link and be read by the client as a protocol field.

| Protocol | Grammar source | Parameters carried |
|---|---|---|
| Shadowsocks | SIP002 | `plugin` |
| Hysteria2 | the official client's `share` output | `obfs`, `obfs-password`, `sni`, `insecure`, `pinSHA256`, `ech` |
| AnyTLS | anytls-go URI scheme document | `sni`, `insecure` |
| VLESS / Trojan / TUIC | client implementations (Xray / v2rayN, TUIC clients); no normative spec | transport and TLS parameters such as `type`, `path`, `host`, `security`, `pbk`, `sid`, `flow`, `alpn`, `congestion_control` |
| VMess | v2rayN base64(JSON) form | `net`, `path`, `host`, `tls`, `sni` inside the JSON |
| Snell / Sudoku / ShadowQUIC / Mieru / TrustTunnel | no upstream grammar; the panel-defined form is kept | panel fields |

Details that are easy to trip over:

- A Hysteria2 link always carries the `/` path, as in `hysteria2://<password>@<host>:<port>/?...`. Up/down bandwidth and `alpn` are not part of that grammar; they only appear in the Loon / Surge / QX profiles (`download-bandwidth` and friends).
- AnyTLS carries only `sni` and `insecure`; `fp`, `alpn` and idle-session parameters have no place in the grammar.
- Shadowsocks follows SIP002: ciphers other than `2022-` encode `method:password` as URL-safe Base64 without padding, AEAD-2022 stays unencoded and percent-escaped; with a plugin the authority gains a trailing `/`, and `\`, `;`, `=` and `:` inside plugin values are backslash-escaped per TOR_PT rules.
- TUIC v4 with a token only uses the token as the whole userinfo, so it is never written as `tuic://:token@`.

Snell, Sudoku, ShadowQUIC, Mieru and TrustTunnel have no upstream grammar to cite; the current form exists so that existing subscriptions keep importing, and should not be treated as a standard.

Classic v2rayNG may list `tuic://` but not dial QUIC; prefer Clash Meta / NekoBox / Hiddify for those protocols.
