---
title: 故障排查
description: 3m-ui · 故障排查
---

# 故障排查

```bash
systemctl status 3m-ui
journalctl -u 3m-ui -n 100 --no-pager
```

- 确认面板端口在监听，且防火墙未拦截
- 修改密码后使用新密码；会话可能因 `session_version` 失效需重新登录
- 创建/删除节点后若提示 API 不可达，等待内核重载再刷新
- SSL 失败：检查 80/443、域名解析、以及是否误把 IP/域名模式用错
- 配错 SSL 不要重装系统：`3m-ui reset-config --panel --yes` 后重启服务

