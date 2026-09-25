---
title: 路由规则
description: 3m-ui · 路由规则
---

# 路由规则

面板「路由」页面向 **客户端订阅 YAML** 中的规则与策略组，而不是在服务器上做复杂分流。

### 模板

- **国内直连**：`GEOSITE,private/cn` + `GEOIP,private/CN` → DIRECT，其余走策略组
- 社区模板（YiXuan / echs / AIsouler 等）：切换时会 **覆盖** 规则与策略组（不是只追加）

使用 GEOSITE/GEOIP 前请在设置中更新 Geo 数据文件。

### WARP

WARP 相关能力在系统设置中配置（YAML），用途与「订阅里的客户端规则」不同，请勿混为一谈。

