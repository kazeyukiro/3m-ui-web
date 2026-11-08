---
title: 批量应用节点证书
---

# 批量应用节点证书

在节点列表中选中多行后，使用 **应用证书**，把同一套证书与私钥一次写入多个 Listener（已启用 TLS 的节点，或 TUIC / Hysteria2 / AnyTLS 等 TLS 原生协议）。

## 工作方式

- 只更新**选中的** Listener，其他节点不变。
- 面板把 `certificate` / `private-key` 写入各节点配置 JSON，并在生成 / 校验 / 应用配置后由 Mihomo 重载。
- 应用时会按「同目录 fullchain → 同目录 ca/chain → AIA 签发者」的顺序**自动补齐证书链**，详见 [面板 SSL / ACME](./ssl-cert) 的「证书链补全」一节。
- 分享链与订阅据此解析 SNI。正式证书补链后不再需要 `skip-cert-verify`；自签、无证书（IP 入口）、Reality 或显式设置时仍会带上。
- 不支持证书模式的协议（例如纯 Reality）会出现在 `failed` 中。

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

## 要求

- 有效的证书 + 私钥 PEM，或面板可读取的文件路径。
- Listener 必须支持 TLS；纯明文协议会被跳过。

## 与面板 SSL 的关系

面板自身 HTTPS 见 [面板 SSL / ACME](./ssl-cert)。批量证书针对的是**节点入站**用的证书，二者相互独立；仅在 `from_panel_ssl: true` 时复用面板手动证书路径。

## 应用后

1. **生成 → 校验 → 应用** 配置，让内核重载。
2. 让客户端刷新订阅，以取得新的 SNI 与证书校验结果。
