---
title: API 与鉴权
description: 3m-ui · API 与鉴权
---

# API 与鉴权

## 接口与鉴权

HTTP API 前缀为 `/api/v1`。登录返回 JWT Bearer token；受保护路由要求 `Authorization: Bearer <token>`。

若设置 `must_change_password`，在改密完成前仅允许改密与少量鉴权路由。

### OpenAPI

机器可读规格：`GET /api/v1/openapi.yaml`（多数安装需要 JWT）。

### 节点与用户 —— 内核异步应用

创建、更新或删除节点在面板数据库写入后即返回。Mihomo `ApplyConfig` 在后台运行（去抖约 400ms）。会改变凭证的用户创建/更新使用同样的模式。`201`/`200` 不代表内核已完成重载；需要同步重载请使用 OpenAPI 中的节点重载 / 内核重启接口。

一键创建节点：`POST /api/v1/nodes/quick`，JSON `{"name":"...","protocol":"vless"}`（别名 `/listeners/quick`）。

### 仪表盘进程用量

`GET /api/v1/dashboard` 除主机指标外还包含每进程采样：

- `panel` — 3m-ui 进程（`pid`、`cpu_percent`、`memory_used`（RSS 字节）、`memory_percent`）

- `core` — 受管 Mihomo 进程（字段相同；内核停止时为 0）

CPU 为短时增量（间隔后首次采样可能接近 0）。完整规格：`GET /api/v1/openapi.yaml`。


## GitHub OAuth

启用后 `GET /api/v1/auth/oauth/github/start` 跳转 GitHub；回调签发与密码登录相同的 JWT（浏览器回到 `/login?oauth_token=...`）。管理员配置：`GET/PUT /api/v1/auth/oauth/github/settings`。
