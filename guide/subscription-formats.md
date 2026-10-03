---
title: 订阅格式与 target
---

# 订阅格式与 target

公开订阅地址（路径可能带 `web_path` 或自定义订阅前缀）：

`/api/v1/client/sub/{token}`，或配置中的订阅基址 + token。

## `?target=`

| target | 响应内容 |
|--------|----------|
| *空 / clash / 默认* | Mihomo / Clash Meta YAML |
| `v2ray` / `base64` | **始终**为分享链接换行拼接后再标准 Base64（`vless://`、`vmess://`、`tuic://` 等），与 HTML 订阅页「是否加密 URI 列表」无关 |
| `uri` / `raw` | 同样链接；关闭加密时可为明文 |
| `singbox` / `sing-box` | sing-box JSON（含默认 TUN、DNS、路由等，适配较新 sing-box 迁移）及节点 outbound |

未指定 `target` 时，可能按 UA 自动在 Clash 与 v2ray 风格之间选择。

## TUIC / Hysteria2 分享链

导出 URI 会带上客户端常用参数（`sni`、`alpn`、`congestion_control`、`allow_insecure` / `allowInsecure` 等）。部分旧版 v2rayNG 能列出 `tuic://` 但无法拨号 QUIC，这类协议更建议 Clash Meta / NekoBox / Hiddify 等。
