---
title: Users & traffic
description: 3m-ui · Users & traffic
---

## Quick create

Users page → **Quick create**: optional username (auto if empty), generated password and UUID, optional bind-all local nodes. Credentials are shown once in a dialog.

API: `POST /api/v1/users/quick` with body `{ "username"?: string, "bind_all_listeners"?: boolean, "remark"?: string }`. Response: `{ user, password, uuid }`. Full create remains `POST /api/v1/users`. OpenAPI: `GET /api/v1/openapi.yaml`.

## Users and traffic

Create proxy users, bind listeners, set traffic quotas, expiry, and device limits. Batch enable/disable and extend quotas from the users page.

Creating or updating credentials returns after the panel DB write; injection into Mihomo is scheduled asynchronously (debounced), same pattern as listener saves.

## Limit fields

FieldMeaning

`ip_limit``0` = unlimited concurrent source IPs. When set, the panel polls Mihomo connections about every **5 seconds** and closes excess IPs (not blocked at handshake).
`sub_pull_limit``0` = unlimited. Max successful subscription downloads per **rolling 24 hours**; over limit returns **429**.

## Per-node traffic & multiplier

Each node has a **traffic multiplier** (default 1). Raw bytes on that node × multiplier are added to the user’s quota (`traffic_used`).

Users page → node-traffic action shows per-node raw and billed usage. API: `GET /api/v1/users/{id}/node-traffic`.

## 用户字段

字段
说明

用户名
唯一；删除后可重新创建同名（硬删除）

备注
展示名、订阅标题回退等

启用
关闭后订阅与认证失败

流量上限
字节；`0` 不限制

已用流量
上/下行累计

到期时间
空表示不限

IP 限制
并发源 IP 上限，`0` 不限；约每 **5 秒**根据 Mihomo 连接踢掉超额 IP（非握手硬拦）

订阅拉取次数
`0` 不限；滚动 **24 小时**内最多成功拉取 N 次，超限 429

在线
根据连接情况更新（若已启用探测）

sub_token
订阅路径中的公开令牌

## 批量操作

支持对多选用户：启用、禁用、重置流量、删除。

**清理耗尽用户**：删除已到期或超流量用户（保留仅被手动禁用的账号）。

## 流量监控

**流量监控** 页查看汇总与趋势；用户列表展示已用/上限。

到达上限或过期后，凭据判定为不可用，订阅返回错误，Telegram 可告警（见 [Telegram-Bot](telegram-bot.html)）。

## 分享

用户详情/分享弹窗提供：

- Mihomo / Clash 订阅

- V2Ray / Base64

- Sing-box

- 单节点 URI 与二维码（若已实现）

复制链接时注意使用 HTTPS 与正确公网 Host。

## 按节点流量与倍率

节点可配置 **流量倍率**（默认 1）。该节点上的**实际**流量 × 倍率后计入用户总配额。

用户管理中的「节点流量」可查看分节点实际用量与计费用量。API：`GET /api/v1/users/{id}/node-traffic`。

重置用户流量会清空其分节点明细；功能启用前的历史流量只有用户合计，无分节点拆分。

    
  

  
    **3m-ui**Lightweight self-hosted Mihomo panel

    
      #### Product

        [Features](../index.html#features)
        [Install](../index.html#install)
        [Releases](https://github.com/kazeyukiro/3m-ui/releases)
      #### Docs

        [Docs home](../docs/)
        [Quick start](../docs/quick-start.html)
        [Troubleshooting](../docs/troubleshoot.html)
      #### Community

        [GitHub](https://github.com/kazeyukiro/3m-ui)
        [Issues](https://github.com/kazeyukiro/3m-ui/issues)


---

## 补充说明（仓库文档）

# User limits: IP and subscription pulls

Panel fields on each **ProxyUser** (Users page / API).

## IP limit (`ip_limit`)

| Value | Meaning |
|-------|---------|
| `0` | Unlimited concurrent source IPs |
| `N ≥ 1` | At most **N** distinct client source IPs online at once |

**How it works:** the traffic collector polls Mihomo connections about every **5 seconds**. Connections that cannot be attributed to a user are ignored. When a user exceeds `N` source IPs, excess IPs’ connections are closed (not blocked at handshake time).

## Subscription pull limit (`sub_pull_limit`)

| Value | Meaning |
|-------|---------|
| `0` | Unlimited successful subscription fetches |
| `N ≥ 1` | At most **N** successful pulls per **rolling 24 hours** |

Exceeded → **HTTP 429** with `Retry-After` and JSON `error: subscription pull limit reached (per 24h)`.

HTML subscription pages and client downloads both count.

## Related APIs

- User CRUD: `ip_limit`, `sub_pull_limit` on create/update
- Subscription: public `/api/v1/client/sub/{token}` (and aliases)

## Related

- [Per-node traffic & multiplier](node-traffic.md)

## Quick create (one-click)

Panel **Users → Quick create** (or `POST /api/v1/users/quick`):

- Username optional (`u` + random if empty)
- Password and UUID auto-generated; returned **once** in the response / UI dialog
- Optional **bind all local nodes**

Full form create remains `POST /api/v1/users`. OpenAPI: `GET /api/v1/openapi.yaml`.

