---
title: 订阅
description: 3m-ui · 订阅
---

# 订阅

每个用户有一条订阅 URL，路径形如：

`/api/v1/client/sub/<token>`

常见格式：

- 默认 / Clash Meta：Mihomo 客户端 YAML
- `?target=v2ray` 或 base64：分享链接的 Base64
- `?target=singbox`：sing-box JSON
- `?target=loon` / `surge` / `quanx`：Loon / Surge / Quantumult X 的原生配置（无 subconverter 依赖，不支持的协议以注释行降级）

不带 `?target=` 时按客户端 UA 自动选择格式；完整 target 清单、UA 识别规则与三家 Apple 客户端的协议支持矩阵见[订阅格式与 target](./subscription-formats)。

请将 **面板公网 URL** 设为客户端能访问的地址，否则复制出的链接主机名可能不对。

订阅内容中的分流规则来自 **客户端配置 / 路由模板**，不是服务端强制代用户翻墙；服务端入站侧常见为 `MATCH,DIRECT` 一类落地。

## 订阅信息页

在订阅 URL 后加 `?html=1` 打开**订阅信息页**：

`https://<面板域名>/api/v1/client/sub/<token>?html=1`

浏览器直接打开订阅链接时，会按客户端 UA 收到配置文件（YAML / Base64）而不是网页；需要信息页时请带 `?html=1`（`?target=html` 等效）。程序化获取订阅元信息可用 `?format=info`（返回 JSON）。

信息页为**移动优先**的单页设计，禁用 JavaScript 也可完整阅读；启用 JS 后具备完整交互（语言切换、复制 toast、公告展开、进度条动画）：

| 区域 | 内容 |
|------|------|
| 头部 | 页面标题、用户名、中文 / English 切换 |
| 公告区块 | 面板维护的公告列表，置顶公告默认展开 |
| 导入卡 | 订阅二维码，扫码导入（Mihomo / Clash / sing-box / Shadowrocket 等） |
| 一键导入 | **One-tap import Clash / Mihomo**，点击直接拉起客户端添加订阅 |
| 快捷行 | **Sing-box** deep-link 导入、**Copy link** 复制订阅链接 |
| 账号摘要 | 流量进度条、剩余流量、到期时间、上传 / 下载、IP 限制、剩余天数 |
| 节点列表 | 协议彩色徽章、节点名称、协议 · 安全特性（如 `gRPC · TLS`）、单节点复制、展开原始 URI、全部复制 |

页面 CSP 按响应为内联脚本注入 sha256 哈希，**不放开** `unsafe-inline`，单文件模板（含自定义主题）的脚本因此可正常执行。

### 一键导入（deep-link）

| 按钮 | 链接形式 | 适用客户端 |
|------|----------|------------|
| One-tap import Clash / Mihomo | `clash://install-config?url=<订阅 URL 编码>` | Clash Meta、FlClash、Stash 等 |
| Sing-box | `sing-box://import-remote?url=<订阅 URL 编码>` | sing-box 官方客户端 |

deep-link 内的订阅 URL 分别带 `?target=clash` / `?target=singbox`，客户端拉取到的即其原生格式。链接同时以 `<a href>` 直出，JS 不可用时点击依然有效（仅缺少引导 toast）。

### 公告区块

在 **设置 → 订阅页 → 公告区块** 维护，每行一条，格式：

```
[*]日期|标题|详情
```

- 行首 `*`：置顶，默认展开详情；
- 日期可省略，写 `|标题|详情` 即可；
- `#` 开头的行是注释，不显示；
- 最多 **20** 条；标题、详情超长时自动按字截断。

旧的「订阅公告」（单条）仍作为公告区块兜底显示：公告区块为空且旧公告非空时，展示该条并置顶。建议迁移到公告区块后清空旧字段。

### 订阅页设置

**设置 → 订阅页** 下与信息页相关的项：

| 设置 | 说明 |
|------|------|
| 页面标题 | 信息页头部显示的标题 |
| 支持链接 | 账号摘要中的技术支持链接（如 Telegram 客服） |
| 订阅公告 | 单条公告，公告区块的兜底 |
| 公告区块 | 多公告编辑，格式见上 |
| 订阅页模板 | 自定义 HTML 模板目录（`index.html` 或 `sub.html`），留空用内置页面 |

### 自定义模板

内置模板的 ViewModel **只增不减**：既有字段全部保留，新页面新增字段（节点名称 / 协议 meta、公告列表、deep-link、剩余天数等）均为增量，旧自定义模板无需改动即可继续渲染。
