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
| `v2ray` / `base64` | 始终为分享链接换行拼接后再标准 Base64（`vless://`、`vmess://`、`tuic://` 等），与 HTML 订阅页「是否加密 URI 列表」无关 |
| `uri` / `raw` | 同样链接；关闭加密时可为明文 |
| `singbox` / `sing-box` / `sfa` / `sfm` | sing-box JSON（含默认 TUN、DNS、路由等，适配较新 sing-box 迁移）及节点 outbound |
| `loon` | Loon 插件配置（`[Proxy]` 段，原生格式，见下文） |
| `surge` | Surge 配置文件（`[General]`/`[Proxy]`/`[Proxy Group]`/`[Rule]` 迷你档，原生格式，见下文） |
| `quanx` / `quantumult` / `qx` | Quantumult X 迷你档：`[general]` + `[server_local]`（原生格式，见下文） |
| `qx-nodes` / `quanx-nodes` / `qx-snippet` / `quantumult-nodes` | Quantumult X 节点片段：仅含节点行，不含段头，供「引用资源（`server_remote`）」使用 |

部分客户端有硬编码短路径，也一并注册：`/api/v1/client/json/<token>` 固定 singbox、`/api/v1/client/clash/<token>` 固定 clash、`/api/v1/client/v2ray/<token>` 固定 v2ray；根级 `/sub/<token>`、`/json/<token>`、`/clash/<token>`、`/v2ray/<token>` 等效。短路径只覆盖 clash/v2ray/singbox 三种，其余格式一律用 `?target=`。

`qx-nodes` 输出与 `quanx` 相同的节点行，但不带 `[general]` / `[server_local]` 段头。QX 的「引用资源」把远端文件作为插入片段解析；完整配置放在该位置会得到 `Response invalid`。

## 地址族与诊断

`quanx` 与 `qx-nodes` 默认将 Hysteria2、TUIC、ShadowQUIC 的拨号地址写为 IPv4 字面量。这几种协议使用 QUIC：域名同时有 A 与 AAAA 记录时，客户端可能优先选择 IPv6；服务端 IPv6 不可达时，连接会持续超时，而同一主机的 TCP 节点不受影响。SNI 仍取原域名，证书校验不变。IPv4 解析失败时保留原主机名，节点照常输出。Loon 与 Surge 不使用该策略。

`?af=` 覆盖该策略：

| 取值 | 行为 |
|---|---|
| 缺省 | 按客户端默认：QX 系列固定 IPv4，Loon / Surge 保持主机名 |
| `4` / `ipv4` / `v4` | 强制把 UDP 协议改写为 IPv4 字面量 |
| `auto` / `0` / `host` | 不改写，输出与节点导出完全一致的主机名 |
| `6` / `ipv6` | 不支持，返回 422 |

逐个核对节点的渲染结果时，可使用 `?target=diag`；`&client=` 指定 `loon` / `surge` / `quanx` / `qx-nodes`（默认 `qx-nodes`），`?af=` 仍按上述规则取值。响应为 JSON，每个节点包含渲染后的节点行、实际拨号地址、是否跳过及原因、地址族改写说明。该端点只报告渲染结果，不生成配置。

```
/api/v1/client/sub/<token>?target=diag&client=qx-nodes&af=auto
```

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

## sing-box 版本适配

导出的 JSON 按客户端内核版本切换字段集。两个分支互斥：1.12 / 1.13 遇到 `http_clients`、`route.default_http_client` 会以 `json: unknown field` 拒绝整份配置；而 1.14 起，用默认出站为远程规则集隐式创建 HTTP 客户端的行为已废弃，并将在 1.16 移除。

内核不低于 1.14 时输出显式 `http_clients`，`detour` 指向 `proxy`，与隐式行为一致；低于 1.14 时省略该字段。版本取自 User-Agent 中的 `sing-box x.y.z`（SFA 形如 `SFA (sing-box 1.14.4; language zh_CN)`），可用 `?sbver=1.14` 覆盖。

兼容下限为 sing-box 1.12.0。1.11 及更早版本使用已被移除的旧 DNS 服务器格式，无法与 1.12 起的新格式共存。

outbound 直接由节点模型渲染，不再经过 Clash / Mihomo 的中间结构；分享链接参数与官方 outbound 字段按类型对应，字段名以 sing-box 的 outbound 参考为准。VLESS 的 `encryption` 仅在取值非 `none` 时写入：旧内核遇到该字段会报未知字段并拒绝整份配置，而省略该字段与取默认值等价。

### 订阅链接写法

链接主机名取自 `PUBLIC_URL`，路径前缀取自 `sub_path`，未设置 `sub_path` 时为 `/api/v1/client/sub`。下表省略公共前缀：

| 追加 | 行为 |
|---|---|
| 无 | 按 User-Agent 选择客户端格式 |
| `?target=singbox` | 固定输出 sing-box JSON，版本仍取自 User-Agent |
| `&sbver=1.14` | 接于上一行之后，强制 1.14 形态 |

完整形式：

```
https://example.com/api/v1/client/sub/<token>?target=singbox&sbver=1.14
```

`sbver` 只比较主次版本，`1.14` 与 `1.14.4` 等价；取值无法解析时忽略该参数，回落到 User-Agent。该参数仅在生成 sing-box 文档时读取，其它格式不受影响。

订阅页的复制按钮给出的是不带参数的链接，形态由客户端 User-Agent 决定。仅当 User-Agent 不含版本号（部分分支版本、由第三方转换器代下载）时才需手工补 `sbver`。此类客户端的真实内核低于 1.14 时不得补 `sbver=1.14`，否则整份配置会因 `http_clients` 被拒绝。

sing-box 深链需对内层查询参数整体编码：

```
sing-box://import-remote?url=https%3A%2F%2Fexample.com%2Fapi%2Fv1%2Fclient%2Fsub%2F<token>%3Ftarget%3Dsingbox%26sbver%3D1.14
```

## Apple 客户端（Loon / Surge / Quantumult X）

三者均直接生成原生配置，不依赖 subconverter。

- Loon：`[Proxy]` 段每行定义一个节点，密码与 UUID 均以双引号包裹。官方仅在取值含英文逗号时作强制要求，但格式行与全部示例均采用该写法，且 Loon 保存配置时会自动补齐，例如 `vmess-ws = VMess,127.0.0.1,20015,auto,"91066351-60f7-44b9-ad7e-c4bcc82524a6",transport=ws,alterId=0,path=/vmessws,host=cdn.example.com,over-tls=true,sni=cdn.example.com,udp=true,block-quic=false`
- Surge：输出完整的迷你配置，包含空的 `[General]`、`[Proxy]`、仅引用真实节点的 `[Proxy Group]` 与 `[Rule]`。VMess 采用 `username=<UUID>` 形式，仅当加密方式为 `aes-128-gcm` 或 `chacha20-ietf-poly1305` 时输出 `encrypt-method`。`vmess-aead` 为独立布尔参数，须与服务端设置一致，官方未提供由加密方式推导的规则，故不予输出。VLESS（iOS 6.0.0+ / Mac 6.12.0+）采用 `vless,host,port,username=` 形式，支持 REALITY、Vision、WS、gRPC、XHTTP 与 VLESS Encryption。
- Quantumult X：`[server_local]` 段每行定义一个节点，例如 `vless=127.0.0.1:20024, method=none, password=91066351-60f7-44b9-ad7e-c4bcc82524a6, obfs=wss, obfs-host=cdn.example.com, obfs-uri=/nm, udp-relay=true, tag="less-name-#1 &?测"`

Loon、Surge 与 QX 共用同一套装配流程：节点枚举、重名处理和跳过规则一致，同一节点不会在一种格式中出现、在另一种格式中消失。远程镜像节点统一按 `R<远程服务器 ID>-名称` 命名，与 Clash 导出保持一致；分享链接的 fragment 是上游客户端的标签，不作为本面板的节点名。

### 协议支持矩阵

| 协议 | Loon | Surge | Quantumult X |
|---|---|---|---|
| Hysteria2（salamander / 端口跳跃 / 下载带宽） | ✅ `salamander-password`、`server-ports`、`download-bandwidth` | ✅ `salamander-password`、`port-hopping`、`download-bandwidth` | ✅ `password`、`salamander-password`、`port-hopping`、`port-hopping-interval`、`tls-verification`、`download-bandwidth`（见下文） |
| Shadowsocks（含 simple-obfs） | ✅ `obfs-name/obfs-host` | ✅ `ss` + `obfs/obfs-host/obfs-uri` | ✅ `shadowsocks=` + `obfs=http/tls` |
| VMess | ✅ | ✅ `username=` + 可选 `encrypt-method` | ✅ `method` 限 `none`/`aes-128-gcm`/`chacha20-poly1305` |
| VLESS | ✅ | ✅ `vless,host,port,username=`（iOS 6.0.0+ / Mac 6.12.0+） | ✅ `vless-flow=` |
| VLESS REALITY | ✅ | ✅ `reality-public-key` / `reality-short-id` | ✅ `reality-base64-pubkey` / `reality-hex-shortid` |
| VLESS Vision | ✅ | ✅ `flow=xtls-rprx-vision` / `flow=xtls-rprx-vision-udp443` | ✅ `vless-flow=` |
| VLESS gRPC | ❌ 注释降级 | ✅ `grpc=true` / `grpc-service-name` / `grpc-mode` | ❌ 注释降级 |
| Trojan（tls/ws） | ✅ | ✅ | ✅（tls 经 `over-tls=true` + `tls-host`，ws 经 `obfs=wss`） |
| TUIC v4 / v5 | ❌ 注释降级 | ✅ `tuic,token=` / `tuic-v5,uuid=,password=` | ❌ 注释降级（不支持 TUIC） |
| AnyTLS | ✅ | ✅ | ✅ `over-tls=true` + `tls-host` |
| Mieru | ❌ 注释降级 | ❌ 注释降级 | ✅ `username=` + `password=` |
| WebSocket | ✅ | ✅ `ws-headers=Host:…` | ✅ `obfs=ws` / `obfs=wss` |
| http 传输（vmess/vless） | ✅ `transport=http` | ❌ 注释降级 | ✅ `obfs=http`（仅明文） |
| XHTTP | ✅ VLESS/VMess/Trojan：`transport=xhttp` / `path` / `host` / `alpn` / `xhttp-mode` | ✅ `xhttp=true` / `xhttp-path` / `xhttp-host` / `xhttp-mode`（含 `splithttp`） | ❌ 注释降级 |
| HTTPUpgrade / mKCP | ❌ 注释降级 | ❌ 注释降级（官方明确不支持） | ❌ 注释降级 |
| quic / kcp 等 | ❌ 注释降级 | ❌ 注释降级 | ❌ 注释降级 |
| VLESS Encryption | ❌ 忽略该字段 | ✅ `encryption=` 透传 | ❌ 忽略该字段 |

Loon 的 XHTTP 依据[官方文档](https://nsloon.app/docs/Node)，作为 VLESS、VMess、Trojan 的 `transport` 取值输出，字段为 `transport=xhttp`、`path`、`host`、`over-tls`、`alpn` 与 `xhttp-mode`。`xhttp-mode` 接受 `auto`、`packet-up`、`stream-up`、`stream-one`（默认 `auto`），超出该集合的取值整行降级；VLESS 的 XHTTP 节点按官方说明省略 `flow`。分享链接中的 `mode` 映射到 `xhttp-mode`。目前仅导出官方文档列出的基础参数，其余 `xhttp-*` 高级参数尚未映射，不输出。

Surge 的 VLESS 按传输方式区分，支持组合如下（[官方手册](https://manual.nssurge.com/policies/vless.html)）：

| 传输 | 安全层 | Vision |
|---|---|---|
| RAW / TCP | none、TLS、REALITY | 需 TLS、REALITY 或 VLESS Encryption |
| WebSocket | none、TLS | 需 VLESS Encryption |
| gRPC | TLS、REALITY | 不支持 |
| XHTTP | none、TLS、REALITY | 需 VLESS Encryption |

VLESS Encryption 可叠加于上述任意组合；HTTPUpgrade 与 mKCP 不受支持。Surge 在 REALITY 下不输出 `tls=true` 与 `skip-cert-verify`，`fp` / `spx` 在任何情况下均不上送。Trojan 与 VMess 的 REALITY 仍按注释降级。

对于取值集合固定的参数（`flow`、`reality-short-id`、`grpc-mode`、`xhttp-mode`、`ws-path`、VMess 的 `encrypt-method`、SS 的加密方式与 `obfs`，以及 Loon 的 cipher / flow / obfs），若分享链接中的取值超出该集合，则整行降级为注释，而非省略参数并采用默认值。例如，`scy=auto` 的 VMess 节点在 Surge 中将被跳过。`encryption` 的取值校验只存在于 Surge（须符合 `mlkem768x25519plus.*` 格式）；Loon 与 Quantumult X 不输出该字段，也不因它降级。官方映射表中的 `extra`、`pcs`、`vcn` 尚未实现映射，暂不输出。

以下三处与 Loon 文档示例存在差异，系依据真机测试结果保留：AnyTLS 的 REALITY 参数降级为仅保留密码，Trojan REALITY 统一输出 `over-tls=true`，Hysteria2 单端口仍输出 `server-ports`（详见下文）。

QX 的 Hysteria2 节点行只写入 `tls-host` 与 `tls-verification`，后者始终输出；`insecure` 链接取 `false`。`tls-alpn`、`tls-pubkey-sha256`、`tls-cert-sha256` 等键用于 QX 的标准 TLS（`over-tls`）节点行，Hysteria2 解析器不接受。此前面板强制携带的 `alpn=h3` 曾因此导致导入失败，现不再写为 `tls-alpn`。

> SS 的 SIP003 包装插件中，kcptun / shadow-tls / restls / jls 在三款客户端中均无对应表达，按注释降级处理。
>
> Loon 的 Hysteria2 节点**始终输出** `server-ports`（Loon 缺少该字段时不发起拨号）：存在端口跳跃时输出区间（`server-ports="443,5000:6000"`，冒号为区间分隔符），单端口时回落至主端口（`server-ports="13290"`）。Surge 的 `port-hopping` 为可选参数，无跳跃时不输出。

## 分享链接（URI）

分享链接没有统一规范，各协议的写法分别列在下表：scheme、userinfo 形式、路径以及允许的参数。编码器仅按表中定义输出，listener 上该语法未定义的设置不会写入链接。

| 协议 | 语法依据 | 链接携带的参数 |
|---|---|---|
| Shadowsocks | SIP002 | `plugin` |
| Hysteria2 | 官方客户端 `share` 输出 | `obfs`、`obfs-password`、`sni`、`insecure`、`pinSHA256`、`ech` |
| AnyTLS | anytls-go 的 URI 方案文档 | `sni`、`insecure` |
| VLESS / Trojan / TUIC | 客户端实现约定（Xray / v2rayN、TUIC 客户端），无规范性文档 | 传输与 TLS 参数，如 `type`、`path`、`host`、`security`、`pbk`、`sid`、`flow`、`alpn`、`congestion_control` |
| VMess | v2rayN 的 base64(JSON) 格式 | JSON 内的 `net`、`path`、`host`、`tls`、`sni` 等 |
| Snell / Sudoku / ShadowQUIC / Mieru / TrustTunnel | 上游无链接语法，沿用面板既定形态 | 面板字段 |

实现上有几点需要留意：

- Hysteria2 链接固定带 `/` 路径，形如 `hysteria2://<密码>@<host>:<port>/?...`。上下行带宽和 `alpn` 不在该语法内，仅出现在 Loon / Surge / QX 的原生配置（`download-bandwidth` 等）。
- AnyTLS 仅定义 `sni` 与 `insecure`；`fp`、`alpn` 和空闲会话参数不属于该语法。
- Shadowsocks 按 SIP002 编码：`2022-` 之外的加密方式把 `method:password` 编为 URL-safe Base64（去掉 padding）；AEAD-2022 不编码，直接百分号转义。插件写在路径 `/` 之后，插件值中的 `\`、`;`、`=`、`:` 按 TOR_PT 规则转义。
- TUIC v4 仅有 token 时，userinfo 由 token 单独构成，不会形成 `tuic://:token@`。

Snell、Sudoku、ShadowQUIC、Mieru、TrustTunnel 没有上游规范可对照，当前写法为兼容既有订阅而保留，不应视为标准。

旧版 v2rayNG 可以列出 `tuic://`，但无法建立 QUIC 连接；这类协议更适合 Clash Meta / NekoBox / Hiddify 等客户端。
