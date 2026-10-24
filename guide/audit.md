---
title: 网站审计
description: 3m-ui · 网站审计（屏蔽名单）
---

# 网站审计

**网站审计**是一份**服务端屏蔽名单**：命中其中的域名或 IP，对所有经过本节点的客户端一律拒绝访问（Mihomo `REJECT`），在建立出站连接前即被核心拦截。

与[路由规则](./routing)的分工：

| 页面 | 存储 | 作用 |
|------|------|------|
| 路由 → 服务端出站 | `server-routing` | 决定流量到达节点后**如何离开 VPS**（出口规则） |
| 网站审计 | `blocklist` | 决定哪些目标**直接拒绝**（入口前置拦截） |

两者独立存储：路由编辑器保存时不会清空屏蔽名单。

## 入口与操作

面板左侧 **网站审计** 页：

1. **添加屏蔽条目**：填写「域名 / IP」，选择匹配类型（留空自动识别），可加备注；
2. **批量导入**：每行一条，`#` 后为备注，支持前缀指定类型（见下表）；
3. **保存**：仅写入面板设置，**尚未生效**；
4. **生成并应用**：重建服务端配置并重载 Mihomo，屏蔽**立即生效**。

页面底部实时预览「将应用的 Mihomo 规则」，可先核对再保存。

## 匹配类型

| 类型 | Mihomo 规则 | 示例 | 说明 |
|------|-------------|------|------|
| 精确域名 `domain` | `DOMAIN,exact.host,REJECT` | `ads.example.com` | 仅匹配该主机名 |
| 域名后缀 `domain-suffix` | `DOMAIN-SUFFIX,zone,REJECT` | `example.com` | 匹配该域及所有子域 |
| 域名关键词 `domain-keyword` | `DOMAIN-KEYWORD,substr,REJECT` | `cdn` | 主机名包含该子串即命中 |
| Geosite 分类 `geosite` | `GEOSITE,category,REJECT` | `google` | 按 Geosite 数据分类批量屏蔽 |
| IP / 网段 `ip-cidr` | `IP-CIDR,net,REJECT` | `1.2.3.4`、`10.0.0.0/8` | 按目标 IP 匹配 |

类型留空时自动识别：IP 或 CIDR → `ip-cidr`，其余 → `domain-suffix`。

## 批量导入格式

每行一条，`#` 之后是备注；行首 `#` 为注释行。前缀可显式指定类型：

```
example.com                  # 后缀匹配（默认）
full:exact.example.com       # 精确域名
suffix:example.com           # 后缀匹配
keyword:cdn                  # 关键词匹配
geosite:google               # Geosite 分类
ip:1.2.3.4                   # IP / 网段
10.0.0.0/8                   # 裸 IP / CIDR 同样识别为 ip-cidr
```

导入内容会经过与手动添加相同的校验与归一化，重复条目（同类型同值）自动去重，保留首次出现。

## 规则与限制

- 条目上限 **5000** 条；单个值不超过 **253** 字符，且不能包含逗号或空白；
- 域名归一化：`*.example.com`、`.example.com`、`example.com` 视为同一条后缀规则；
- 裸 IP 自动补全为 `/32`（IPv6 为 `/128`）；
- 禁用的条目不生成规则；规则顺序即名单顺序。

## 生效机制

保存并**生成并应用**后，面板将屏蔽规则写入 Mihomo 服务配置：

- **规则前置**：屏蔽规则位于规则列表**最前面**，先于所有其他规则（含 WARP 控制平面 DIRECT），被屏蔽的目标不会被代理；
- **规则模式**：只要有生效条目，配置强制 `mode: rule`（全局模式片段会绕过整个屏蔽名单）；
- **嗅探**：存在域名类条目时启用 sniffer（TLS 443/8443、HTTP 80/8080-8880，`parse-pure-ip` / `force-dns-mapping` / `override-destination`），从 TLS SNI / HTTP Host 还原主机名进行匹配；
- **DNS**：有生效条目即启用 DNS（缺省 `1.1.1.1` / `8.8.8.8`，`enhanced-mode: redir-host`）。

## IP 条目的语义边界

IP 规则**不带** `no-resolve`：客户端按域名拨号时，引擎会在匹配时解析该域名并比对结果——按域名和按 IP 拨号的客户端都能被拦截（已在真机验证）。

由此带来一个边界：**按地域轮转解析的 CDN**，服务端本地解析到的 IP 只是其中一个地域节点，屏蔽该 IP 只能拦截被解析到该 IP 的客户端连接，其他地域的客户端会 miss。

> **建议**：屏蔽网站优先使用**域名类条目**（后缀 / 关键词 / Geosite），IP 条目适合自有固定 IP、机房段或确认固定的目标。

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/config/blocklist` | 读取屏蔽名单（数组） |
| PUT | `/api/v1/config/blocklist` | 整体保存，返回归一化后的名单 |

条目结构：

```json
[
  { "type": "domain-suffix", "value": "example.com", "remark": "广告", "enabled": true },
  { "type": "ip-cidr", "value": "10.0.0.0/8", "enabled": false }
]
```

`type` 可为空（自动识别）；保存时校验、归一化、去重后落库（设置键 `blocklist`），并需再执行**生成并应用**才会写入 Mihomo 配置生效。
