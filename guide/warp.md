---
title: WARP
description: 3m-ui · Cloudflare WARP 账户与服务端出站
---

# Cloudflare WARP

可**注册并持久化** Cloudflare WARP 账户，向面板 Mihomo 注入名为 **`WARP`** 的出站，并在**服务端出站**里按域名分流（接近 m-ui）。

## 设置

**设置 → 网络 → Cloudflare WARP**

1. 选择 WireGuard（服务端推荐）或 MASQUE  
2. **注册 / 保存 WARP** — 在 Cloudflare 创建设备、写入面板、生成出站 `WARP`  
3. 可查看 YAML；**删除 WARP 账户** 清除已存设备  

接口：`GET/POST/DELETE /api/v1/system/warp`

## 服务端出站

**路由规则 → 服务端出站**

1. **WARP 域名**：每行一个（如 `openai.com`）或 `GEOSITE:openai`  
2. 可再编辑其它规则（默认 `MATCH,DIRECT`）  
3. **保存 → 生成并应用**  

若配置了 WARP 域名但未注册账户，应用会失败。

## 说明

不保证流媒体 / AI 解锁；域名列表由管理员自行维护（对应 m-ui 的 WarpDomains）。
