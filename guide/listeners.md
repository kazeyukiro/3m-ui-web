---
title: 节点（Listeners）
description: 3m-ui · 节点（Listeners）
---

# 节点（Listeners）

在面板中创建入站 Listener，协议模型与 Mihomo 官方 `listeners` 对齐（VLESS、VMess、Trojan、Shadowsocks、Hysteria2、TUIC 等）。

## 一键创建

只需 **协议 + 名称**（面板自动分配空闲端口并填充凭证 / REALITY–TLS 默认值），生成可用的默认字段；需要精细控制时用完整编辑表单。

## 保存如何生效

创建 / 更新 / 删除先写入面板数据库并立即返回成功。Mihomo 配置应用是**后台去抖**（约 400ms），与用户凭证同步同理。UI 返回成功不代表内核已完成重载——稍等后用运行状态 / 连通性检测确认。激活失败会记日志但不会回滚面板记录，修正配置后重新加载即可。

API：`POST /api/v1/nodes`、`POST /api/v1/nodes/quick`（`/listeners` 下有别名）。OpenAPI：`GET /api/v1/openapi.yaml`。

## 证书

- 面板 SSL：域名 ACME 或 IP 短效证书、或手动 PEM
- 节点：可自签、上传，或 **一键将证书应用到多个节点**（PEM 内容、白名单内的证书文件路径，或复用面板 SSL）

批量证书 API：`POST /api/v1/nodes/batch/certificate`。

## 流量倍率

字段 `traffic_multiplier`（默认 1）：该节点原始流量 × 倍率计入用户配额。在节点表单中配置。

## 同端口 TCP/UDP

允许同一端口同时配置 TCP 与 UDP 监听；配置生成阶段同样允许共存。
