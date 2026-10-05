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

### HTTPS and public access

For panel HTTPS (Let's Encrypt domain HTTP-01 / DNS-01 / IP certs, or manual PEM), see [Panel SSL / ACME](./ssl-cert). Domain HTTP-01 needs public port **80**; DNS-01 needs a Cloudflare API token for wildcards. After saving SSL settings, **restart the panel** so ListenTLS takes effect.

Set `public_url` to the client-facing base URL (subscriptions, OAuth callbacks, links).

### Versions and channels

- **Stable** is the default for install, `3m-ui update`, and Docker `latest`.
- **Pre** (prerelease) is a separate channel; opt in explicitly and keep it until you switch back.
- Pin a version: `sudo 3m-ui update v1.x.y`.

### Custom core and advanced layout

The full package pins Mihomo in `distribution/mihomo.env`. Advanced installs that ship only the panel binary must provide a compatible core and verify themselves. Optional env: `THREE_M_UI_MIHOMO_BINARY=/absolute/path/to/mihomo`.

### Management and backup

Useful CLI (see also [Backup & restore](./backup-restore)):

```bash
sudo 3m-ui update          # update panel (+ pinned core per package rules)
sudo 3m-ui backup          # full snapshot under the data/backups directory
sudo 3m-ui reset-admin     # new admin password
sudo 3m-ui reset-config --panel --yes   # rescue broken SSL / listen bind
```

`backup` briefly pauses the service, writes a full snapshot, then restores the previous run state. Snapshots can be large; clean up from **Settings → Backup** or `POST /api/v1/system/backups/cleanup`. A snapshot includes panel binaries, bundled core, scripts, unit files, config, keys, database (+ WAL siblings), Mihomo data and certs; nested historical backups are not re-included.

## Docker

Use official images from project releases / GHCR. Tag `latest` tracks **stable**. Persist the data directory (database, `listener-certs`, config).

Example pattern:

```bash
docker compose up -d
docker compose exec 3m-ui /usr/local/bin/3m-ui reset-admin
```

### Network and versions

Publish panel and node ports as needed. Prefer stable tags; prereleases need an explicit tag/channel.

### Docker upgrade, backup, and restore

Pull a newer image, recreate the container with the **same volume**. Export panel backups before major moves. Losing the volume loses DB and certs even if you still have an image.

## Maintaining the release set

Pinned Mihomo version, asset names, and SHA-256 live in `distribution/mihomo.env`. Changing it means a new bundled core and requires reinstall/compatibility checks. Native packages and Docker builds share this manifest.

Release workflows build by tag and refuse to overwrite published versions. Rolling `pre` is a separate channel. Images publish to `ghcr.io/<owner>/<repo>`; maintainers must set package visibility for public pulls on first release.

Validation should cover both architectures, first boot, real core traffic, login/password change, node create, live proxy, update keeping data, and snapshot restore. A green compile alone does not prove a clean server install.

## Subscription path and port

Optional `server.sub_path` (e.g. `/sub`) and `server.sub_port` in `/etc/3m-ui/config.yaml`, or env `THREE_M_UI_SUB_PATH` / `THREE_M_UI_SUB_PORT`. Legacy `/api/v1/client/sub/:token` remains. Set `public_url` to the client-facing base URL.

## Independent core updates

The Core page supports manual updates and rollback of official stable and Pre Mihomo on Linux amd64/arm64. Selected versions persist in the data volume across panel upgrades. See [Core updates](./core-updates) for validation, recovery, and deployment integration.

## Frontend compression and caching

At startup the panel gzip-precompresses embedded text assets and serves compressed responses when the client accepts them. Hashed JS/CSS use `Cache-Control: public, max-age=31536000, immutable`; HTML and non-hashed assets use `no-cache` with ETags. Identity and gzip responses have separate validators and `Vary: Accept-Encoding`. No reverse-proxy compression setting or writable asset directory is required. Missing `/assets/` paths return an uncached **404** (not SPA HTML fallback).

## Frontend stack (panel UI)

Embedded UI: **React + Ant Design**, icons from **Lucide** (`lucide-react`, wrapped in `frontend/src/icons.tsx`). Building the panel runs `npm ci` / `npm install` and `npm run build` under `frontend/`.

Overview (dashboard): gray canvas, floating cards (resources, traffic, connections), ~**2s** polling, TCP/UDP split. Feature search: sidebar (desktop), mobile header, **Ctrl/Cmd+K**. Bundled Mihomo is pinned in `distribution/mihomo.env` (currently **v1.19.32**).
