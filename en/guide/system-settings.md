---
title: System settings
description: 3m-ui · System settings
---

# System settings

Panel **System settings** groups operational options (mostly stored in the database; you usually need not edit `config.yaml`).

## System settings

Theme, subscription page options, Telegram, public URL and related panel options live under Settings (grouped sections).

## Cloudflare WARP

One-click registration builds a Mihomo outbound YAML fragment. Choose **WireGuard** or **MASQUE** before registering. YAML is copied when possible and shown in a themed dialog. MASQUE requires a Mihomo build that supports `type: masque`.

API: `POST /api/v1/system/templates/warp/register?mode=wireguard|masque|both`. This is **not** injected into Routing templates; paste YAML into the client or a manual outbound. See also the repo doc `docs/warp.md`.

## System ops (restart & update)

The **System ops** section (Settings → System ops) provides one-click panel management from the web UI — no SSH required.

### Restart panel

Click **Restart now** to gracefully restart the 3m-ui panel process. The panel calls `os.Exit(0)` and systemd's `Restart=always` brings it back automatically. The web page polls `/api/v1/health` and auto-reloads when the panel is back (typically 2-3 seconds).

Use this after config changes that require a restart, or if the panel is behaving unexpectedly.

API: `POST /api/v1/system/restart`

### Panel update

The panel automatically checks for the latest 3m-ui release on GitHub when you open the System ops page. It queries **both** the stable channel (`/releases/latest`) and the pre-release channel (`/releases/tags/pre`) simultaneously.

It shows:

- **Current version** — your installed version + channel badge (cyan "Stable" or purple "Pre-release")

- **Channel switcher** — a Segmented control to switch between **Stable** and **Pre-release** channels. Each option shows the latest version tag for that channel inline.

- **Latest version** — the latest version in the target (selected) channel

- **Update available** badge (green) or **Up to date** badge (gray)

- Collapsible release notes from the GitHub release body for the target channel

Click **Check for updates** to re-check. Click **Update now** (only enabled when an update is available) to trigger `update.sh` in the background with the selected channel — the panel downloads the release for that channel, replaces itself, and restarts automatically. The web page polls health with a 120-second timeout (updates typically take 30-60 seconds).

**Switching channels:** If you’re on Stable, selecting "Pre-release" and clicking "Update now" will download the latest pre-release build and switch your panel to the pre channel. If you’re on Pre-release, selecting "Stable" will switch back to the latest stable release. The channel is persisted in `/usr/local/lib/3m-ui/CHANNEL` by `update.sh`.

API:

```
# Check for updates (returns both stable + pre info)
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/update-info

# Update to latest stable
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"channel":"stable"}' \
  https://panel.example.com/api/v1/system/update

# Switch to pre-release channel
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"channel":"pre"}' \
  https://panel.example.com/api/v1/system/update

```

If GitHub is unreachable (firewall, GFW), the panel shows a fallback hint: *"Cannot check for updates (GitHub API unreachable). Update via SSH: 3m-ui update"*.

Pre-release URL: [https://github.com/kazeyukiro/3m-ui/releases/tag/pre](https://github.com/kazeyukiro/3m-ui/releases/tag/pre)

