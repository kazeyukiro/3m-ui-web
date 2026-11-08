---
title: AI install prompt
---

# AI install prompt

Copy the prompt below into ChatGPT / Claude / Cursor (or another AI assistant), and tell it your OS (e.g. Ubuntu 22.04) and whether you already have root SSH. The assistant should only help run the official script — never rewrite download URLs or invent commands from unknown sources.

The prompt text is also maintained in `docs/ai-install-prompt.zh.txt` / `docs/ai-install-prompt.en.txt`; this page shows the same content. README and every other doc link here instead of duplicating it, so the copies cannot drift apart.

## One-click prompt copy (recommended)

There is no need to copy the long blocks below by hand. Load the plain-text prompt straight into your clipboard with `curl`, then paste it into the AI assistant:

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

To just view the text without copying it, drop the pipe and `pbcopy` / `xclip` / `wl-copy` / `Set-Clipboard`.

## Simplified Chinese prompt

```text
请协助在 Linux VPS（需 root）上安装 3m-ui（Mihomo 服务端 Web 管理面板）。

要求：
1. 只使用官方一键脚本，不要改写下载地址、追加不明参数或替换为第三方镜像源：
   curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sudo sh
2. 安装前检查：CPU 架构（完整安装包需 amd64 或 arm64）、init 系统（systemd 或 OpenRC）、能否访问 github.com、防火墙能否放行面板端口（默认 8080）及后续节点端口。
3. 安装结束后：
   - 记录终端里一次性显示的 admin 初始密码（不会再次完整打印；遗失可执行 sudo 3m-ui reset-admin）
   - 用 systemctl status 3m-ui（或等价命令）确认服务正在运行
   - 说明如何访问 http://服务器IP:8080/ ，并提醒首次登录必须修改密码
4. 常用管理命令：sudo 3m-ui status | update | logs | restart | backup
5. 参考文档：https://3m-ui.top/docs/ 与 https://github.com/kazeyukiro/3m-ui
6. 不要重置已有的 /etc/3m-ui 与 /var/lib/3m-ui；升级优先使用 sudo 3m-ui update。
若某一步失败，请根据报错信息给出排查步骤，不要臆造或改用非官方安装源。
```

## English prompt

```text
Help install 3m-ui (Mihomo server Web panel) on a Linux VPS as root.

Requirements:
1. Use only the official one-liner — do not change the URL, add unknown flags, or swap in third-party mirrors:
   curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sudo sh
2. Before install: confirm CPU arch (full bundle needs amd64 or arm64), init system (systemd or OpenRC), GitHub reachability, and that the firewall can open the panel port (default 8080) plus later node ports.
3. After install:
   - Save the one-time admin password printed in the terminal (it is not shown again; run `sudo 3m-ui reset-admin` if lost)
   - Confirm the service with `systemctl status 3m-ui` (or equivalent)
   - Explain how to reach http://SERVER_IP:8080/ and that the password must be changed on first login
4. Common ops: `sudo 3m-ui status | update | logs | restart | backup`
5. Docs: https://3m-ui.top/docs/ and https://github.com/kazeyukiro/3m-ui
6. Do not wipe existing /etc/3m-ui or /var/lib/3m-ui; prefer `sudo 3m-ui update` for upgrades.
If a step fails, troubleshoot from the error output; do not invent or switch to unofficial install sources.
```

## Testing / pre-release channel (optional, not default)

Only when a pre-release or test build is explicitly requested, append this to the prompt above:

```text
若用户明确要预发布/测试版，再使用：
sudo env THREE_M_UI_CHANNEL=pre sh -c 'curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sh'
或已安装后：sudo 3m-ui update pre
默认仍应安装稳定版。
```

## Safety notes

The prompts only guide the official one-line installer from this repository's `scripts/install.sh`; every download is verified against `SHA256SUMS`. Do not let an AI assistant rewrite download URLs, append unknown flags, or switch to third-party mirrors — that bypasses verification. For full install, upgrade and recovery instructions see [Install](./install).
