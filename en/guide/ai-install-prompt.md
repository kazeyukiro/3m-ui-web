---
title: AI install prompt
---

# AI install prompt

This page provides a prompt you can hand to an AI assistant. Paste it into ChatGPT / Claude / Cursor, and add your OS version (for example Ubuntu 22.04), whether you already have root SSH, and whether 3m-ui is already installed.

The prompt text is maintained in `docs/ai-install-prompt.zh.txt` and `docs/ai-install-prompt.en.txt`; this page shows the same content. README and every other doc link here instead of keeping a copy, so the versions cannot drift apart.

## One-click copy

Load the plain-text prompt straight into your clipboard:

```bash
# Simplified Chinese prompt
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | pbcopy        # macOS
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | xclip -sel clip # Linux X11
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | wl-copy       # Linux Wayland

# English prompt
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | pbcopy
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | xclip -sel clip
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | wl-copy
```

Windows (PowerShell):

```powershell
curl.exe -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.zh.txt | Set-Clipboard
curl.exe -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | Set-Clipboard
```

To read the text without copying it, drop the pipe and the clipboard command.

## Prompt (English)

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

## Before running it

- Have the assistant print every command before executing it, and check the list first. The prompt requires the official script only; a rewritten URL, extra flags or a mirror is a deviation.
- A new install assigns the panel a random path (`web_path`), and the `Panel URL` printed at the end of the installer already contains it. Use that line; the bare root address returns 404.
- The panel port defaults to 8080. Open it in the host firewall or the cloud security group, together with the ports used by node listeners.
- Do not run the installer again on an existing machine. Upgrade with `sudo 3m-ui update`.
- If the panel stops loading, check the `Panel URL` and port first. As a last resort, `sudo 3m-ui reset-config --panel --yes` resets the listen address and SSL, after which the panel answers over HTTP.

## Testing / pre-release channel (optional, not default)

Only when a pre-release or test build is explicitly requested, append this to the prompt:

```text
If the user explicitly asks for a pre-release or test build, use:
sudo env THREE_M_UI_CHANNEL=pre sh -c 'curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sh'
or, once installed: sudo 3m-ui update pre
Otherwise install the stable channel.



```

## Simplified Chinese prompt

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

## Safety notes

The prompts only guide the official one-line installer from this repository's `scripts/install.sh`; downloads are verified against `SHA256SUMS`. Setting `THREE_M_UI_VERIFY_COSIGN=1` makes the installer verify the release signature with `cosign`, which must already be installed.

Do not let an AI assistant rewrite download URLs, append unknown flags, or switch to third-party mirrors, since that bypasses verification. Full install, upgrade and recovery instructions are in [Install](./install).
