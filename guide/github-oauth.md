---
title: GitHub OAuth
---

# GitHub OAuth

3m-ui 支持用 **GitHub OAuth** 登录管理面板（可选）。密码登录与 TOTP 仍然可用。

## 配置步骤

1. 在 GitHub：**Settings → Developer settings → OAuth Apps → New OAuth App**
2. **Authorization callback URL** 设为：

   `https://<面板公网域名>/api/v1/auth/oauth/github/callback`

   实际值由面板的 `public_url` 加固定路径拼成（未配置 `public_url` 时回退到请求 host），必须与 GitHub App 中登记的完全一致。

3. 面板 **设置 → 安全与备份 → GitHub OAuth**：
   - 填入 Client ID / Client Secret
   - **允许的 GitHub 用户名**（`allowed_logins`，逗号分隔、大小写不敏感）：首次登录时用于绑定本地管理员
   - 启用并保存

4. 登录页会出现「使用 GitHub 登录」。

## 绑定规则

- 已绑定过的 `github_id`：直接登录对应用户，不受允许名单限制
- 未绑定时，GitHub 登录名必须在 `allowed_logins` 中，否则拒绝
- 名单通过且存在同名本地用户（大小写不敏感）：绑定并登录
- 无同名用户且系统仅有一个 `admin`：绑定到该管理员
- 其余情况拒绝；可创建与 GitHub 登录名相同的管理员，或先手动完成绑定

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/auth/oauth/github` | 公开：是否启用 |
| GET | `/api/v1/auth/oauth/github/start` | 跳转 GitHub 授权 |
| GET | `/api/v1/auth/oauth/github/callback` | 回调；成功跳 `/login?oauth_token=...`，失败跳 `/login?oauth_error=...` |
| GET/PUT | `/api/v1/auth/oauth/github/settings` | 管理员读写配置 |

## 注意事项

- 随时可关闭 OAuth，回退到密码登录（+ 可选 TOTP）
- 保持面板 URL 稳定：修改 host、`public_url` 或 `web_path` 后，回调会失配，需同步更新 GitHub App 设置
- 面板服务器需要能访问 `github.com` 与 `api.github.com`
