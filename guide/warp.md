---
title: WARP
description: 3m-ui · Cloudflare WARP 账户与服务端出站
---

# Cloudflare WARP

可**注册并持久化** Cloudflare WARP 账户，向面板 Mihomo 注入名为 **`WARP`** 的出站，并在**服务端出站**里按域名分流。

## 设置

**设置 → 网络 → Cloudflare WARP**

1. 选择 WireGuard（服务端推荐）或 MASQUE  
2. **注册 / 保存 WARP** — 在 Cloudflare 创建设备、写入面板、生成出站 `WARP`  
3. 可查看 YAML；**删除 WARP 账户** 会从数据库**硬删除**该配置（避免 `panel_settings.key` 唯一约束冲突）

接口：

- `GET /api/v1/system/warp` — 账户状态（不含密钥）  
- `POST /api/v1/system/warp` — 注册并保存  
- `DELETE /api/v1/system/warp` — 删除账户  
- `POST /api/v1/system/templates/warp/register` — 兼容旧接口（默认也会保存，除非 `?nosave=1`）

## 服务端出站

**路由 → 服务端出站**

1. **WARP 域名**：每行一个（如 `openai.com`）或 `GEOSITE:openai`  
2. 可再编辑其它规则（默认 `MATCH,DIRECT`）  
3. **保存 → 生成并应用**（必须应用，域名才会写入 `config.yaml`）

生成结果会包含：

- `proxies` 中的 WireGuard 出站 `WARP`（含 Cloudflare 公钥、`allowed-ips`）  
- `DOMAIN-SUFFIX,<域名>,WARP` 等规则  

若配置了 WARP 域名但未注册账户，应用会失败并提示。

## 说明

不保证流媒体 / AI 解锁；域名列表由管理员自行维护。
