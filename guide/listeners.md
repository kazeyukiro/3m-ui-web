---
title: 节点（Listeners）
description: 3m-ui · 节点（Listeners）
---

# 节点（Listeners）

在面板中创建入站 Listener，协议模型与 Mihomo 官方 `listeners` 对齐（VLESS、VMess、Trojan、Shadowsocks、Hysteria2、TUIC 等）。

### 一键创建

只需 **协议 + 名称**（端口等可自动生成），生成可用的默认字段；需要精细控制时用完整编辑表单。

### 证书

- 面板 SSL：域名 ACME 或 IP 短效证书、或手动 PEM
- 节点：可自签、上传，或 **一键将证书应用到多个节点**

### 流量倍率

节点可设置倍率，用户计费流量 = 实际用量 × 倍率（详见用户与流量文档）。

保存节点后配置写入数据库；内核重载可能短暂影响 API，刷新列表即可。

