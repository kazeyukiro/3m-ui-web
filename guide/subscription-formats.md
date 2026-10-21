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

- **Loon**：`[Proxy]` 段 `协议名,地址,端口,密码/参数…` 行，如 `vmess-ws = VMess,127.0.0.1,20015,auto,91066351-60f7-44b9-ad7e-c4bcc82524a6,path=/vmessws,host=cdn.example.com,transport=ws,alterId=0,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**：完整迷你档（`[General]` 空段 + `[Proxy]` + 只引用真实节点的 `[Proxy Group]` + `[Rule]`），VMess 用手册语法 `username=` + `vmess-aead=true`
- **Quantumult X**：`[server_local]` 段 `proto=host:port, key=value, …, tag=name` 行，如 `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

### 协议支持矩阵

| 协议 | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2（salamander / 端口跳跃 / 下载带宽） | ✅ `salamander-password`、`server-ports`、`download-bandwidth` | ✅ `salamander-password`、`port-hopping`、`download-bandwidth` | ❌ 注释降级（QX 不支持 Hysteria2） |
| Shadowsocks（含 simple-obfs） | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` 关键字 + `obfs=http/tls` |
| VMess（ws/tls、AEAD） | ✅ | ✅ `username=` + `vmess-aead=true` | ✅ `method` 限 `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS（含 xtls-rprx-vision） | ✅ | ❌ 注释降级（Surge 协议清单无 VLESS） | ✅ `vless-flow=` 透传 |
| REALITY 传输 | ✅（VLESS/Trojan/VMess） | ❌ 注释降级（Surge TLS 参数集无 reality 入口） | ✅ `reality-base64-pubkey`/`reality-hex-shortid` |
| Trojan（tls/ws） | ✅ | ✅ | ✅（tls 走 `over-tls=true`+`tls-host`，ws 走 `obfs=wss`） |
| TUIC v4 / v5 | ❌ 注释降级 | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` 分流 | ❌ 注释降级（QX 不支持 TUIC） |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| WebSocket 传输 | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / TLS 时 `obfs=wss` |
| http 传输（vmess/vless） | ✅ `transport=http` | ❌ 注释降级 | ❌ 注释降级 |
| grpc / xhttp / quic 传输 | ❌ 注释降级 | ❌ 注释降级 | ❌ 注释降级 |

> SS 的 SIP003 包装插件里，kcptun / shadow-tls / restls / jls 三家均无对应表达，按注释降级处理。

> Loon 的 Hysteria2 节点**始终输出** `server-ports`（Loon 无此字段不拨号）：有端口跳跃时输出区间（`server-ports="443,5000:6000"`，冒号为区间分隔符），单端口时回落主端口（`server-ports="13290"`）。Surge 的 `port-hopping` 为可选参数，无跳跃时不输出。

## TUIC / Hysteria2 分享链

导出 URI 会带上客户端常用参数（`sni`、`alpn`、`congestion_control`、`allow_insecure` / `allowInsecure` 等）。部分旧版 v2rayNG 能列出 `tuic://` 但无法拨号 QUIC，这类协议更建议 Clash Meta / NekoBox / Hiddify 等。
