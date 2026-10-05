---
title: 系统设置
description: 3m-ui · 系统设置
---

# 系统设置

面板「系统设置」集中存放多数运维项（多在数据库中，一般不必改 `config.yaml`）。

常见分组：

- 外观 / 订阅页
- 公网 URL、Telegram
- 面板 SSL（HTTP-01 / DNS-01 通配符 / IP 证 / 手动路径）
- 备份与恢复
- 更新通道（稳定 / 预发）与重启面板

保存 SSL、监听相关项后通常需要 **重启面板进程** 才完全生效。

## 日志 API

- 核心：`GET /api/v1/mihomo/logs`
- 面板：`GET /api/v1/system/panel-logs`

面板 UI「日志」页两个 Tab 分别对应上述接口。OpenAPI：面板 `GET /api/v1/openapi.yaml`（需登录），源文件见主仓库 `backend/docs/openapi.yaml`。

