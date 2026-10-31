---
title: DNS 设置
description: 3m-ui · 服务端 Mihomo 内核的 DNS 控制
---

# DNS 设置

「DNS 设置」控制的是**服务端 Mihomo 内核**自己的 DNS 行为，位于 **配置 → 通用设置 → DNS 设置**。

它只影响面板这台 Mihomo 进程，不会写进客户端订阅。

## 保存与生效

1. 改完点 **保存通用设置**（落库到面板）；
2. 再点 **生成并应用**，让内核重载。

只保存不会改变正在运行的核心——保存成功后页面的提示也会提醒你继续生成、校验并应用。

## 默认关闭（升级请注意）

**DNS 默认是关闭的**：全新安装时表单里的「启用 DNS」是关的，生成的配置为 `dns: {enable: false}`。

- 本功能上线前，生成配置里的 DNS 段来自默认模板（开启 + `fake-ip` + 内置解析服务器）；
- 上线后 DNS 由这里的设置决定，默认关闭；
- 如果此前已经在面板保存过 DNS，会按保存的值生成，不会被动改成关闭。

用到 `fake-ip`、`nameserver-policy`、`fallback`、`respect-rules` 等能力的场景（例如依赖域名分流、需要指定解析服务器的规则），请手动打开开关并按需填写。已经用 **WARP 域名分流 / 全局分流** 的不受影响——见下方「与其它配置的关系」。

首次打开表单时看到的默认值是：关闭、`fake-ip`、`0.0.0.0:1053`、`119.29.29.29` 与 `223.5.5.5`。留空的字段一律交给内核默认值。

## 字段

### 基础

| 界面字段 | YAML 键 | 取值 |
|---|---|---|
| 启用 DNS | `enable` | 开 / 关 |
| 监听地址 | `listen` | `host:port`，如 `0.0.0.0:1053`；留空用内核默认 |
| DNS 处理模式 | `enhanced-mode` | `redir-host` / `fake-ip` |
| 解析 IPv6（AAAA） | `ipv6` | 启用 / 禁用 / 内核默认 |
| 缓存算法 | `cache-algorithm` | `lru` / `arc` |
| DoH 优先使用 HTTP/3 | `prefer-h3` | 启用 / 禁用 / 内核默认 |
| 使用配置中的 hosts | `use-hosts` | 启用 / 禁用 / 内核默认 |
| 使用系统 hosts | `use-system-hosts` | 启用 / 禁用 / 内核默认 |
| DNS 遵循路由规则 | `respect-rules` | 启用 / 禁用 / 内核默认 |

### 解析服务器（每行一条）

| 界面字段 | YAML 键 | 说明 |
|---|---|---|
| 引导解析服务器 | `default-nameserver` | 用 IP 地址，用来解析 DNS 服务器自己的域名；支持加密 DNS |
| 主要解析服务器 | `nameserver` | 支持 UDP、TCP、DoT、DoH、DoQ、`system`、`DHCP`；`#proxy`/`&参数` 写在地址里 |
| 后备解析服务器 | `fallback` | 配合后备筛选使用 |
| 代理节点域名解析服务器 | `proxy-server-nameserver` | 解析代理节点的域名；开启 `respect-rules` 时必填 |
| 直连出口解析服务器 | `direct-nameserver` | 直连流量的解析服务器 |
| 直连解析遵循 nameserver-policy | `direct-nameserver-follow-policy` | 启用 / 禁用 / 内核默认 |

### 域名解析策略

| 界面字段 | YAML 键 | 说明 |
|---|---|---|
| 域名解析服务器策略 | `nameserver-policy` | 域名 / `geosite:` / `rule-set:` → 解析服务器（可多个） |
| 代理节点域名解析策略 | `proxy-server-nameserver-policy` | 需要 `proxy-server-nameserver` |

### Fake-IP

| 界面字段 | YAML 键 | 取值 |
|---|---|---|
| Fake-IP IPv4 地址段 | `fake-ip-range` | CIDR，如 `198.18.0.1/16` |
| Fake-IP IPv6 地址段 | `fake-ip-range6` | CIDR，如 `fdfe:dcba:9876::1/64` |
| Fake-IP 筛选模式 | `fake-ip-filter-mode` | `blacklist` / `whitelist` / `rule` |
| Fake-IP 筛选条目 | `fake-ip-filter` | 每行一条；`rule` 模式下写 `DOMAIN,example.com,real-ip`、`MATCH,fake-ip` 这类规则 |
| Fake-IP TTL（秒） | `fake-ip-ttl` | 留空用内核默认 |

### 后备解析筛选

| 界面字段 | YAML 键 | 取值 |
|---|---|---|
| 启用 GeoIP 筛选 | `fallback-filter.geoip` | 启用 / 禁用 / 内核默认 |
| 接受解析结果的国家代码 | `fallback-filter.geoip-code` | 如 `CN` |
| 需筛选的 IP 地址段 | `fallback-filter.ipcidr` | 每行一条 CIDR |
| 使用后备解析的域名 | `fallback-filter.domain` | 每行一条 |
| 后备解析 geosite 集合 | `fallback-filter.geosite` | Mihomo 已弃用，新配置请用 `nameserver-policy` |
| 仅在需要时查询后备服务器 | `fallback-lazy-query` | 启用 / 禁用 / 内核默认 |

## 校验规则

保存时后端会校验，不合法返回 400 并指出字段：

- `enhanced-mode` 只能是 `fake-ip` / `redir-host`；`cache-algorithm` 只能是 `lru` / `arc`；`fake-ip-filter-mode` 只能是 `blacklist` / `whitelist` / `rule`；
- `listen` 必须是 `host:port`，端口 1–65535；
- `fake-ip-range` / `fake-ip-range6` 必须是对应 IP 版本的合法 CIDR；
- 解析策略每条都要有域名 + 解析服务器（字符串或非空列表）；
- 开启 `respect-rules` 时必须填 `proxy-server-nameserver`；
- `fallback-filter.ipcidr` 每条都必须是合法 CIDR。

## 与其它配置的关系

- **覆盖自定义片段的 DNS**：已保存的面板 DNS 优先于自定义配置片段里的 `dns:`，与片段顺序无关。片段里手写的 DNS 会被静默丢弃，需要它在服务端生效就把内容填到这里。
- **WARP 会强制开启**：启用 WARP 域名分流或全局分流时，生成配置会强制开启 DNS，即使这里的开关是关的。
- **不进客户端订阅**：服务端的 DNS 设置不会写进用户订阅；订阅里的 DNS 仍由订阅侧配置决定。

## 相关

- 出站节点（服务端流量走到哪里）见 [出站管理](./outbounds.md)；
- 服务端规则与 WARP 见 [路由规则](./routing.md) 与 [WARP](./warp.md)。
