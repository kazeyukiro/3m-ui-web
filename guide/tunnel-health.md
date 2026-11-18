---
title: 隧道健康自愈
description: 3m-ui · 隧道健康自愈
---

# 隧道健康自愈

**隧道健康自愈**用于在内网穿透进程仍在运行、但隧道实际已不可用时自动恢复连接。面板按固定间隔发起一次 HTTP 探测；当连续失败次数达到预设阈值时，重启 Mihomo 内核。该功能默认关闭，配置保存后立即生效，无需重启面板。

## 启用前须知

重启内核会断开所有已连接的客户端，并在内核重新启动期间短暂中断代理服务。因此本功能默认关闭，仅应在明确知晓每次重启影响的前提下启用。建议将失败阈值设置为足够大的数值，避免探测目标的短暂抖动触发重启。

## 配置项

在「设置 → 系统操作 → 隧道健康自愈」中配置：

| 配置项 | 说明 | 默认值 | 取值范围 |
|--------|------|--------|----------|
| 启用隧道健康监视 | 开启后按间隔探测，并在连续失败后重启内核 | 关闭 | — |
| 探测 URL | 探测目标，隧道正常时应可访问 | `https://www.cloudflare.com/cdn-cgi/trace` | 任意合法 HTTP(S) 地址 |
| 经代理探测 | 可选本地入站，探测经其出口发出 | 空 | `http` / `https` / `socks5` / `socks5h` 代理地址 |
| 间隔（秒） | 两次探测之间的间隔 | 30 | 1–86400 |
| 超时（秒） | 单次探测的超时 | 10 | 1–300 |
| 失败次数 | 触发重启所需的连续失败次数 | 3 | 1–1000 |
| 冷却（秒） | 两次重启之间的最小间隔 | 300 | 1–86400 |

超出取值范围的数值会自动回退到默认值；留空的探测 URL 同样回退到默认值。

## 探测判定

- 探测以 HTTP GET 请求发起。返回状态码低于 500 视为成功；其中 400–499 仍按隧道正常处理，因为探测路径变更不应被判定为隧道故障，500 及以上则视为失败。
- 网络错误、TLS 错误与超时均计为失败。
- 探测经可选的代理地址发出；代理仅支持上表所列四种 scheme，其他 scheme 会导致探测失败。
- 探测成功会清空连续失败计数。

## 重启行为

- 仅当内核处于运行状态时才执行探测与重启。内核被手动停止时，监视器既不探测，也不会将其拉起。
- 连续失败次数达到阈值后触发重启。重启经由内核服务的标准入口执行，并沿用内核变更忙碌保护、配置校验与生命周期串行化等既有约束。
- 重启成功后进入冷却期；冷却期内的后续失败不会再次触发重启，从而避免重启风暴。
- 连续失败计数在配置变更时重置，因此单独修改阈值不会立即引发重启。

## 运行状态与手动测试

面板在卡片中显示最近一次探测时间、最近一次重启时间、连续失败次数与累计重启次数。点击「测试探测」可执行一次探测，并显示成功与否及耗时；手动测试不会触发重启，也不要求内核正在运行，可用于在启用前验证 URL 与代理配置是否可用。

状态字段：

| 字段 | 含义 |
|------|------|
| `enabled` | 监视器是否启用 |
| `interval` | 当前探测间隔（秒） |
| `consecutive_failures` | 当前连续失败次数 |
| `total_restarts` | 累计重启次数 |
| `last_probe` | 最近一次探测时间（RFC 3339） |
| `last_restart` | 最近一次重启时间（RFC 3339） |
| `last_error` | 最近一次探测或重启的错误信息 |

## API

配置以 JSON 形式存于数据库的 `tunnel_health` 项，并通过专用端点读写；保存后立即应用于运行中的监视器。

```bash
# 读取配置
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/tunnel-health/settings

# 保存配置
curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"enabled":true,"url":"https://www.cloudflare.com/cdn-cgi/trace","proxy_url":"","interval":30,"timeout":10,"failures":3,"cooldown":300}' \
  https://panel.example.com/api/v1/tunnel-health/settings

# 读取运行状态
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/tunnel-health/status

# 手动测试探测（请求体可指定 URL、代理等参数）
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"url":"https://www.cloudflare.com/cdn-cgi/trace"}' \
  https://panel.example.com/api/v1/tunnel-health/test
```

## 相关

- [系统设置](./system-settings)
- [内核概览](./core)
