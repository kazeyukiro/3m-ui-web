---
title: 面板 SSL / ACME
---

# SSL 证书

## 面板 HTTPS

在 **系统设置 → 证书 / SSL** 配置，保存后需 **重启面板** 生效。

| 模式 | 适用 | 说明 |
|------|------|------|
| **HTTP-01**（默认） | 单个域名，公网 **80** 可达 | 常规 Let's Encrypt |
| **DNS-01** | **通配符** `*.example.com`，或没有 80 端口 | 目前支持 **Cloudflare** API Token |
| **IP 证书** | 域名栏填公网 IP | 短效证书，HTTP-01 / TLS-ALPN-01 |
| **手动** | 填写 fullchain / privkey 路径 | 如 `/etc/letsencrypt/live/...` |

### 自动续签

面板进程内后台检查（约每 **6 小时**），**无需 crontab**：

| 证书类型 | 何时续签 |
|----------|----------|
| 域名 **HTTP-01** / **DNS-01** | 到期前 **15 天** 内 |
| **IP 证书** | 剩余不足 **48 小时**（短效证，约 6 天） |
| **手动 PEM** | 不自动续签，需自行轮换 |

签发引擎统一为 **acmez**。域名 HTTP-01 需公网 **80** 可达；DNS-01 需 Token 仍有效。


### 通配符 `*.example.com`

1. 域名填 `*.example.com`（或普通域名并选择 DNS-01）
2. ACME 验证选 **DNS-01**
3. DNS 服务商选 Cloudflare，填入具有 **Zone → DNS → Edit** 权限的 API Token
4. Zone 可选填 `example.com`（自动识别失败时）
5. 保存并重启面板；证书会包含 `*.example.com` 与 apex `example.com`

Token 留空再保存表示不修改已存储的 Token；接口不会回显 Token。

仓库详细说明：[panel-ssl.md](https://github.com/kazeyukiro/3m-ui/blob/main/docs/panel-ssl.md)

### 配错恢复（无需重装）

```bash
3m-ui reset-config --panel --yes
systemctl restart 3m-ui
```

或在 SSH `3m-ui` 菜单中使用重置相关选项。

## 节点证书

自签、上传路径/PEM，或批量应用到多个 Listener。也可尝试复用面板手动证书路径（`from_panel_ssl`）。

详见：[批量应用节点证书](https://github.com/kazeyukiro/3m-ui/blob/main/docs/batch-certificate.md)
