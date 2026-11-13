---
title: 订阅格式与 target
---

# 订阅格式与 target

公开订阅地址（路径可能带 `web_path` 或自定义订阅前缀）：

`/api/v1/client/sub/{token}`，或配置中的订阅基址 + token。

同一个地址追加 `?target=` 即可切换客户端格式；不指定时按请求 UA 自动识别。

## `?target=`

| target | 响应内容 |
|--------|----------|
| *空 / clash / mihomo / meta* | Mihomo / Clash Meta YAML（proxies + 分组） |
| `v2ray` / `base64` | **始终**为分享链接换行拼接后再标准 Base64（`vless://`、`vmess://`、`tuic://` 等），与 HTML 订阅页「是否加密 URI 列表」无关 |
| `uri` / `raw` | 同样链接；关闭加密时可为明文 |
| `singbox` / `sing-box` / `sfa` / `sfm` | sing-box JSON（含默认 TUN、DNS、路由等，适配较新 sing-box 迁移）及节点 outbound |
| `loon` | Loon 插件配置（`[Proxy]` 段，原生格式，见下文） |
| `surge` | Surge 配置文件（`[General]`/`[Proxy]`/`[Proxy Group]`/`[Rule]` 迷你档，原生格式，见下文） |
| `quanx` / `quantumult` / `qx` | Quantumult X `[server_local]` 段（原生格式，见下文） |

部分客户端有硬编码短路径，也一并注册：`/api/v1/client/json/<token>` 固定 singbox、`/api/v1/client/clash/<token>` 固定 clash、`/api/v1/client/v2ray/<token>` 固定 v2ray；根级 `/sub/<token>`、`/json/<token>`、`/clash/<token>`、`/v2ray/<token>` 等效。短路径只覆盖 clash/v2ray/singbox 三种，其余格式一律用 `?target=`。

## UA 自动识别

不带 `?target=` 时按 User-Agent 选择默认格式，常见对应：

| UA 关键字 | 落到格式 |
|---|---|
| `clash` / `mihomo` / `meta` / `stash` / `verge` / `flclash`、Shadowrocket | Mihomo YAML |
| `sing-box` / `sfa` / `sfm` / `sfi` / `singbox` | sing-box JSON |
| `surge` | Surge |
| `quantumult` | Quantumult X |
| `loon` | Loon |
| `v2ray` / `v2rayng` / `streisand` / `hiddify` / `nekobox` 等 | Base64 分享链接列表 |

UA 命中不了任何关键字时回落到 Clash 风格。需要稳定输出请显式带 `?target=`。

## Apple 客户端（Loon / Surge / Quantumult X）

三家均为**原生格式直接生成**（无 subconverter 依赖，未部署 subconverter 也能导出）：

- **Loon**：`[Proxy]` 段 `协议名,地址,端口,密码/参数…` 行；[官方格式行与完整示例](https://nsloon.app/docs/Node) 中的位置参数密码 / UUID **一律以双引号包裹**，导出器按此形式输出（官方原文：「参数使用英文逗号分隔。密码、路径或参数值中含有英文逗号时，请使用双引号包裹。」），如 `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**：完整迷你档（`[General]` 空段 + `[Proxy]` + 只引用真实节点的 `[Proxy Group]` + `[Rule]`）；VMess 用官方语法 `username=<UUID>`，仅当加密方式为官方列出的 `aes-128-gcm` / `chacha20-ietf-poly1305` 时输出 `encrypt-method` —— `vmess-aead` 是独立布尔值且官方要求「must match the server's setting」，未给出由加密方式推导的规则，故**不输出**；VLESS（Surge iOS 6.0.0+ / Mac 6.12.0+）用 `vless,host,port,username=`，支持 REALITY（`reality-public-key` / `reality-short-id`）、Vision（`flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443`）、WS（`ws=true` / `ws-path` / `ws-headers`）、gRPC（`grpc=true` / `grpc-service-name` / `grpc-mode`）、XHTTP（`xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode`）与 VLESS Encryption（`encryption=` 透传）
- **Quantumult X**：`[server_local]` 段 `proto=host:port, key=value, …, tag=name` 行，如 `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

### 协议支持矩阵

| 协议 | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2（salamander / 端口跳跃 / 下载带宽） | ✅ `salamander-password`、`server-ports`、`download-bandwidth` | ✅ `salamander-password`、`port-hopping`、`download-bandwidth` | ❌ 注释降级（QX 不支持 Hysteria2） |
| Shadowsocks（含 simple-obfs） | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` 关键字 + `obfs=http/tls` |
| VMess（ws/tls） | ✅ | ✅ `username=` + 可选 `encrypt-method`（`aes-128-gcm` / `chacha20-ietf-poly1305`） | ✅ `method` 限 `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS（含 xtls-rprx-vision） | ✅ | ✅ `vless,host,port,username=`（Surge iOS 6.0.0+ / Mac 6.12.0+），见下方组合矩阵 | ✅ `vless-flow=` 透传 |
| VLESS REALITY | ✅ | ✅ `reality-public-key` / `reality-short-id`（仅 VLESS；Trojan/VMess 的 REALITY 仍注释降级） | ✅ `reality-base64-pubkey`/`reality-hex-shortid` |
| VLESS Vision flow | ✅ | ✅ `flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443`（RAW 需 TLS / REALITY；经 VLESS Encryption 亦可用于 WS / XHTTP；gRPC 不可用） | ✅ `vless-flow=` |
| VLESS gRPC | ❌ 注释降级 | ✅ `grpc=true` / `grpc-service-name`（仅 VLESS，需 TLS 或 REALITY） | ❌ 注释降级 |
| Trojan（tls/ws） | ✅ | ✅ | ✅（tls 走 `over-tls=true`+`tls-host`，ws 走 `obfs=wss`） |
| TUIC v4 / v5 | ❌ 注释降级 | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` 分流 | ❌ 注释降级（QX 不支持 TUIC） |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| WebSocket 传输 | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / TLS 时 `obfs=wss` |
| http 传输（vmess/vless） | ✅ `transport=http` | ❌ 注释降级 | ❌ 注释降级 |
| XHTTP（含 `splithttp` 别名） | ❌ 注释降级 | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode` | ❌ 注释降级 |
| HTTPUpgrade / mKCP 传输 | ❌ 注释降级 | ❌ 注释降级（[官方手册](https://manual.nssurge.com/policies/vless.html) 明确不支持） | ❌ 注释降级 |
| quic / kcp 等其它传输 | ❌ 注释降级（导出器未实现） | ❌ 注释降级（导出器未实现） | ❌ 注释降级（导出器未实现） |
| VLESS Encryption（`mlkem768x25519plus…`） | ❌ 注释降级（导出器未实现） | ✅ `encryption=` 透传（官方映射表 `encryption → encryption`） | ❌ 注释降级（导出器未实现） |

> **Surge VLESS 组合矩阵**（[官方手册](https://manual.nssurge.com/policies/vless.html) 原文 `Supported combinations`）：RAW/TCP 支持 `none` / `TLS` / `REALITY`，Vision 需 TLS、REALITY 或 VLESS Encryption；WebSocket 支持 `none` / `TLS`，Vision 需 VLESS Encryption；gRPC 仅 `TLS` / `REALITY` 且不支持 Vision；XHTTP 支持 `none` / `TLS` / `REALITY`，Vision 需 VLESS Encryption。官方原文：`VLESS Encryption can be added to any of these combinations. HTTPUpgrade and mKCP transports are not supported.` `fp` / `spx` 不使用（Surge 自带 BoringSSL ClientHello），REALITY 下不输出 `tls=true` 与 `skip-cert-verify`。
>
> **XHTTP 参数映射**（官方 `Share Link Parameters` 表）：`type=xhttp`（或 `splithttp`）+ `path` / `host` / `mode` → `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode`；`xhttp-mode` 的封闭取值为 `auto` / `packet-up` / `stream-up` / `stream-one`。REALITY 的 `pbk` / `sid` → `reality-public-key` / `reality-short-id`。
>
> **封闭取值集合与整行降级**：官方页给出封闭集合的参数（`flow`、`encryption` 的 `mlkem768x25519plus.*` 前缀、`reality-short-id` ≤16 位十六进制、`grpc-mode` = `gun` / `multi`、`xhttp-mode` 上述 4 值、`ws-path` 须以 `/` 开头、VMess `encrypt-method` 两值、SS `encrypt-method` / `obfs`，以及 Loon 的 cipher / flow / obfs 集合），只要分享链接里出现集合外的值，就**整行降级为注释** —— 不省略参数使用默认值、不输出文档未定义的值。因此 `scy=auto` 的 VMess 节点在 Surge 会被降级。官方映射表中的 `extra`、`pcs` / `vcn` 目前未做映射，不输出，也**不声称官方不支持**。
>
> **按实测行为保留、与文档示例不完全一致的三处（如实标注）**：Loon AnyTLS 的 REALITY 参数降级为 password-only、Loon Trojan REALITY 统一输出 `over-tls=true`、Loon Hysteria2 单端口仍输出 `server-ports`（见下方说明）。

> SS 的 SIP003 包装插件里，kcptun / shadow-tls / restls / jls 三家均无对应表达，按注释降级处理。

> Loon 的 Hysteria2 节点**始终输出** `server-ports`（Loon 无此字段不拨号）：有端口跳跃时输出区间（`server-ports="443,5000:6000"`，冒号为区间分隔符），单端口时回落主端口（`server-ports="13290"`）。Surge 的 `port-hopping` 为可选参数，无跳跃时不输出。

## TUIC / Hysteria2 分享链

导出 URI 会带上客户端常用参数（`sni`、`alpn`、`congestion_control`、`allow_insecure` / `allowInsecure` 等）。部分旧版 v2rayNG 能列出 `tuic://` 但无法拨号 QUIC，这类协议更建议 Clash Meta / NekoBox / Hiddify 等。
