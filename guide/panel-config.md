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

## 面板随机路径（web_path）隐藏入口

为降低面板被公网扫描探测的概率，首次安装时面板会**自动生成一个随机 URL 路径前缀**（例如 `/0ae9800469b5635b911a5b94ac616e22`）并写入 `/etc/3m-ui/config.yaml` 的 `server.web_path`。

- 面板 UI 与 API 只在该随机路径下可访问：例如 `https://panel.example.com/<随机>/`
- 裸域名（`https://panel.example.com/`）一律返回 **404**，不会暴露面板入口
- 客户端订阅 `/api/v1/client/...`、健康检查 `/api/v1/health`、`/healthz` 等公开端点仍可在裸域名下访问（它们是设计上公开的）

**查看 / 修改路径**：编辑配置后重启服务。

```bash
# 查看当前随机路径
grep web_path /etc/3m-ui/config.yaml

# 改为自定义路径（例如 /secret），或设为 "" 从域名根路径提供服务
# server:
#   web_path: "/secret"
systemctl restart 3m-ui
```

环境变量 `THREE_M_UI_WEB_PATH`（或短名 `WEB_PATH`）可覆盖配置文件中的值；设为空字符串即从根路径提供服务。

> 注意：nginx 反代时，请反代到面板监听地址（如 `http://127.0.0.1:8080`），面板会自行处理随机路径前缀，无需在 nginx 中写死该路径。

## 配置引擎中的 TFO / MPTCP

面板 **配置** 页：

| 位置 | Mihomo 字段 | 作用 |
|------|-------------|------|
| **常规设置** | `inbound-tfo` / `inbound-mptcp` | 全局，仅**服务端** Mihomo 监听；**不会**写入客户端订阅 |
| **代理条目** | `tfo` / `mptcp` | 客户端出站字段（见 [Mihomo 文档](https://wiki.metacubex.one/config/proxies/#tfo)），布尔值；勿与 inbound-* 混淆 |

常规设置中的 **运行模式（mode）** 不在此编辑。仅对 **TCP** 有意义。接口：`GET/POST /api/v1/config/visual`。

## 同端口 TCP 与 UDP

节点（Listener）允许 **同一端口** 上同时存在 TCP 与 UDP 监听（生成配置时亦允许共存），以匹配真实协议需求。

