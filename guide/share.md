---
title: 分享
description: 3m-ui · 分享
---

# 分享

分享页以「用户」为视角：选择用户后提供两个页签 `?tab=sub`（订阅）与 `?tab=uri`（单节点 URI），选择结果会写入 `?user=<id>`，可直接用链接打开。

## 订阅页签

列出该用户的订阅链接，可复制或生成二维码：`Mihomo / Clash YAML`、`V2Ray / Base64`、`Sing-box JSON`、`Loon`、`Surge`、`Quantumult X`，以及 `?html=1` 的订阅信息页。

格式由 `?target=` 指定；不带 `target` 时按 `User-Agent` 自动选择（Clash/Mihomo → YAML，v2rayNG → Base64，sing-box → JSON，Loon/Surge/Quantumult X → 各自原生格式）。响应头包含流量与到期信息（`Subscription-Userinfo`）。

## URI 页签

展开该用户已绑定的节点，按需调用 `GET /api/v1/nodes/{id}/uri` 拉取分享 URI（第一个 URI 附二维码）；未绑定节点时提示先到用户页绑定 Listener。`GET /api/v1/users/{id}/nodes` 提供绑定列表。

## 其他操作

- **导出全部订阅链接**：`GET /api/v1/users/export-links`，把 `用户名 / 分组 / 订阅地址` 按 TSV 复制到剪贴板
- **刷新列表**、**重置订阅 Token**：`POST /api/v1/users/{id}/subscription/rotate`

分享链接与 URI 均含凭证，等同于账号密钥，请勿公开传播。
