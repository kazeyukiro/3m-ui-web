---
title: 面板 SSL / ACME
---

# 面板 SSL / ACME

在 **系统设置 → 证书 / SSL** 配置面板 HTTPS，保存后需 **重启面板** 生效。面板自身的 HTTPS 与节点入站证书是两套独立配置，见文末。

## 面板 HTTPS

| 模式 | 适用 | 说明 |
|------|------|------|
| **HTTP-01**（默认） | 单个域名，公网 **80** 可达 | 常规 Let's Encrypt |
| **DNS-01** | **通配符** `*.example.com`，或没有 80 端口 | 目前支持 **Cloudflare** API Token |
| **IP 证书** | 域名栏填公网 IP | 短效证书，HTTP-01 / TLS-ALPN-01 |
| **手动** | 填写 fullchain / privkey 路径 | 如 `/etc/letsencrypt/live/...` |

## 自动续签

面板进程内后台检查（约每 **6 小时**），**无需 crontab**：

| 证书类型 | 何时续签 |
|----------|----------|
| 域名 **HTTP-01** / **DNS-01** | 到期前 **15 天** 内 |
| **IP 证书** | 剩余不足 **48 小时**（短效证，约 6 天） |
| **手动 PEM** | 不自动续签，需自行轮换 |

签发引擎统一为 **acmez**。域名 HTTP-01 需公网 **80** 可达；DNS-01 需 Token 仍有效。

## 通配符 `*.example.com`

1. 域名填 `*.example.com`（或普通域名并选择 DNS-01）
2. ACME 验证选 **DNS-01**
3. DNS 服务商选 Cloudflare，填入具有 **Zone → DNS → Edit** 权限的 API Token
4. Zone 可选填 `example.com`（自动识别失败时）
5. 保存并重启面板；证书会包含 `*.example.com` 与 apex `example.com`

Token 留空再保存表示不修改已存储的 Token；接口不会回显 Token。

## HTTP-01 与 DNS-01

**HTTP-01**：域名需解析到本机，公网 **80** 端口可达以完成验证。

**DNS-01**：当 80 端口不可用或需要通配符证书时使用。当前版本仅支持 **Cloudflare**。

## 证书链补全

浏览器与 iOS 会从叶证书的 **AIA** 扩展自动取回缺失的中间证书，所以面板只发送叶证书时，浏览器里看起来一切正常。但 **Node.js（Mihomo Party）、Go、Dart（FlClash）** 不会这样做，拉取订阅时会报 `unable to verify the first certificate` / `x509: certificate signed by unknown authority`。Let's Encrypt 的短效 IP 证书使用 Gen Y 层级（叶证书 + YE1/YR1 + 交叉签名根），缺任何一环都会导致校验失败。

面板在加载证书时自动补齐链路，客户端无需退回 `skip-cert-verify`：

| 顺序 | 来源 | 要求 |
|------|------|------|
| ① | 证书同目录或 `~/.acme.sh/*/` 下的 `fullchain.cer` / `.pem` / `.crt` / `fullchain` | 首张证书须与当前叶证书完全一致 |
| ② | 同目录的 `ca.cer` / `ca.pem` / `ca.crt` / `chain.pem` / `chain.cer` / `chain.crt` | 取能与叶证书衔接的那一段 |
| ③ | 叶证书 AIA 中的签发者 URL | 仅 http/https，下载后须通过签名校验 |

每一级都逐级验证签名，拼错链不会写入。已是完整链（多张证书）时原样使用；**自签证书**没有可补的签发者，也原样使用；三级都找不到时保持原样并标记 `incomplete`，不会让面板起不来。结果短时缓存，避免订阅或状态请求反复读盘、重复下载 AIA。

补链作用于三处：面板 HTTPS 的 TLS 配置、ACME 签发器从磁盘加载证书、批量应用到 Listener 的节点证书。

### 查看链路状态

`GET /api/v1/system/ssl/status`（需管理员 JWT）返回 `chain_status`：

| 字段 | 含义 |
|------|------|
| `checked` | 是否已检查 |
| `complete` / `incomplete` | 链路完整 / 仍缺中间证书 |
| `self_signed` | 自签证书（无需补链） |
| `certificates` | 实际加载的证书张数 |
| `source` | 补全来源，另以 `chain_source` 单独返回 |

状态优先反映**本次进程实际加载的链**，而不是磁盘文件的静态内容——叶证书文件本身只有一张，也能在内存中补成完整链。接口只返回机器可读字段，当前前端 UI 尚未展示，可用于排查与自动化。

### 与 `skip-cert-verify` 的关系

正式（非自签）证书补齐链路后，订阅与分享链里**不需要** `skip-cert-verify`。下列情况仍会带上：自签证书、无证书且入口为 IP、Reality 伪装证书，以及用户显式设置（显式设置始终优先）。

## 配错恢复（无需重装）

```bash
3m-ui reset-config --panel --yes
systemctl restart 3m-ui
```

或在 SSH `3m-ui` 菜单中使用重置相关选项。面板会回到 plain HTTP，以便在 UI 里修正设置。

## 节点证书

自签、上传路径/PEM，或批量应用到多个 Listener；也可复用面板手动证书路径（`from_panel_ssl`）。详见 [批量应用节点证书](./batch-certificate)，批量应用同样会补链。

## 运维建议

- 证书材料放在面板数据目录下，并纳入备份。
- 更换域名或 `web_path` 可能需要重新签发，并同步更新反向代理。
