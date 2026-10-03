---
title: 批量应用节点证书
---

# 批量应用节点证书

在节点列表中选中多行后，使用 **应用证书**，把同一套证书与私钥一次写入多个 Listener。

## API

`POST /api/v1/nodes/batch/certificate`（管理员 JWT）

```json
{
  "ids": [1, 2, 3],
  "certificate": "-----BEGIN CERTIFICATE-----...",
  "private_key": "-----BEGIN PRIVATE KEY-----...",
  "cert_file": "/etc/letsencrypt/live/example.com/fullchain.pem",
  "key_file": "/etc/letsencrypt/live/example.com/privkey.pem",
  "from_panel_ssl": false
}
```

三选一：

- 直接传 PEM 字符串；或  
- 同时提供证书与私钥**文件路径**（允许目录如 `/etc/letsencrypt/`、`/var/lib/3m-ui/`）；或  
- `from_panel_ssl: true`（使用面板 SSL 已配置的手动证书路径）

响应示例：`{ "updated": [1, 2], "failed": [{ "id": 3, "name": "...", "error": "..." }] }`。

会把 `certificate` / `private-key` 写入各节点配置 JSON，并安排 Mihomo 重载。不支持证书模式的协议（例如纯 Reality）会出现在 `failed` 中。

## 与面板 SSL 的关系

面板自身 HTTPS 见 [面板 SSL / ACME](./ssl-cert)。批量证书针对的是**节点入站**用的证书，二者相互独立。

应用后请 **生成 → 校验 → 应用** 配置，并让客户端刷新订阅以拿到新的 SNI / 校验证书结果。
