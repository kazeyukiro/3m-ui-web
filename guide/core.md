---
title: 内核
description: 3m-ui · 内核
---

# 内核

3m-ui 管理固定版本的 **Mihomo** 二进制。

- 在面板「内核」页或 `systemctl` / `3m-ui` 命令中启动、停止、重启
- 完整安装包 / Docker 镜像内含 pinned 内核；仅面板二进制的高级安装需自备兼容内核

内核重载期间，面板 API 可能短暂不可达，节点/用户往往已写入数据库，稍候刷新即可。

## 运行日志

面板「日志」页分为两个 Tab，对应不同 API：

| Tab | API | 内容 |
|-----|-----|------|
| **Mihomo 核心** | `GET /api/v1/mihomo/logs` | 核心进程 stdout/stderr（内存环形缓冲） |
| **面板进程** | `GET /api/v1/system/panel-logs` | 面板 `log` 输出（ACME、启动、错误等，带 `[panel]`） |

均需管理员 JWT。二者**不会**混在同一接口里。

