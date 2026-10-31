---
title: 出站管理
description: 3m-ui · 服务端 Mihomo 的出站代理（proxies）
---

# 出站管理

「入站管理」管的是 Mihomo 的 Listener（用户怎么进来），「出站管理」管的是**面板 Mihomo 进程自己的 `proxies:`**（流量怎么出去）。

三者互不相干，改动不会互相覆盖：

| 范围 | 位置 | 影响 |
|------|------|------|
| 入站（Listeners） | 节点页面 | 用户接入方式 |
| **服务端出站** | **出站管理 + 路由 → 服务端出站** | **面板 Mihomo 进程出网方式** |
| 客户端订阅 | 路由 → 客户端订阅 | 只写进用户订阅 YAML |

出站定义只服务于服务端；客户端订阅里的节点依旧由订阅生成器负责。

## 支持的协议

与入站管理一致，外加 WireGuard：Shadowsocks、Snell、VMess、VLESS、Trojan、Hysteria2、TUIC v4/v5、ShadowQUIC、AnyTLS、Mieru、Sudoku、TrustTunnel、HTTP、SOCKS、WireGuard。

UI 会按 Mihomo 的命名下发：Shadowsocks → `ss`，SOCKS → `socks5`，TUIC v4/v5 → `tuic`（带各自凭证）。WireGuard 支持单个根 peer，也可在下方维护结构化的 peer 列表。

## 表单

页面上半部分是**基本连接**（必填项），下半部分是**可选参数**，按协议、传输、TLS、dial、多路复用、WireGuard 分组。可选参数沿用 Mihomo 的字段名（字段目录跟随内置的 Mihomo v1.19.33 选项结构）。

可选布尔是**三态**：启用 / 禁用 / Mihomo 默认。留空（清除）即恢复核心默认值，而不是写成 `false`。

## 保存与应用

1. 在「出站管理」保存出站 —— 落库到面板数据库；
2. 到 **路由 → 服务端出站** 选择一个已启用的出站作为目标，保存路由；
3. 点 **应用**（生成 → 校验 → 重载 Mihomo）。

只保存不会改变正在运行的核心。只有启用的出站会写进生成的 YAML，禁用的仍可在库里编辑。

## 重命名与引用保护

改名是原子的：服务端规则目标、策略组成员、rule-provider 的下载代理、其它出站的 `dialer-proxy` 引用会一起跟着改；匹配域名、正则 payload、客户端订阅配置不受影响。

删除和禁用会先检查引用。仍被引用时返回 409，并在错误里列出引用位置（例如 `dialer-proxy of chain2`）——先去掉这些引用再操作。

## WARP

设置里注册过的 WARP 账户会自动成为一个**启用且只读**的 `WARP` 出站。注册与重新注册仍归「设置」所有，出站列表不会暴露它的私钥或 Cloudflare 令牌，只能通过页面上的设置链接去管理账户。

只要规则、策略组、rule-provider、dialer 引用、WARP 域名或全局 WARP 仍在使用它，账户就不能删除。删除账户后需再点一次应用。

## 连接测试

每个出站都有「测试连接」按钮（桌面与移动端都有），会打开诊断面板，显示结果、耗时、端点、测试目标和各个阶段。

- 复用入站测试那套**隔离的 Mihomo 客户端**与固定的 HTTP 204 目标；
- 用**已保存**的出站配置，并带上依赖的 dialer 代理与策略组（含设置托管的 WARP）；
- **不需要**先应用配置，测试也不会重载正在服务的核心；
- 凭证与 WARP 密钥留在服务端，不会出现在测试结果里；
- 结果只代表**这台服务器到测试目标**的通路，不代表所有目的地都通；
- 刷新页面或修改出站配置会清掉已显示的结果；
- 禁用状态的出站不能测。

> **凭证错误不会"绕过"**：实测密码写错时结果为 `unavailable`，节点侧看到的是认证被拒，流量不会悄悄走直连。`dialer-proxy` 链也一样：两跳链路实测会在第一跳日志里出现 `CONNECT <第二跳地址>`，说明确实走了链，而不是只连最后一跳。

> **测试报 `client_start_failed`**：连接测试用的 Mihomo 二进制必须在面板允许的路径前缀内（`/usr/local/lib/3m-ui/`、`/usr/local/bin/`、`/usr/bin/`、`/opt/`）。把核心放在临时目录会出现这个错误，移进上述目录即恢复。

## 存储与自定义片段

出站定义存在 `panel_settings[server-routing].proxies`，`disabledOutboundNames` 是旁边的面板元数据，不新增数据表、不做 schema 迁移。生成器会写入启用的出站列表（最后一个被删掉时写空列表）。

**手写节点的自定义片段会阻止生成**：启用的自定义片段里若有非空 `proxies:`，生成配置时直接报错并指出是哪个片段，例如：

```
custom config "hand-written" defines proxies — move these entries to 出站管理 and remove the fragment's proxies before applying
```

把这些节点迁到「出站管理」，并删掉片段里的 `proxies:` 段即可。原本由面板托管的 `server-routing` 定义不受影响。

## API

所有端点都在 `/api/v1` 下，需要面板鉴权：

| 方法 | 端点 | 说明 |
| --- | --- | --- |
| GET | `/config/server-outbounds` | 列出 `{proxy, enabled, managed}`，含已配置的 WARP |
| POST | `/config/server-outbounds` | 新建 `{proxy, enabled}` |
| PUT | `/config/server-outbounds?name=已有名称` | 编辑或改名 |
| DELETE | `/config/server-outbounds?name=已有名称` | 删除没有被引用的出站 |
| POST | `/config/server-outbounds/enabled` | 原子地批量设置 `{names: [...], enabled: bool}` |
| POST | `/config/server-outbounds/connection-check?name=已有名称` | 测试已保存配置与 dialer 依赖，返回状态、耗时与诊断步骤 |
| PATCH | `/config/server-routing` | 只改路由字段，保留出站定义与禁用状态 |

查询参数里的名称需要 URL 编码。定义非法返回 400，条目不存在返回 404，存在引用冲突返回 409。路由 PATCH 接受 `rules`、`proxyGroups`、`warpDomains`、`warpGlobal`、`ruleProviders`，省略的字段保持原样；原来的整体替换 PUT 仍可用。

> 用脚本调用时注意：`proxy` 字段要**扁平**写（字段直接放在 `proxy` 对象上），不要套一层 `options`。套错不会报错，但 `dialer-proxy` 之类的字段会落进 YAML 的 `options:` 子块而被 Mihomo 忽略——两跳链会静默退化成一跳。前端与 OpenAPI 都是扁平下发。
