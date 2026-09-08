# 将 3m-ui.top 接到 GitHub Pages + Cloudflare

## 1. GitHub Pages

本仓库已包含根目录 `CNAME`（内容为 `3m-ui.top`）。

1. 打开仓库 **Settings → Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选 `main`，目录 `/ (root)`，Save
4. 等待 Pages 部署成功（Actions / Pages 状态变绿）

## 2. Cloudflare DNS

在 Cloudflare 添加站点 `3m-ui.top` 后，DNS 记录：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|----------|
| CNAME | `@` | `kazeyukiro.github.io` | 已代理（橙色云） |
| CNAME | `www` | `kazeyukiro.github.io` | 已代理（可选） |

说明：

- 若 Cloudflare 不允许根域 CNAME，可改用 **CNAME 扁平化**（Cloudflare 默认支持）或按提示使用 A/AAAA（GitHub Pages 官方 IP，不推荐在 CF 下长期用 IP）。
- 代理开启后流量走 Cloudflare CDN；SSL/TLS 模式建议 **Full**（GitHub Pages 提供 HTTPS）。

## 3. GitHub 自定义域名

Pages 设置里 **Custom domain** 填 `3m-ui.top`，勾选 **Enforce HTTPS**（DNS 生效后可用）。

## 4. 验证

```bash
curl -I https://3m-ui.top
```

应返回 Cloudflare / GitHub Pages 相关响应头，页面为官网首页。
