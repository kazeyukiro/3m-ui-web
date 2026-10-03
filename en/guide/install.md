---
title: Install, upgrade & recovery
---

# Install, upgrade & recovery

3m-ui offers two full install paths: **Linux one-line install** and a **pre-built Docker image**. Both ship the panel plus a pinned Mihomo core and share the same first-boot logic. Default install, update, and Docker `latest` follow **stable** releases only.

## Linux one-line install

Full packages support Linux **amd64** and **arm64**, require root, systemd or OpenRC, and network access to GitHub. No Go, Node, or system `libsqlite3` is required. The installer installs download/extract tools as needed.

```bash
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sudo sh
```

To inspect the script or pass parameters, download first:

```bash
curl -fsSLo install.sh https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh
sudo env PANEL_PORT=8080 sh install.sh --yes
```

Environment variables must be passed to the `sh` that runs the script; putting them only before `curl` on the left of a pipe does not reach the installer.

Default port is `8080`. After opening the panel and node ports, open `http://SERVER_IP:8080/`. Install prints admin `admin` and a random password once; first login must change it. If lost: `sudo 3m-ui reset-admin` (invalidates old sessions). The password is not stored in config or install result files.

Existing config is preserved on re-run (accounts, ports, secrets). Re-running updates binaries without resetting the admin. Change port with `sudo 3m-ui config port 9000`.

When migrating from an older install script, run the latest install once so snapshot/restore flows match this document; older `3m-ui update` may lack full backup guarantees described here.

### AI prompt install

See [AI install prompt](./ai-install-prompt).

## Docker

Use official images from the project releases/GHCR as documented on the release page. `latest` tracks stable. Persist the data directory (database + `listener-certs` + config).

## Upgrade

```bash
sudo 3m-ui update
# pin version: sudo 3m-ui update v1.0.6
```

Prefer stable tags. Pre-releases need an explicit channel/version choice.

## Backup & restore

Use panel backup export and `3m-ui` CLI restore flows. Always back up **database + certstore directory** together; losing certs breaks existing clients even if the DB remains.

## Uninstall

Follow the install script / package uninstall path for your OS. Export a backup before removing data directories.
