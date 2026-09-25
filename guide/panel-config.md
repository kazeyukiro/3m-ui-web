---
title: 面板配置
description: 3m-ui · 面板配置
---

# 面板配置

主配置文件：`/etc/3m-ui/config.yaml`  
数据目录默认：`/var/lib/3m-ui`

修改监听端口可用 `3m-ui` 菜单中的「修改面板端口」，或编辑配置后重启服务：

```bash
systemctl restart 3m-ui
```

**公网 URL（public_url）** 用于拼订阅链接、部分回调场景，在面板 **系统设置** 中填写（例如 `https://panel.example.com`）。

