---
title: 订阅
description: 3m-ui · 订阅
---

# 订阅

每个用户有一条订阅 URL，路径形如：

`/api/v1/client/sub/<token>`

常见格式：

- 默认 / Clash Meta：Mihomo 客户端 YAML
- `?target=v2ray` 或 base64：分享链接的 Base64
- `?target=singbox`：sing-box JSON
- `?target=loon` / `surge` / `quanx`：Loon / Surge / Quantumult X 的原生配置（无 subconverter 依赖，不支持的协议以注释行降级）

不带 `?target=` 时按客户端 UA 自动选择格式；完整 target 清单、UA 识别规则与三家 Apple 客户端的协议支持矩阵见[订阅格式与 target](./subscription-formats)。

请将 **面板公网 URL** 设为客户端能访问的地址，否则复制出的链接主机名可能不对。

订阅内容中的分流规则来自 **客户端配置 / 路由模板**，不是服务端强制代用户翻墙；服务端入站侧常见为 `MATCH,DIRECT` 一类落地。
