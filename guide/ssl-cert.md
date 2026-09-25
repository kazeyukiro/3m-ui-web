---
title: SSL 证书
description: 3m-ui · SSL 证书
---

# SSL 证书

### 面板 HTTPS

- **域名**：Let's Encrypt（HTTP-01 / 常规 ACME 流程）
- **公网 IP**：短效 IP 证书（需 80/443 可达）
- **手动**：填写 fullchain / privkey 路径

配错可用 SSH 救援（无需重装）：

```bash
3m-ui reset-config --panel --yes
systemctl restart 3m-ui
```

### 节点证书

自签、上传，或复用已申请证书；支持批量应用到多个 Listener。

**通配符 `*.example.com`** 需要 DNS-01（certbot/acme.sh 等），面板内置 ACME 不能直接签通配符。

