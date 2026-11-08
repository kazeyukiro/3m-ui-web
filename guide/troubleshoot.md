---
title: 故障排查
description: 3m-ui · 故障排查
---

# 故障排查

```bash
systemctl status 3m-ui
journalctl -u 3m-ui -n 100 --no-pager
```

## 常见症状

- 确认面板端口在监听，且防火墙未拦截
- 修改密码后使用新密码；会话可能因 `session_version` 失效需重新登录
- 应用 listener 时报 Mihomo 配置校验错误：修正字段后重新应用
- 创建 / 删除节点提示网络错误但列表已变化：面板先写数据库，再在后台应用 Mihomo 配置；刷新列表并等待 1–2 秒即可，属于预期行为，不是保存失败
- 磁盘满 / `/var/lib/3m-ui/backups` 过大：安装快照会累积，可在 **设置 → 备份 → 清理**（或 API `POST /system/backups/cleanup`）处理，详见 [备份与恢复](./backup-restore)
- **更新发生回滚**：更新器在停止运行中的核心前会校验候选可执行文件、版本与当前配置；切换失败会恢复原有二进制与运行状态。失败阶段与错误见 `GET /api/v1/mihomo/update`
- SSL 失败：检查 80/443、域名解析，以及是否误把 IP / 域名模式用错

## Web UI 不可达 —— SSH 救援

若因面板绑到 `127.0.0.1`、端口写错或 SSL 配置损坏而无法访问 Web UI，SSH 登录后运行 `3m-ui reset-config` 回退到安全默认值；面板会以纯 HTTP 模式重启，随后可在浏览器重新配置。

### 快速救援（最常见）

```bash
sudo 3m-ui reset-config --panel --yes
# 停止服务 → 清除 server.listen + 关闭 SSL → 以 HTTP 模式重启
```

然后打开 `http://<server-ip>:<port>/`（HTTP，不是 HTTPS），在 UI 中重新配置 SSL、`public_url` 与 access_profile。**配错 SSL 不需要重装系统。**

### 作用域参数

| 参数 | 重置内容 |
| --- | --- |
| `--panel`（默认） | `server.listen`（→ `:<port>`）+ 关闭 ACME/SSL，端口保留 |
| `--access` | 清除所有 listener 的 `public_host` / `access_sni` / `access_alpn` |
| `--public` | 清除 `server.public_url`（订阅回退到请求 host） |
| `--all` | 同时应用以上三个作用域 |
| `--yes` / `-y` | 跳过交互式 `y/N` 确认（供救援脚本使用） |

### 交互式菜单

```bash
sudo 3m-ui        # 打开菜单，选择第 16 项
```

菜单会引导选择作用域（1/2/3）并确认，然后自动停止服务、执行二进制并重启面板。

### 不会触碰的内容

- 用户、listener、流量记录与凭据
- SSL 域名 / 证书路径（只翻转 `Enabled` 开关，修复底层问题后可从 UI 重新启用）
- 服务端口（保留，SSH 救援时无需再读一遍 YAML）

### 救援后重新启用 SSL

通过 HTTP 打开面板，进入 **设置 → SSL**，修复底层问题（例如域名写错、80/443 不可达），再重新打开 SSL 开关。此前保存的域名 / 证书文件仍在数据库中，只需翻转开关。
