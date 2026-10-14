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

## Terminal control center (TUI)

The panel binary ships a terminal console: a multi-pane interface (header +
navigation sidebar + content pane + modal dialogs) driven entirely by the
keyboard.

```bash
3m-ui tui
```

(Equivalent to running the panel binary `/usr/local/lib/3m-ui/3m-ui-bin tui`
directly; `3m-ui` is the unified management entry point.)

The sidebar mirrors the web UI's navigation, with **14 sections**:

| Section | Contents |
|---------|----------|
| Dashboard | Version, panel state, panel API, core state, port, listen address, public URL, user/listener counts, cycle traffic, certificate count |
| Users | Username, state, used/limit traffic, upload/download, expiry, online, IP limit, subscription token, remark; actions: **enable/disable, reset traffic, rotate sub token, delete** |
| Listeners | Name, protocol, port, bind address, runtime state, TLS/UDP, traffic multiplier, public host/port; actions: **enable/disable** |
| Share | Each user's subscription token plus five link flavours: Mihomo/Clash, v2ray (Base64), sing-box, URI list, info page |
| Traffic | Live rates and connection count (from the panel), plus a per-user ranking by used traffic with upload/download/total |
| Cluster | Remote panels (base URL, last status, last check) and their mirrored nodes |
| Routing | Client routing (mode, DNS, rule and group counts) and server routing (rules, groups, rule providers, WARP) |
| Core | Core version, PID, uptime, plus **start/stop/restart core** and core logs |
| Logs | Service log (`journalctl`), panel log, core log |
| Config | Config file, panel port, listen address, public URL, subscription port/listen/path, web path, database, core binary |
| Settings | Telegram bot and chats, global access profile (public host/port/SNI), traffic reset day, subscription page settings |
| Service | Start / stop / restart / autostart (modal choice) / view logs for the panel itself |
| Certs | Reads `/etc/3m-ui/certs/`, showing expiry and days left (amber within 30 days, red once expired) |
| System | Version, git commit, build time, config file and database path |

### Where the data comes from

- **Panel database**: the console opens the same SQLite file **read-only**
  (with a busy timeout), so browsing is safe while the panel is running. A
  writable connection is opened only for the moment an action is confirmed.
- **State inside the panel process**: core PID, live rates, connection counts,
  log ring buffers and listener runtime state only exist in the panel's memory,
  so the console reads them over loopback through the panel's own API - the
  same endpoints the web UI uses, authenticated with a short-lived admin token
  minted from the panel's JWT secret (no second login).
- After a write, the console asks the panel to reload the core config. If the
  panel is stopped, only the database is updated and the footer says so.

### Keys

| Key | Action |
|-----|--------|
| `←` `→` | Switch focus between the sidebar and the content pane |
| `↑` `↓` (or `k` `j`) | Move the selection |
| `Enter` | Open a sub-page (a user's details, for example) / run the selected item |
| `0`–`9` | Jump straight to an entry |
| `r` | Refresh |
| `Esc` | Close a dialog / go back one level (sub-page, then sidebar, then quit) |
| `q` | Same as `Esc`, unwinding one level at a time |

Stopping the service, disabling or deleting a user, rotating a sub token and
starting/stopping the core ask for confirmation first, and the dialog defaults
to Cancel. Safe directions (enabling a user) run straight away.

### Requirements

The console needs a **real terminal**. When it is piped, or when `TERM=dumb`,
it exits with an error instead of writing escape sequences into your logs or
cron output. The language follows `THREE_M_UI_LANG` (`zh` / `en`) or the system
locale.

## Reducing exposure when you do not need the web panel

The panel bind address comes from `server.listen` in `/etc/3m-ui/config.yaml`:
empty, `0.0.0.0`, `::` or `*` listens on every interface, while a concrete IP
binds only that address.

If you do everything over SSH and the console, you can keep the admin side on
loopback while client subscriptions stay reachable:

```yaml
server:
  port: 8080
  listen: 127.0.0.1      # admin UI and API on loopback only
  sub_port: 8081         # >0 and different from port -> separate subscription server
  sub_listen: 0.0.0.0    # subscriptions stay open to clients
```

When you do need the web UI, reach it through an SSH tunnel:
`ssh -L 8080:127.0.0.1:8080 user@server`, then open `http://127.0.0.1:8080`.

Notes:

- Run `3m-ui restart` for the change to take effect.
- Menu 16 (`reset-config --panel`) **clears `listen`**, so the panel listens on
  every interface again — that is deliberate rescue behaviour, so re-apply the
  setting afterwards.
- Binding to loopback is not a replacement for a firewall; still restrict
  sources with your security group / firewall.
- SSH then becomes the only door, so keep key-only auth and disable password
  login.

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
