---
title: 系统设置
description: 3m-ui · 系统设置
---

# 系统设置

面板「系统设置」集中存放多数运维项（多在数据库中，一般不必改 `config.yaml`）。

## 设置分组

常见分组：

- 外观 / 订阅页
- 公网 URL、Telegram
- 面板 SSL（HTTP-01 / DNS-01 通配符 / IP 证 / 手动路径）
- 备份与恢复
- 更新通道（稳定 / 预发）与重启面板

保存 SSL、监听相关项后通常需要 **重启面板进程** 才完全生效。

## Cloudflare WARP

一键注册会生成 Mihomo outbound YAML 片段。注册前需选择 **WireGuard** 或 **MASQUE**；YAML 会尽可能自动复制，并在主题化弹窗中展示。MASQUE 要求 Mihomo 构建支持 `type: masque`。

API：`POST /api/v1/system/templates/warp/register?mode=wireguard|masque|both`。它**不会**注入 Routing 模板；请把 YAML 粘贴到客户端或手动添加的 outbound 中。另见 [Cloudflare WARP](./warp)。

## 系统运维（重启与更新）

**系统运维** 区（设置 → 系统运维）提供面板的网页端一键管理，无需 SSH。

### 重启面板

点击 **立即重启** 会优雅重启 3m-ui 面板进程：面板调用 `os.Exit(0)`，systemd 的 `Restart=always` 自动拉起；网页轮询 `/api/v1/health`，面板恢复后自动刷新（通常 2–3 秒）。

在修改需要重启的配置后，或面板行为异常时使用。

API：`POST /api/v1/system/restart`

### 面板更新

打开「系统运维」页时，面板会自动检查 GitHub 上的最新 3m-ui 版本，**同时**查询稳定通道（`/releases/latest`）与预发通道（`/releases/tags/pre`）。

页面显示：

- **当前版本** — 已安装版本 + 通道标记（青色「稳定」或紫色「预发」）
- **通道切换** — Segmented 控件，在 **稳定** 与 **预发** 之间切换，每个选项内联显示该通道最新版本 tag
- **最新版本** — 目标（当前选中）通道的最新版本
- **可更新**（绿色）或 **已是最新**（灰色）标记
- 目标通道 GitHub release body 的可折叠更新说明

点击 **检查更新** 可重新检查；点击 **立即更新**（仅在有更新时可用）会按所选通道在后台触发 `update.sh`，下载对应版本、替换自身并自动重启；网页轮询健康检查的超时为 120 秒（更新通常耗时 30–60 秒）。

**切换通道**：当前为稳定版时，选择「预发」并点击「立即更新」会下载最新预发构建并把面板切到 pre 通道；当前为预发版时，选择「稳定」会切回最新稳定版。通道由 `update.sh` 持久化到 `/usr/local/lib/3m-ui/CHANNEL`。

API：

```bash
# 检查更新（同时返回稳定 + 预发信息）
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/update-info

# 更新到最新稳定版
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"channel":"stable"}' \
  https://panel.example.com/api/v1/system/update

# 切换到预发通道
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"channel":"pre"}' \
  https://panel.example.com/api/v1/system/update
```

若 GitHub 不可达（防火墙、GFW），面板显示回退提示：*"Cannot check for updates (GitHub API unreachable). Update via SSH: 3m-ui update"*。

预发版地址：[https://github.com/kazeyukiro/3m-ui/releases/tag/pre](https://github.com/kazeyukiro/3m-ui/releases/tag/pre)

## 日志 API

- 核心：`GET /api/v1/mihomo/logs`
- 面板：`GET /api/v1/system/panel-logs`

面板 UI「日志」页两个 Tab 分别对应上述接口。OpenAPI：面板 `GET /api/v1/openapi.yaml`（需登录），源文件见主仓库 `backend/docs/openapi.yaml`。
