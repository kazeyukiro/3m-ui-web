---
title: SSH management menu
description: 3m-ui · SSH management menu (TUI panel / acme.sh / language switch / command reference)
---

# SSH management menu

Run `3m-ui` on the server to open the management menu. It is the main rescue
entry point when the web panel is unreachable.

```bash
3m-ui            # interactive menu
3m-ui help       # command-line usage
```

It offers **two interfaces**: a full-screen TUI panel (arrow-key selection) by
default on a real terminal, plus the classic numbered text menu as a
compatibility mode. The `a` (uninstall) and `0` (exit) keys mean the same in
both — see "UI mode" below.

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
| 11 | Access info | 25 | **UI mode** |
| 12 | Change port | `a` | Uninstall |
| 13 | Set public_url | `0` | Exit |
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
| 6 | **Show certificate details** |
| 7 | Renew certificate |
| 8 | Print commands (run manually) |
| 9 | Back |

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

### Choosing a certificate authority (CA)

Issuing a certificate (menu 2 or 3) asks for the CA first:

| Option | Notes |
|--------|-------|
| Let's Encrypt | The most widely used; works without an email |
| ZeroSSL | **acme.sh v3 default** — needs an email to register an account |
| Buypass | Norwegian CA, 180-day certificates |
| SSL.com | Commercial CA |
| Google Trust Services | Google's CA |

Choosing "Back" keeps whatever CA acme.sh currently defaults to (ZeroSSL since v3).

### Showing certificate details

Menu 6 prints the subject, issuer and validity window, and warns when the
certificate expires within 30 days (it reads the file with `openssl x509`; if
openssl is missing you get told so). It then offers to show the actual material:

| Option | Notes |
|--------|-------|
| Certificate PEM | Prints the full certificate PEM |
| Public key PEM | Extracts the public key with `openssl x509 -pubkey` |
| Private key PEM | Prints the private key — **warns and asks first** (default no) |

A private key is printed in full and may linger in the terminal scrollback or in
logs, so it is never shown without confirmation.

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

## UI mode (TUI / classic)

| Mode | Notes |
|------|-------|
| **TUI** | Full-screen panel with arrow-key selection. The header line shows the installed release and the service state (running / stopped). It is safe for CJK wide characters — the highlight is a reverse-video bar rather than a bordered box, so double-width glyphs can never knock the layout out of alignment |
| **Classic** | The original numbered text menu: type a number and press Enter |

A real terminal defaults to the TUI. To switch manually:

```bash
3m-ui tui           # show the current mode and the active backend
3m-ui tui on        # force the TUI
3m-ui tui off       # force the classic menu
3m-ui tui auto      # back to auto-detection (default)
```

You can also pick **25. UI mode** in the menu, or override a single run:

```bash
THREE_M_UI_TUI=classic 3m-ui     # classic menu for this run only
```

Precedence: **environment variable > saved setting > auto-detection**. Two cases
fall back to the classic menu **unconditionally**:

- no usable terminal (pipes, cron, CI, or `ssh host "3m-ui menu"` style calls)
- a dumb terminal such as `TERM=dumb`

In other words, even with `ui=tui` saved, piped invocations never emit escape
sequences — your logs and cron output stay clean.

### Keys

| Key | Action |
|-----|--------|
| `↑` / `k` | Move up (wraps to the last entry from the first) |
| `↓` / `j` | Move down (wraps to the first entry from the last) |
| `Enter` / `Space` | Confirm the highlighted entry |
| `0`–`9` | Jump to an entry; digits accumulate, so `2` then `0` reaches entry 20 |
| `q` / `Esc` | Back / exit |

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
