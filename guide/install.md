---
title: 安装
description: 3m-ui · 安装
---

# 安装

## 环境要求

- Linux（glibc，或 musl / Alpine）
- root 权限
- 可访问外网（下载发布包）

**不必**预先安装 Go、Node 或系统 libsqlite3。官方二进制为纯 Go 静态构建。

## 一键安装（推荐）

```bash
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sudo sh
```

默认只装 **稳定版（stable）**。安装结束后记下终端里的管理员密码，浏览器访问：

`http://服务器IP:8080/`

## 更新

```bash
sudo 3m-ui update
```

预发布通道：

```bash
sudo 3m-ui update --pre
```

也可在面板 **系统设置** 中切换稳定 / 预发并执行更新（需已安装对应能力的版本）。

## 管理命令

```bash
3m-ui                # 交互菜单
3m-ui status
3m-ui restart
3m-ui reset-admin
3m-ui reset-config --panel --yes   # 救援：重置监听/SSL 等
```

## Docker

见 GitHub Release / README 中的镜像说明（`ghcr.io`）。数据目录请持久化挂载。

