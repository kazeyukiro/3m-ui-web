---
title: 安全
description: 3m-ui · 安全
---

# 安全

- 首次登录修改管理员密码
- 配置中使用独立的 JWT / 凭证密钥
- 尽量限制面板端口暴露面；生产环境建议 HTTPS
- 保留 SSH 与 `reset-admin` / `reset-config` 作为救援手段


## GitHub OAuth

可选：用 GitHub 登录管理面板。在 **设置 → 安全与备份 → GitHub OAuth** 中配置。

1. 创建 GitHub OAuth App，回调 URL：`https://<public_url>/api/v1/auth/oauth/github/callback`
2. 填写 Client ID / Secret，以及允许绑定的 GitHub 用户名
3. 启用后登录页出现「使用 GitHub 登录」

密码登录仍然可用。详见主仓库 `docs/github-oauth.md`。
