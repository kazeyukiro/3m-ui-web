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

三者均直接生成原生配置，不依赖 subconverter。

- **Loon**：`[Proxy]` 段每行定义一个节点，密码与 UUID 均以双引号包裹。官方仅在取值含英文逗号时作强制要求，但格式行与全部示例均采用该写法，且 Loon 保存配置时会自动补齐，例如 `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- **Surge**：输出完整的迷你配置，包含空的 `[General]`、`[Proxy]`、仅引用真实节点的 `[Proxy Group]` 与 `[Rule]`。VMess 采用 `username=<UUID>` 形式，仅当加密方式为 `aes-128-gcm` 或 `chacha20-ietf-poly1305` 时输出 `encrypt-method`。`vmess-aead` 为独立布尔参数，须与服务端设置一致，官方未提供由加密方式推导的规则，故不予输出。VLESS（iOS 6.0.0+ / Mac 6.12.0+）采用 `vless,host,port,username=` 形式，支持 REALITY、Vision、WS、gRPC、XHTTP 与 VLESS Encryption。
- **Quantumult X**：`[server_local]` 段每行定义一个节点，例如 `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

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
| Trojan（tls/ws） | ✅ | ✅ | ✅（tls 经 `over-tls=true` + `tls-host`，ws 经 `obfs=wss`） |
| TUIC v4 / v5 | ❌ 注释降级 | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` | ❌ 注释降级（不支持 TUIC） |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| WebSocket | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` |
| http 传输（vmess/vless） | ✅ `transport=http` | ❌ 注释降级 | ❌ 注释降级 |
| XHTTP（含 `splithttp`） | ❌ 注释降级 | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode` | ❌ 注释降级 |
| HTTPUpgrade / mKCP | ❌ 注释降级 | ❌ 注释降级（官方明确不支持） | ❌ 注释降级 |
| quic / kcp 等 | ❌ 注释降级 | ❌ 注释降级 | ❌ 注释降级 |
| VLESS Encryption | ❌ 注释降级 | ✅ `encryption=` 透传 | ❌ 注释降级 |

Surge 的 VLESS 按传输方式区分，支持组合如下（[官方手册](https://manual.nssurge.com/policies/vless.html)）：

| 传输 | 安全层 | Vision |
|---|---|---|
| RAW / TCP | none、TLS、REALITY | 需 TLS、REALITY 或 VLESS Encryption |
| WebSocket | none、TLS | 需 VLESS Encryption |
| gRPC | TLS、REALITY | 不支持 |
| XHTTP | none、TLS、REALITY | 需 VLESS Encryption |

VLESS Encryption 可叠加于上述任意组合；HTTPUpgrade 与 mKCP 不受支持。使用 REALITY 时不输出 `tls=true` 与 `skip-cert-verify`，亦不使用 `fp` / `spx`。Trojan 与 VMess 的 REALITY 仍按注释降级。

XHTTP 的分享链接参数映射如下：`type=xhttp`（或 `splithttp`）配合 `path` / `host` / `mode`，分别输出 `xhttp=true`、`xhttp-path`、`xhttp-host` 与 `xhttp-mode`；`xhttp-mode` 的取值仅限 `auto`、`packet-up`、`stream-up`、`stream-one`。

对于取值集合固定的参数（`flow`、`encryption`、`reality-short-id`、`grpc-mode`、`xhttp-mode`、`ws-path`、VMess 的 `encrypt-method`、SS 的加密方式与 `obfs`，以及 Loon 的 cipher / flow / obfs），若分享链接中的取值超出该集合，则整行降级为注释，而非省略参数并采用默认值。例如，`scy=auto` 的 VMess 节点在 Surge 中将被跳过。官方映射表中的 `extra`、`pcs`、`vcn` 尚未实现映射，暂不输出。

以下三处与 Loon 文档示例存在差异，系依据真机测试结果保留：AnyTLS 的 REALITY 参数降级为仅保留密码，Trojan REALITY 统一输出 `over-tls=true`，Hysteria2 单端口仍输出 `server-ports`（详见下文）。

> SS 的 SIP003 包装插件中，kcptun / shadow-tls / restls / jls 在三款客户端中均无对应表达，按注释降级处理。
>
> Loon 的 Hysteria2 节点**始终输出** `server-ports`（Loon 缺少该字段时不发起拨号）：存在端口跳跃时输出区间（`server-ports="443,5000:6000"`，冒号为区间分隔符），单端口时回落至主端口（`server-ports="13290"`）。Surge 的 `port-hopping` 为可选参数，无跳跃时不输出。

## TUIC / Hysteria2 分享链

导出 URI 会带上客户端常用参数（`sni`、`alpn`、`congestion_control`、`allow_insecure` / `allowInsecure` 等）。部分旧版 v2rayNG 能列出 `tuic://` 但无法拨号 QUIC，这类协议更建议 Clash Meta / NekoBox / Hiddify 等。
