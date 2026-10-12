---
title: SSH management menu
description: 3m-ui · SSH management menu (acme.sh / language switch / command reference)
---

# SSH management menu

Run `3m-ui` on the server to open the management menu. It is the main rescue
entry point when the web panel is unreachable.

```bash
3m-ui            # interactive menu
3m-ui help       # command-line usage
```

It is a classic **numbered text menu**: type a number and press Enter. The
legacy `a` (uninstall) and `0` (exit) keys keep working.

## Menu items

| # | Action | # | Action |
|---|--------|---|--------|
| 1 | Install / Repair | 15 | Reset admin password |
| 2 | Update to latest | 16 | Reset-config (SSH rescue) |
| 3 | Update to version | 17 | Healthcheck |
| 4 | Status | 18 | BBR |
| 5 | Start | 19 | Update Geo |
| 6 | Restart | 20 | Firewall hint |
| 7 | Stop | 21 | **SSL certificate helper (acme.sh)** |
| 8 | Enable / Disable autostart | 22 | Backup |
| 9 | Logs | 23 | Update 3m-ui (incl. scripts) |
| 10 | Version | 24 | **Language** |
| 11 | Access info | `a` | Uninstall |
| 12 | Change port | `0` | Exit |
| 13 | Set public_url | | |
| 14 | Paths / subscription port | | |

## SSL certificate helper (acme.sh)

Menu **21** actually drives [acme.sh](https://github.com/acmesh-official/acme.sh)
to issue, deploy and renew certificates:

| # | Action |
|---|--------|
| 1 | Install / update acme.sh |
| 2 | Issue certificate (standalone, port 80 must be free) |
| 3 | Issue certificate (DNS API, no port 80) |
| 4 | Install certificate into 3m-ui and reload the panel |
| 5 | List certificates |
| 6 | Renew certificate |
| 7 | Print commands (run manually) |
| 0 | Back |

Certificates land in `/etc/3m-ui/certs/` (`<domain>.key` and `<domain>.crt`).

### Licensing note

acme.sh is **GPL-3.0** while 3m-ui is **EPL-2.0**; the two are incompatible.
3m-ui therefore does **not** bundle acme.sh source. The menu drives the
independently installed acme.sh on your machine (default `~/.acme.sh/acme.sh`)
and can install it for you on demand. No licence conflict, and acme.sh stays
free to upgrade on its own.

For the panel's own HTTPS, keep using the built-in ACME under
Settings → SSL. This integration is mainly for issuing certificates for nodes
or a reverse proxy.

### Install source

The first install asks where to fetch acme.sh from:

| Option | Notes |
|--------|-------|
| Official `get.acme.sh` | Default when the network is fine |
| Gitee mirror | **Recommended for mainland-China servers** — the GitHub archive frequently times out (acme.sh itself prints its Install-in-China hint) |

If acme.sh is already installed, the menu just upgrades it without asking.

### Automatic renewal

acme.sh relies on crontab to renew certificates. When `crontab` is missing the
install is refused; the menu then offers to continue with `--force` — **but the
certificates will not renew automatically**, and you must add your own cron job
running `acme.sh --cron` daily. Installing cron first is recommended:

```bash
# Debian / Ubuntu
apt install -y cron
# RHEL / CentOS
yum install -y cronie
```

## Language switch

The menu ships two **fully separate** string tables (Chinese and English)
instead of cramming "Chinese | English" into one line.

```bash
3m-ui lang           # show the current language
3m-ui lang zh        # Chinese
3m-ui lang en        # English
3m-ui lang auto      # ignore the saved value and re-detect from the locale
```

You can also pick **24. Language** in the menu, or override for one run:

```bash
THREE_M_UI_LANG=en 3m-ui
```

Precedence: **environment variable > saved setting > locale auto-detection**.
The setting lives in `/etc/3m-ui/menu.conf` and is **never written to
`config.yaml`**, which belongs to the panel binary.

## Non-interactive commands

Subcommands are unchanged and safe to use from scripts and cron:

```bash
3m-ui status | start | restart | stop | enable | disable
3m-ui logs [-f] | version | healthcheck
3m-ui backup | restore <snapshot.tar.gz>
3m-ui reset-admin
3m-ui reset-config --panel --yes     # reset listen/SSL, serve over HTTP after restart
3m-ui reset-config --all --yes       # full reset (incl. public_url)
3m-ui update [vX.Y.Z|pre] | channel stable|pre [--update]
```

## Notes

- Opening firewall ports asks for confirmation first, so a stray keypress
  cannot widen your public exposure.
- If a bad panel config makes the web UI unreachable, use **16. Reset-config
  (SSH rescue)** to fall back to HTTP.
