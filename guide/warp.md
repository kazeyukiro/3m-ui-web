---
title: WARP
description: 3m-ui · Cloudflare WARP
---

# Cloudflare WARP

3m-ui 可 **一键注册 Cloudflare WARP**，并生成 Mihomo 出站 YAML（WireGuard 或 MASQUE）。

## 入口

**设置 → 网络（含 Geo 的那一栏）→ Cloudflare WARP**

1. 选择 **WireGuard** 或 **MASQUE**
2. 点击 **注册 WARP**
3. 查看（并可复制）YAML

接口：

- `POST /api/v1/system/templates/warp/register?mode=wireguard|masque|both`
- `POST /api/v1/system/templates/warp` — 使用自备密钥生成 YAML（高级）

## 能做什么 / 不能做什么

| 可以 | 不可以 |
|------|--------|
| 一键注册 + YAML 片段 | 自动保证 Netflix / ChatGPT 等解锁 |
| 用于 **客户端** 或 **服务端出站** | 无确认地自动改写全局出口 |
| 面板需能访问 Cloudflare | 自动检测流媒体/AI 并静默搭好 WARP 路由 |

## 接到服务端出站

1. 注册 WARP，复制 `proxies:` 条目（名称常为 `WARP` / `WARP-Masque`）。
2. 打开 **路由规则 → 服务端出站**。
3. 加入该出站，并写规则，例如：

```text
DOMAIN-SUFFIX,openai.com,WARP
DOMAIN-SUFFIX,chatgpt.com,WARP
MATCH,DIRECT
```

4. **保存 → 生成并应用**。

流媒体/AI 是否可用取决于 WARP 出口质量，**不保证**。详见主仓库 [warp.md](https://github.com/kazeyukiro/3m-ui/blob/main/docs/warp.md)。
