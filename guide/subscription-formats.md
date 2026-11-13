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

三家都直接生成原生格式，不需要 subconverter。

- **Loon**：`[Proxy]` 里每行一个节点，密码和 UUID 用双引号包住（官方只要求值里含英文逗号时加引号，但格式行和示例一律这么写，Loon 保存时也会补上），如 `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**：输出一份完整小配置（空的 `[General]`、`[Proxy]`、只列真实节点的 `[Proxy Group]`、`[Rule]`）。VMess 写 `username=<UUID>`，`encrypt-method` 只在 `aes-128-gcm` / `chacha20-ietf-poly1305` 时出现；`vmess-aead` 是独立开关、须和服务端一致，没法从加密方式推出来，所以不写。VLESS（iOS 6.0.0+ / Mac 6.12.0+）用 `vless,host,port,username=`，支持 REALITY、Vision、WS、gRPC、XHTTP 和 VLESS Encryption。
- **Quantumult X**：`[server_local]` 里每行一个节点，如 `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

### 协议支持矩阵

| 协议 | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2（salamander / 端口跳跃 / 下载带宽） | ✅ `salamander-password`、`server-ports`、`download-bandwidth` | ✅ `salamander-password`、`port-hopping`、`download-bandwidth` | ❌ 注释降级（不支持 Hysteria2） |
| Shadowsocks（含 simple-obfs） | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` + `obfs=http/tls` |
| VMess | ✅ | ✅ `username=` + 可选 `encrypt-method` | ✅ `method` 限 `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS | ✅ | ✅ `vless,host,port,username=`（iOS 6.0.0+ / Mac 6.12.0+） | ✅ `vless-flow=` |
| VLESS REALITY | ✅ | ✅ `reality-public-key` / `reality-short-id` | ✅ `reality-base64-pubkey` / `reality-hex-shortid` |
| VLESS Vision | ✅ | ✅ `flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443` | ✅ `vless-flow=` |
| VLESS gRPC | ❌ 注释降级 | ✅ `grpc=true` / `grpc-service-name` / `grpc-mode` | ❌ 注释降级 |
| Trojan（tls/ws） | ✅ | ✅ | ✅（tls 用 `over-tls=true` + `tls-host`，ws 用 `obfs=wss`） |
| TUIC v4 / v5 | ❌ 注释降级 | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` | ❌ 注释降级（不支持 TUIC） |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| WebSocket | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` |
| http 传输（vmess/vless） | ✅ `transport=http` | ❌ 注释降级 | ❌ 注释降级 |
| XHTTP（含 `splithttp`） | ❌ 注释降级 | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode` | ❌ 注释降级 |
| HTTPUpgrade / mKCP | ❌ 注释降级 | ❌ 注释降级（官方明确不支持） | ❌ 注释降级 |
| quic / kcp 等 | ❌ 注释降级 | ❌ 注释降级 | ❌ 注释降级 |
| VLESS Encryption | ❌ 注释降级 | ✅ `encryption=` 透传 | ❌ 注释降级 |

Surge 的 VLESS 按传输区分（[官方手册](https://manual.nssurge.com/policies/vless.html)）：

| 传输 | 安全层 | Vision |
|---|---|---|
| RAW / TCP | none、TLS、REALITY | 需 TLS、REALITY 或 VLESS Encryption |
| WebSocket | none、TLS | 需 VLESS Encryption |
| gRPC | TLS、REALITY | 不支持 |
| XHTTP | none、TLS、REALITY | 需 VLESS Encryption |

VLESS Encryption 可以叠加在上面任意一种组合上，HTTPUpgrade 和 mKCP 不支持。REALITY 下不写 `tls=true` 和 `skip-cert-verify`，`fp` / `spx` 也不用。Trojan 和 VMess 的 REALITY 仍按注释降级。

XHTTP 的分享链接参数这样对应：`type=xhttp`（或 `splithttp`）加 `path` / `host` / `mode`，分别写成 `xhttp=true`、`xhttp-path`、`xhttp-host`、`xhttp-mode`；`xhttp-mode` 只有 `auto`、`packet-up`、`stream-up`、`stream-one`。

有固定取值范围的参数（`flow`、`encryption`、`reality-short-id`、`grpc-mode`、`xhttp-mode`、`ws-path`、VMess 的 `encrypt-method`、SS 的加密方式和 `obfs`、Loon 的 cipher / flow / obfs），值不在范围内就整行注释掉，不会省略参数去套默认值。比如 `scy=auto` 的 VMess 在 Surge 里会被跳过。官方映射表里的 `extra`、`pcs`、`vcn` 还没做，暂时不输出。

quic / kcp，以及 Loon 和 QX 的 VLESS Encryption，是导出器还没实现，不是官方不支持。

有三处和 Loon 文档示例不同，是按真机结果留的：AnyTLS 的 REALITY 参数降级成只留密码，Trojan REALITY 统一加 `over-tls=true`，Hysteria2 单端口也照样写 `server-ports`（下面有说明）。

> SS 的 SIP003 包装插件里，kcptun / shadow-tls / restls / jls 都没有对应表达，按注释降级处理。
>
> Loon 的 Hysteria2 节点**始终输出** `server-ports`（Loon 无此字段不拨号）：有端口跳跃时输出区间（`server-ports="443,5000:6000"`，冒号为区间分隔符），单端口时回落主端口（`server-ports="13290"`）。Surge 的 `port-hopping` 为可选参数，无跳跃时不输出。

## TUIC / Hysteria2 分享链

导出 URI 会带上客户端常用参数（`sni`、`alpn`、`congestion_control`、`allow_insecure` / `allowInsecure` 等）。部分旧版 v2rayNG 能列出 `tuic://` 但无法拨号 QUIC，这类协议更建议 Clash Meta / NekoBox / Hiddify 等。
