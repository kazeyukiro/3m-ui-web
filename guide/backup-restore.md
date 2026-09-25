---
title: 备份与恢复
description: 3m-ui · 备份与恢复
---

# 备份与恢复

### 面板内

设置 → 备份 → **下载备份**（zip：数据库 + Mihomo 配置快照等）→ **恢复** 上传 zip 或原始 `.db`。

注意：

- 备份可能含密钥、Bot Token、2FA 等，请当机密文件保管
- 恢复后面板可能自动重启，请等待再登录
- 极端并发下在线备份可能不是完美一致快照，重要操作前可先停写或使用 CLI 快照

### CLI

```bash
3m-ui backup
3m-ui restore <snapshot.tar.gz>
```

