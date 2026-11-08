---
title: 备份与恢复
description: 3m-ui · 备份与恢复
---

# 备份与恢复

## 面板内备份与恢复

设置 → 备份 → **下载备份** 导出 `.zip`（SQLite 数据库 + Mihomo 配置快照 + meta）。使用 **恢复** 上传 zip 或原始 `.db`。

**恢复行为**：上传成功后面板自动退出（`os.Exit(0)`），由 systemd 的 `Restart=always` 带着新数据库拉起；网页轮询 `/api/v1/health` 并自动重载，**不需要手动 SSH 重启**。

处理函数在替换数据库文件前校验 SQLite magic header（`"SQLite format 3\0"`），损坏或非数据库文件返回 HTTP **400**（不是 500）；陈旧的 `-journal` / `-wal` / `-shm` 辅助文件会自动清理，避免回滚。

注意：

- 备份可能含密钥、Bot Token、2FA 等，请当机密文件保管
- 恢复后面板会自行重启，请等待再登录
- 在线备份通过 SQLite `VACUUM INTO` 生成自包含的一致性快照，无需停写；整机恢复仍建议先做一份 CLI 快照

## 磁盘安装快照

`3m-ui update` / 安装脚本会在下列目录写入 tarball：

```
/var/lib/3m-ui/backups/

```

可能增长到数 GB。面板 **设置 → 备份** 会列出它们及总大小，可以：

- 删除单个快照
- **清理**：保留最新 *N* 份，和 / 或删除早于 *D* 天的条目

**清理语义**：同时设置 `keep` 与 `older_than_days` 时，最新的 `keep` 份**始终**保留，即使它们都早于天数阈值；按天数删除只作用于 keep 窗口之外的条目，避免所有备份都过期时被一次清空。

### API

```
# 列出磁盘上的备份
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/backups

# 清理：保留最近 3 份，同时删除 7 天前的条目
# （AND 语义 —— 最新 3 份即使超过 7 天也会保留）
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"keep":3,"older_than_days":7}' \
  https://panel.example.com/api/v1/system/backups/cleanup

# 按名称删除单个快照
curl -X DELETE -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/backups/20260920T152614Z-100903.tar.gz

# 配置变更后重启面板（无需 SSH）
curl -X POST -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/restart
```

整机恢复还应备份 `/etc/3m-ui`、`listener-certs/` 与 `mihomo/`。

## CLI

```bash
3m-ui backup
3m-ui restore <snapshot.tar.gz>
```
