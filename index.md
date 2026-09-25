---
layout: home

hero:
  name: 3m-ui
  text: Mihomo 服务端管理面板
  tagline: 轻量自托管：节点、用户、订阅、证书与运维，装一次长期用。
  image:
    src: /logo.png
    alt: 3m-ui
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/quick-start
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/kazeyukiro/3m-ui

features:
  - title: 节点与协议
    details: 按 Mihomo listeners 模型管理入站：VLESS / VMess / Trojan / Shadowsocks / Hysteria2 / TUIC 等；支持 Reality、TLS、一键创建与批量证书。
  - title: 用户与订阅
    details: 一键创建用户、流量与到期、节点倍率计量；导出 Mihomo YAML、URI、sing-box 等多种客户端格式。
  - title: 路由与客户端配置
    details: 可视化规则与策略组模板（含国内 GEOSITE/GEOIP 直连）；订阅侧客户端分流，服务端默认 MATCH,DIRECT。
  - title: 面板运维
    details: 安装 / 更新 / 重启、稳定与预发通道、备份恢复、面板 SSL（域名与 IP 证书）、Telegram 通知。
  - title: 多机与集群
    details: 注册远端面板、健康检查、合并远端节点到本机用户订阅。
  - title: 自托管可脚本化
    details: 单二进制或 Docker、SQLite、完整 REST API；`3m-ui` 菜单覆盖改端口、重置管理员与配置救援。
---

<div class="install-block">

### 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sudo sh
```

默认面板端口 **8080**。更新：

```bash
sudo 3m-ui update
```

</div>
