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
| 2 | 申请证书（standalone，需 80 端口空闲） |
| 3 | 申请证书（DNS API，不占 80 端口） |
| 4 | 安装证书到 3m-ui 并重载面板 |
| 5 | 证书列表 |
| 6 | 续期证书 |
| 7 | 打印命令（供手动执行） |
| 0 | 返回 |

证书安装目录为 `/etc/3m-ui/certs/`（`域名.key` 与 `域名.crt`）。

### 关于许可证

acme.sh 是 **GPL-3.0**，3m-ui 是 **EPL-2.0**，两者不兼容。因此 3m-ui **不会内置 acme.sh 源码**，
而是在菜单里驱动你机器上独立安装的 acme.sh（默认 `~/.acme.sh/acme.sh`），需要时由菜单帮你安装。
这样既不产生许可证冲突，也方便 acme.sh 独立升级。

面板自身的 HTTPS 仍推荐使用面板内「系统设置 → SSL」的内置 ACME；这里的集成主要用于给节点或反向代理签发证书。

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
