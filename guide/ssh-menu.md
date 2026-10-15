---
title: SSH 管理菜单
description: 3m-ui · SSH 管理菜单（acme.sh 证书 / 语言切换 / 命令参考）
---

# SSH 管理菜单

在服务器上直接执行 `3m-ui` 即可打开管理菜单。面板打不开时，它是最常用的救援入口。

```bash
3m-ui            # 交互式菜单
3m-ui help       # 命令行用法
```

菜单是传统的**编号文本菜单**：输入数字后回车。原有的 `a`（卸载）与 `0`（退出）继续可用。

## 菜单项

| 编号 | 功能 | 编号 | 功能 |
|------|------|------|------|
| 1 | 安装 / 修复 | 15 | 重置管理员密码 |
| 2 | 更新到最新 | 16 | SSH 救援重置面板配置 |
| 3 | 更新到指定版本 | 17 | 健康检查 |
| 4 | 运行状态 | 18 | BBR |
| 5 | 启动 | 19 | 更新 Geo |
| 6 | 重启 | 20 | 防火墙放行提示 |
| 7 | 停止 | 21 | **SSL 证书助手（acme.sh）** |
| 8 | 开机自启 开/关 | 22 | 备份 |
| 9 | 日志 | 23 | 更新 3m-ui（含管理脚本） |
| 10 | 版本 | 24 | **语言 / Language** |
| 11 | 访问信息 / URI | `a` | 卸载 |
| 12 | 修改面板端口 | `0` | 退出 |
| 13 | 设置 public_url | | |
| 14 | 路径 / 订阅端口 | | |

## SSL 证书助手（acme.sh）

菜单 **21** 可以真正调用 [acme.sh](https://github.com/acmesh-official/acme.sh) 申请、部署和续期证书：

| # | 功能 |
|---|------|
| 1 | 安装 / 更新 acme.sh |
| 2 | **申请证书**（先选验证方式，见下） |
| 3 | 安装证书到 3m-ui 并重载面板 |
| 4 | 证书列表 |
| 5 | **查看证书详情** |
| 6 | 续期指定域名 |
| 7 | 续期全部证书 |
| 8 | 吊销证书 |
| 9 | 导出 PFX（Windows / IIS） |
| 10 | 从 acme.sh 移除证书 |
| 11 | 设置默认 CA |
| 12 | 打印命令（供手动执行） |
| 13 | 返回 |

证书安装目录为 `/etc/3m-ui/certs/`（`域名.key` 与 `域名.crt`）。

### 关于许可证

acme.sh 是 **GPL-3.0**，3m-ui 是 **EPL-2.0**，两者不兼容。因此 3m-ui **不会内置 acme.sh 源码**，
而是在菜单里驱动你机器上独立安装的 acme.sh（默认 `~/.acme.sh/acme.sh`），需要时由菜单帮你安装。
这样既不产生许可证冲突，也方便 acme.sh 独立升级。

面板自身的 HTTPS 仍推荐使用面板内「系统设置 → SSL」的内置 ACME；这里的集成主要用于给节点或反向代理签发证书。

### 选择证书颁发机构（CA）

申请证书（菜单 2）时会先让你选 CA：

| 选项 | `--server` 短名 | 说明 |
|------|----------------|------|
| Let's Encrypt | `letsencrypt` | 使用最广 |
| Let's Encrypt (staging) | `letsencrypt_test` | 测试端点，不占正式签发额度 |
| ZeroSSL | `zerossl` | **acme.sh 的默认 CA** |
| SSL.com | `sslcom` | 商业 CA |
| Google Trust Services | `google` | Google 的 CA |
| Google (staging) | `googletest` | 测试端点 |
| Actalis | `actalis` | 意大利 CA |

选「返回」则沿用 acme.sh 当前的默认 CA（v3 起为 ZeroSSL）。

> Buypass 已于 2025-10-31 终止证书服务、ACME 端点不再可用，因此菜单已移除该选项；
> 仍在使用旧证书的用户请改用上表中的 CA 重新签发。

### 验证方式

菜单 2 会先让你选择验证方式，对应 acme.sh 的 `--issue` 参数：

| 方式 | 参数 | 适用 |
|------|------|------|
| standalone | `--standalone` | 80 端口空闲；若前置反代可用 `--httpport` 改监听端口 |
| DNS API | `--dns dns_cf` | 需要通配符证书，或 80 不可用时；需先导出对应服务商的 API 凭据 |
| webroot | `--webroot /var/www/html` | 已有站点目录，不占端口 |
| nginx | `--nginx` | 由 acme.sh 自动改 nginx 配置完成验证 |
| apache | `--apache` | 同上，用于 apache |
| TLS-ALPN | `--alpn` | 80 被占用但 443 可用；可用 `--tlsport` 改端口 |

DNS API 名称（如 `dns_cf`、`dns_ali`、`dns_dp`、`dns_aws`、`dns_gd`、`dns_ovh`）见
[acme.sh dnsapi 列表](https://github.com/acmesh-official/acme.sh/wiki/dnsapi)。

### IP 证书

acme.sh 支持给 IP 地址签发证书，做法就是把 IP 直接填进「域名或 IP 地址」输入框
（对应 `-d 1.2.3.4`，见 [wiki/ipcert](https://github.com/acmesh-official/acme.sh/wiki/ipcert)）。

**限制（RFC 8738）**：IP 标识符**不能用 DNS 方式验证**，只能通过 http-01 或 tls-alpn-01。
所以可用的是 standalone / webroot / nginx / apache / TLS-ALPN；当输入是 IP 而你选了
DNS API 时，菜单会直接拒绝并提示，而不是让你填完 API 凭据才在 CA 端失败。

另外并非所有 CA 都签发 IP 证书；若某个 CA 拒绝，换一个 CA 再试即可。

### 高级选项

申请时还会逐项询问以下可选项，**全部可直接回车跳过**：

| 选项 | 参数 | 说明 |
|------|------|------|
| staging 测试环境 | `--staging` | 走 CA 测试端点，不占正式额度，适合先跑通流程 |
| 密钥长度 | `-k` | `2048` / `3072` / `4096` / `8192` 或 `ec-256` / `ec-384` / `ec-521` |
| DNS 传播等待 | `--dnssleep` | 额外等待秒数（acme.sh 默认已用 DoH 自动轮询） |
| 提前续期天数 | `--days` | 默认 30 天 |
| 调试级别 | `--debug 0-3` | 排错时开启 |
| OCSP Must-Staple | `--ocsp-must-staple` | 需要服务端支持 stapling |
| 首选证书链 | `--preferred-chain` | 如 `ISRG Root X1` |
| EAB 凭据 | `--eab-kid` / `--eab-hmac-key` | 部分 CA 要求；**必须成对填写** |

取值不合法（例如 `-k 1024`、`--debug 9`、只填一半的 EAB）会当场拒绝，不会传给 acme.sh。

ECC 证书会被 acme.sh 存放在 `<域名>_ecc` 目录下；菜单在续期、部署、吊销、导出时会自动补上 `--ecc`，
无需手动区分。

### 证书管理

| 操作 | 实际命令 | 说明 |
|------|---------|------|
| 续期全部 | `--renew-all` | 可选「出错即停」（`-se`） |
| 吊销 | `--revoke` | 可选原因 0-10；**吊销不可撤销**，证书立即失效 |
| 导出 PFX | `--to-pkcs12` | 可加 `--password`，供 Windows / IIS 使用 |
| 移除 | `--remove` | 只从 acme.sh 列表移除，不吊销、不删文件 |
| 设置默认 CA | `--set-default-ca --server <CA>` | 写入配置后，后续命令无需再带 `--server` |

### 查看证书详情

菜单 5 会显示证书的主题、颁发者、有效期起止，并提示是否在 30 天内到期
（用 `openssl x509` 读取；若系统没有 openssl 会给出提示）。随后可以选择查看实际内容：

| 选项 | 说明 |
|------|------|
| 证书 PEM（含公钥） | 打印完整的证书 PEM 文本 |
| 公钥 PEM | 用 `openssl x509 -pubkey` 从证书提取公钥 |
| 私钥 PEM | 打印私钥 —— **会先警告并要你确认**（默认否） |

私钥会完整显示在屏幕上，并可能留存于终端回滚缓冲或日志中，所以默认不显示；
未确认时不会输出任何私钥内容。

私钥按 acme.sh 的真实存储布局查找：面板部署目录优先，其次是 `<域名>/`（RSA）
与 `<域名>_ecc/`（ECC，acme.sh 的默认类型）。通配符、IP 地址、IDN 等各类证书的
域名在目录名中原样保留，因此都能正确找到；输入域名时请与申请时保持一致
（大小写敏感）。

### 安装源

首次安装时会让你选择来源：

| 选项 | 说明 |
|------|------|
| 官方 `get.acme.sh` | 网络通畅时的默认选择 |
| Gitee 镜像 | **中国大陆服务器推荐**；GitHub 归档经常超时（acme.sh 自身也会提示 Install-in-China） |

已经安装过时直接执行升级，不再询问来源。

### 自动续期

acme.sh 依赖 crontab 自动续期证书。若系统没有 `crontab`，安装会被拒绝；
此时菜单会询问是否用 `--force` 继续 —— **但证书将不会自动续期**，
你需要自行添加定时任务每天执行 `acme.sh --cron`。建议先安装 cron：

```bash
# Debian / Ubuntu
apt install -y cron
# RHEL / CentOS
yum install -y cronie
```

## 语言切换

菜单支持中文与英文两套**完全独立**的文案（不再是中英混排在同一行）。

```bash
3m-ui lang           # 查看当前语言
3m-ui lang zh        # 中文
3m-ui lang en        # English
3m-ui lang auto      # 忽略已保存的设置，按系统 locale 重新检测
```

也可以选择菜单 **24. 语言 / Language**，或用环境变量临时覆盖：

```bash
THREE_M_UI_LANG=en 3m-ui
```

优先级：**环境变量 > 已保存的设置 > 系统 locale 自动检测**。
设置保存在 `/etc/3m-ui/menu.conf`，**不会写入 `config.yaml`**（后者属于面板程序）。

## 非交互命令

菜单之外的子命令行为完全不变，可安全用于脚本与 cron：

```bash
3m-ui status | start | restart | stop | enable | disable
3m-ui logs [-f] | version | healthcheck
3m-ui backup | restore <snapshot.tar.gz>
3m-ui reset-admin
3m-ui reset-config --panel --yes     # 重置 listen/SSL，重启后 HTTP 访问
3m-ui reset-config --all --yes       # 全量重置（含 public_url）
3m-ui update [vX.Y.Z|pre] | channel stable|pre [--update]
```

## 说明

- 放行防火墙端口前会二次确认，避免误扩大公网暴露面。
- 面板配置写错导致 Web 打不开时，用 **16. SSH 救援重置面板配置** 恢复为 HTTP 访问。
