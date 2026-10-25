---
title: 路由规则
---

# 路由规则

面板「路由」页有两个范围：

| 标签 | 存储 | 作用 |
|------|------|------|
| **客户端订阅** | `visual-config` | 只进入用户的 Mihomo/Clash **订阅** YAML（`proxy-groups` / `rules`） |
| **服务端出站** | `server-routing` | 写入**面板 Mihomo 进程**（用户流量进节点之后的出口，用户流量到达节点后的出口） |

## 批量导入规则

两个范围（客户端订阅 / 服务端出站）通用，点击规则编辑器右上角 **批量导入**：

1. **粘贴**：每行一条 Mihomo 规则，`#` 开头为注释行，空行忽略；
2. **解析预览**：点击「解析预览」。后端按 [mihomo 官方规则文档](https://wiki.metacubex.one/config/rules) **严格校验**，不臆造任何规则类型——
   - 合法规则**归一化**后预览（如 `GEOIP,CN` → `GEOIP,cn`、裸 IP 补 `/32`、`NETWORK,udp` → `NETWORK,UDP`）；
   - 非法行**逐行报错**（行号 + 原因），不影响其余行；
   - 批次内重复自动去重；
3. **追加**：确认后插入到编辑器**末尾 MATCH 规则之前**（避免成为死规则）；与现有规则重复的条目会被跳过并在提示中说明。

单次导入上限 **5000** 条。规则目标（`PROXY`、策略组名等）需真实存在，拼写错误会在**生成并应用**时被核心拒绝。

规则类型与参数完全以官方文档为准：37 种规则类型（含 `AND` / `OR` / `NOT` / `SUB-RULE` 逻辑规则）；`no-resolve` / `src` 参数仅接受于关于目标 IP 的规则（`IP-CIDR`、`IP-SUFFIX`、`GEOIP`、`IP-ASN`、`RULE-SET` 等）。预览接口：`POST /api/v1/config/rules/parse`（不落库）。

## 客户端订阅

- 社区模板（YiXuan / echs / AIsouler 等）会 **覆盖** 规则与策略组（不是只追加）。
- 保存后请在 **客户端更新订阅**。
- 这些规则 **不会** 合并进服务器上的 `config.yaml`。

使用 GEOSITE/GEOIP 前请在 **设置** 中更新 Geo 数据。

## 服务端出站

此页**没有**客户端社区模板。在设置中注册 WARP 后，用 **WARP 域名** 列表 + 自定义规则。默认仍是 `MATCH,DIRECT`。

## 服务端出站说明

决定流量到达本机 Listener 之后 **如何离开 VPS**。

- 默认：`MATCH,DIRECT`（与历史行为一致，全部本机直连出网）。
- 可添加 Mihomo 规则，以及可选的 `proxies` / `proxy-groups`（例如把设置里注册的 WARP 出站写进来）。
- **保存 → 生成并应用**，让核心重载。
- 接口：`GET/PUT /api/v1/config/server-routing`  
  示例 body：`{ "proxies": [], "proxyGroups": [], "rules": ["MATCH,DIRECT"], "warpDomains": [], "ruleProviders": [] }`
- 若规则列表没有 `MATCH,...`，面板会自动补上 `MATCH,DIRECT`。

服务端使用 GEOIP/GEOSITE 时同样需要本机 Geo 数据。

## 配置引擎

**生成并应用** 会重建 Listener，并应用 **服务端出站** 规则。客户端社区模板仍只影响订阅。

WARP 一键注册在 **设置**，见 [WARP](./warp.md)。


## 规则集 (rule-providers)

服务端出站可配置 Mihomo **`rule-providers`**（[官方文档](https://wiki.metacubex.one/config/rule-providers/)）。

1. **路由 → 服务端出站 → 规则集 → 添加**（`http` / `file` / `inline`，behavior / format 按官方）  
2. **保存 → 生成并应用**，将 `rule-providers:` 写入服务配置（默认 path：`./rule-providers/{name}.{format}`）  
3. 规则行：`RULE-SET,<名称>,<出站>`  
4. **热更新**：调用核心 `PUT /providers/rules/{name}`，刷新该 rule-set  

接口：`ruleProviders` 字段在 `server-routing`；`PUT /api/v1/config/rule-providers/{name}/update`；`GET /api/v1/config/rule-providers/status`
