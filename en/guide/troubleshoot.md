---
title: Troubleshooting
description: 3m-ui · Troubleshooting
---

# Troubleshooting

```bash
systemctl status 3m-ui
journalctl -u 3m-ui -n 100 --no-pager
```

## Common symptoms

- Confirm the panel port is listening and not blocked by a firewall
- After a password change, use the new password; session tokens rotate with `session_version` and may require a new login
- Mihomo configuration validation errors appear when applying listeners — fix the fields and re-apply
- If create/delete shows a network error but the list already changed: the panel wrote the DB first and applies Mihomo in the background. Refresh the list and wait 1–2 seconds; this is expected, not a failed save
- **Disk full / large `/var/lib/3m-ui/backups`**: install snapshots accumulate. Use **Settings → Backup → Cleanup** (or API `POST /system/backups/cleanup`). See [Backup & restore](./backup-restore)
- **An update rolls back**: before stopping the running core, the updater validates the candidate executable, its version and the current configuration; a failed switch restores the prior binary and running state. The failed stage and error are available from `GET /api/v1/mihomo/update`
- SSL failures: check 80/443, DNS resolution, and whether the IP / domain mode was mixed up

## Web UI unreachable — SSH rescue

If you locked yourself out of the web UI (panel bound to `127.0.0.1`, wrong port, broken SSL config), SSH into the server and run `3m-ui reset-config` to roll back to safe defaults. The panel restarts in plain HTTP mode so you can re-apply settings from the browser.

### Quick rescue (most common)

```bash
sudo 3m-ui reset-config --panel --yes
# stop → clear server.listen + disable SSL → restart in HTTP mode
```

Then open `http://<server-ip>:<port>/` (HTTP, not HTTPS) and re-apply your SSL, `public_url` and access_profile settings from the UI. **A broken SSL setup does not require reinstalling the system.**

### Scope flags

| Flag | What it resets |
| --- | --- |
| `--panel` *(default)* | `server.listen` (→ `:<port>`) + disable ACME/SSL. Port preserved. |
| `--access` | Clear `public_host` / `access_sni` / `access_alpn` on all listeners. |
| `--public` | Clear `server.public_url` (subscription falls back to the request host). |
| `--all` | Apply all three scopes above. |
| `--yes` / `-y` | Skip the interactive `y/N` prompt (for rescue scripts). |

### Interactive menu

```bash
sudo 3m-ui        # open the menu, choose option 16
```

The menu walks you through scope selection (1/2/3) and confirmation, then stops the service, runs the binary and restarts the panel automatically.

### What it never touches

- Users, listeners, traffic records, credentials
- The SSL domain / cert paths (only the `Enabled` flag is flipped so you can re-enable from the UI after fixing the underlying issue)
- The server port (preserved so SSH rescue doesn't require re-reading the YAML)

### Re-enable SSL after rescue

Open the panel over HTTP, go to **Settings → SSL**, fix the underlying issue (e.g. wrong domain, missing 80/443 access), then toggle SSL back on. The previously-saved domain / cert files are still in the DB, so you only need to flip the switch.
