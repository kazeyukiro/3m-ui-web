---
title: AI 提示词安装
---

# AI 提示词安装

本页提供一段可直接交给 AI 助手的安装提示词。粘贴到 ChatGPT / Claude / Cursor 等助手，并补充所用系统版本（如 Ubuntu 22.04）、是否已有 root SSH、是否已安装过 3m-ui。

提示词正文同步维护于仓库的 `docs/ai-install-prompt.zh.txt` 与 `docs/ai-install-prompt.en.txt`，本页展示相同内容。README 与其它文档均指向本页，不再另行复制，以免多处副本出现差异。

## 一键获取

用 `curl` 取纯文本并直接写入剪贴板：

```bash
# 简体中文提示词
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | pbcopy        # macOS
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | xclip -sel clip # Linux X11
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | wl-copy       # Linux Wayland

# English prompt
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | pbcopy
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | xclip -sel clip
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | wl-copy
```

Windows（PowerShell）：

```powershell
curl.exe -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | Set-Clipboard
curl.exe -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | Set-Clipboard
```

只需查看时，去掉管道及 `pbcopy` / `xclip` / `wl-copy` / `Set-Clipboard` 即可。

## 提示词全文（简体中文）

```text
请协助在 Linux VPS 上以 root 安装 3m-ui（Mihomo 服务端 Web 管理面板）。

要求：
1. 只使用官方一键脚本，不要改写下载地址、追加不明参数或替换为第三方镜像源：
   curl -fsSL \
     https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh \
     | sudo sh
2. 安装前检查并报告：
   - CPU 架构：完整安装包（面板 + Mihomo 内核）支持 amd64 与 arm64；
     其它架构需加 --no-mihomo，并由用户自备内核
   - init 系统：systemd 或 OpenRC
   - 能否访问 github.com，
     防火墙是否放行面板端口（默认 8080）与后续节点端口
   - 是否已存在 /etc/3m-ui 或 /var/lib/3m-ui；
     若已安装 3m-ui，改用 sudo 3m-ui update，不要重新安装
3. 安装结束后：
   - 记录终端中一次性显示的 admin 初始密码（之后不再完整打印；
     遗失可执行 sudo 3m-ui reset-admin）
   - 复制安装脚本末尾输出的 Panel URL。新安装会为面板分配随机路径，
     该行形如 http://服务器IP:8080/随机串/ ，不要自行拼接根地址
   - 用 sudo 3m-ui status 确认服务正在运行，
     并提醒首次登录必须修改密码
4. 常用管理命令：
   sudo 3m-ui status | update | logs | restart | version | backup
5. 面板无法访问时，先核对 Panel URL 与端口，
   必要时执行 sudo 3m-ui reset-config --panel --yes
6. 参考文档：https://3m-ui.top/docs/ 与 https://github.com/kazeyukiro/3m-ui
若某一步失败，请按报错信息给出排查步骤，不要臆造命令，也不要改用非官方安装源。
```

## 使用注意

- 执行前让助手先打印将运行的完整命令，确认后再执行。提示词要求只使用官方脚本，助手若改写下载地址、追加参数或替换镜像源，即属偏离。
- 新安装会为面板分配随机路径（`web_path`），安装脚本末尾输出的 `Panel URL` 已包含该路径。以该行为准，直接访问根地址会得到 404。
- 面板端口默认为 8080。若服务器前面有防火墙或云安全组，需放行该端口，以及后续节点的监听端口。
- 已安装的机器不要重复执行安装脚本，使用 `sudo 3m-ui update` 升级。
- 面板无法打开时先核对 `Panel URL` 与端口；仍不可用可执行 `sudo 3m-ui reset-config --panel --yes` 重置监听与 SSL，重启后以 HTTP 访问。

## 测试 / 预发布通道（可选，非默认）

仅在明确需要预发布或测试版时，把下面这段追加到提示词末尾：

```text
若用户明确要预发布/测试版，再使用：
sudo env THREE_M_UI_CHANNEL=pre sh -c 'curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sh'
或已安装后：sudo 3m-ui update pre
默认仍应安装稳定版。



```

## 英文提示词

```text
Help install 3m-ui (a Mihomo server web panel) on a Linux VPS as root.

Requirements:
1. Use only the official one-liner. Do not rewrite the download URL,
   add unknown flags, or switch to a third-party mirror:
   curl -fsSL \
     https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh \
     | sudo sh
2. Before installing, check and report:
   - CPU architecture: the complete bundle (panel + Mihomo core) supports
     amd64 and arm64; other architectures need --no-mihomo and a core
     supplied by the user
   - init system: systemd or OpenRC
   - whether github.com is reachable, and whether the firewall opens the
     panel port (default 8080) and later node ports
   - whether /etc/3m-ui or /var/lib/3m-ui already exists; if 3m-ui is
     installed, run sudo 3m-ui update instead of reinstalling
3. After installing:
   - Save the one-time admin password printed in the terminal (it is never
     printed in full again; run sudo 3m-ui reset-admin if lost)
   - Copy the Panel URL printed at the end of the installer. A new install
     assigns a random path, so that line looks like
     http://SERVER_IP:8080/RANDOM/ ; never build the root URL yourself
   - Confirm the service with sudo 3m-ui status, and state that the
     password must be changed on first login
4. Common commands:
   sudo 3m-ui status | update | logs | restart | version | backup
5. If the panel does not load, verify the Panel URL and port first; as a
   last resort run sudo 3m-ui reset-config --panel --yes
6. Docs: https://3m-ui.top/docs/ and https://github.com/kazeyukiro/3m-ui
If a step fails, work from the error output. Do not invent commands or
switch to an unofficial install source.
```

## 安全说明

提示词只引导使用本仓库 `scripts/install.sh` 的官方一键脚本，下载内容按 `SHA256SUMS` 校验。需要校验发布来源时，可设置 `THREE_M_UI_VERIFY_COSIGN=1`，安装脚本会调用 `cosign` 验证签名，此功能要求系统已安装 `cosign`。

请勿让 AI 助手改写下载地址、追加不明参数或替换为第三方镜像源，这些做法会绕过校验。完整的安装、升级与恢复说明见[安装文档](./install)。
