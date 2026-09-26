---
title: API 与鉴权
description: 3m-ui · API 与鉴权
---

# API 与鉴权

HTTP API 前缀：`/api/v1`。

登录接口返回 JWT，之后请求携带：

```http
Authorization: Bearer <token>
```

若账号被标记必须改密，则在改密完成前仅允许密码相关接口。

详细字段以仓库内 OpenAPI / 面板实际路由为准。


## GitHub OAuth

启用后 `GET /api/v1/auth/oauth/github/start` 跳转 GitHub；回调签发与密码登录相同的 JWT（浏览器回到 `/login?oauth_token=...`）。管理员配置：`GET/PUT /api/v1/auth/oauth/github/settings`。
