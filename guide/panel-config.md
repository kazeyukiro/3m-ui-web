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

## 配置引擎中的 TFO / MPTCP

面板 **配置** 页：

| 位置 | Mihomo 字段 | 作用 |
|------|-------------|------|
| **常规设置** | `inbound-tfo` / `inbound-mptcp` | 全局，仅**服务端** Mihomo 监听；**不会**写入客户端订阅 |
| **代理条目** | `tfo` / `mptcp` | 客户端出站字段（见 [Mihomo 文档](https://wiki.metacubex.one/config/proxies/#tfo)），布尔值；勿与 inbound-* 混淆 |

常规设置中的 **运行模式（mode）** 不在此编辑。仅对 **TCP** 有意义。接口：`GET/POST /api/v1/config/visual`。

## 同端口 TCP 与 UDP

节点（Listener）允许 **同一端口** 上同时存在 TCP 与 UDP 监听（生成配置时亦允许共存），以匹配真实协议需求。

