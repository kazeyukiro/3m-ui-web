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
| 2 | **Issue a certificate** (pick a validation method first, see below) |
| 3 | Install certificate into 3m-ui and reload the panel |
| 4 | List certificates |
| 5 | **Show certificate details** |
| 6 | Renew one domain |
| 7 | Renew all certificates |
| 8 | Revoke a certificate |
| 9 | Export PFX (Windows / IIS) |
| 10 | Remove a cert from acme.sh |
| 11 | Set the default CA |
| 12 | Print commands (run manually) |
| 13 | Back |

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

Issuing a certificate (menu 2) asks for the CA first:

| Option | `--server` short name | Notes |
|--------|----------------------|-------|
| Let's Encrypt | `letsencrypt` | The most widely used |
| Let's Encrypt (staging) | `letsencrypt_test` | Test endpoint, does not count against rate limits |
| ZeroSSL | `zerossl` | **acme.sh default** |
| SSL.com | `sslcom` | Commercial CA |
| Google Trust Services | `google` | Google's CA |
| Google (staging) | `googletest` | Test endpoint |
| Actalis | `actalis` | Italian CA |

Choosing "Back" keeps whatever CA acme.sh currently defaults to (ZeroSSL since v3).

> Buypass terminated its certificate service on 2025-10-31 and its ACME endpoint
> no longer works, so the option has been removed from the menu. If you still
> have a Buypass certificate, reissue it from one of the CAs above.

### Validation methods

Menu 2 asks how the challenge should be solved, matching acme.sh's `--issue` flags:

| Method | Flag | When to use |
|--------|------|-------------|
| standalone | `--standalone` | Port 80 is free; `--httpport` changes the port behind a reverse proxy |
| DNS API | `--dns dns_cf` | Wildcard certificates, or when port 80 is unavailable; export the provider's API credentials first |
| webroot | `--webroot /var/www/html` | An existing site directory; no port needed |
| nginx | `--nginx` | Lets acme.sh edit the nginx config to solve the challenge |
| apache | `--apache` | Same, for apache |
| TLS-ALPN | `--alpn` | Port 80 busy but 443 free; `--tlsport` changes the port |

DNS API names (`dns_cf`, `dns_ali`, `dns_dp`, `dns_aws`, `dns_gd`, `dns_ovh`, ...) are
listed in the [acme.sh dnsapi wiki](https://github.com/acmesh-official/acme.sh/wiki/dnsapi).

### IP certificates

acme.sh can issue a certificate for an IP address — just type the address into
the "Domain or IP address" prompt (it becomes `-d 1.2.3.4`, see
[wiki/ipcert](https://github.com/acmesh-official/acme.sh/wiki/ipcert)).

**Restriction (RFC 8738)**: an IP identifier **cannot be validated over DNS**,
only via http-01 or tls-alpn-01. So standalone / webroot / nginx / apache /
TLS-ALPN are available; if you enter an IP and then pick DNS API, the menu
refuses right away instead of collecting API credentials and failing at the CA.

Not every CA issues IP certificates either — if one refuses, try another.

### Advanced options

While issuing, the menu asks for these optional extras — **press Enter to skip any of them**:

| Option | Flag | Notes |
|--------|------|-------|
| Staging server | `--staging` | Uses the CA's test endpoint; does not count against rate limits |
| Key length | `-k` | `2048` / `3072` / `4096` / `8192`, or `ec-256` / `ec-384` / `ec-521` |
| DNS propagation wait | `--dnssleep` | Extra seconds to wait (acme.sh already polls via DoH by default) |
| Renew-before days | `--days` | Default 30 |
| Debug level | `--debug 0-3` | Turn on when troubleshooting |
| OCSP Must-Staple | `--ocsp-must-staple` | Requires server-side stapling support |
| Preferred chain | `--preferred-chain` | e.g. `ISRG Root X1` |
| EAB credentials | `--eab-kid` / `--eab-hmac-key` | Required by some CAs; **both must be given** |

Invalid values (`-k 1024`, `--debug 9`, a half-filled EAB pair) are rejected on the
spot instead of being handed to acme.sh.

acme.sh stores ECC certificates under `<domain>_ecc`. The menu adds `--ecc`
automatically when renewing, deploying, revoking or exporting, so you never have
to tell them apart.

### Certificate management

| Action | Actual command | Notes |
|--------|----------------|-------|
| Renew all | `--renew-all` | Optionally stop on first error (`-se`) |
| Revoke | `--revoke` | Optional reason 0-10; **revocation is irreversible** and takes effect immediately |
| Export PFX | `--to-pkcs12` | Optional `--password`; for Windows / IIS |
| Remove | `--remove` | Only drops it from acme.sh's list — no revocation, no file deletion |
| Set default CA | `--set-default-ca --server <CA>` | Saved in config, so later commands need no `--server` |

### Showing certificate details

Menu 5 prints the subject, issuer and validity window, and warns when the
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
