---
title: Install, upgrade & recovery
---

# Install, upgrade & recovery

3m-ui offers two full install paths: the **Linux one-line install** and a **pre-built Docker image**. Both ship the panel plus a pinned Mihomo core and share the same first-boot logic. Default install, update, and Docker `latest` follow **stable** releases only.

## Linux one-line install

Full packages support Linux **amd64** and **arm64**, require root, systemd or OpenRC, and network access to GitHub. No Go, Node, or system `libsqlite3` is required. The installer installs download/extract tools as needed.

```bash
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sudo sh
```

To inspect the script or pass parameters, download it locally first:

```bash
curl -fsSLo install.sh https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh
sudo env PANEL_PORT=8080 sh install.sh --yes
```

Environment variables must be passed to the `sh` that runs the script; putting them only before `curl` on the left of a pipe does not reach the installer.

The default port is `8080`. After opening the panel and the ports your nodes actually use, visit `http://SERVER_IP:8080/`. Install prints the `admin` account and a random password once; the first login must change it. If lost, `sudo 3m-ui reset-admin` generates a new password and invalidates old sessions. The password is never written to config files or install result files.

Existing config is preserved on re-run, including accounts, passwords, ports and secrets. Re-running updates program files without resetting the admin. Change an installed panel's port with `sudo 3m-ui config port 9000`.

When migrating from an older install script, run the latest install once so the snapshot/restore flows match this document; older `3m-ui update` builds may lack the full backup guarantees described here.

### AI prompt install

Paste the prompt into ChatGPT / Claude / Cursor and tell the assistant your OS (e.g. Ubuntu 22.04) and whether you have root SSH. It should only help run the official script, never rewrite it into commands from unknown sources. See the [AI install prompt](./ai-install-prompt) page for the full prompts and usage notes.

Instead of copying a long block by hand, load the plain-text prompt straight into your clipboard with `curl`:

```bash
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | pbcopy        # macOS
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | xclip -sel clip # Linux X11
curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/docs/ai-install-prompt.en.txt | wl-copy       # Linux Wayland
```

The prompt only guides the official one-liner above; every download is verified against `SHA256SUMS`.

Testing / pre-release channel (optional, not the default):

```text
Add to the base requirements: only if the user explicitly asks for a pre-release/test build, use:
sudo env THREE_M_UI_CHANNEL=pre sh -c 'curl -fsSL https://raw.githubusercontent.com/kazeyukiro/3m-ui/main/scripts/install.sh | sh'
or, once installed: sudo 3m-ui update pre
The stable release remains the default.
```

The full pre-release prompt can be appended to the main prompt; see [AI install prompt](./ai-install-prompt#testing-pre-release-channel-optional-not-default).

### HTTPS and public access

After changing the password on first login, configure panel HTTPS under **System settings**: either request a certificate or use an existing one.

- **Single domain**: default HTTP-01 (public port **80** reachable).
- **Wildcard `*.example.com`**: choose **DNS-01** and configure a Cloudflare API Token (Zone → DNS → Edit); see [Panel SSL / ACME](./ssl-cert).
- **Public IP**: Let's Encrypt `shortlived` certificate (160 hours, about 6 days, renewed automatically by the panel; ports 80/443 must be reachable).
- **Manual paths**: fullchain + privkey (for example files issued by certbot).

Users with an existing Nginx / Caddy can bind the panel to `127.0.0.1` only and let the reverse proxy serve HTTPS. A domain is not a prerequisite for installation; an HTTP port alone does not mean HTTPS is enabled.

Place self-managed certificates under `/etc/3m-ui/` or `/var/lib/3m-ui/` so they are backed up together with the database and keys. DNS records, validation ports, firewall rules and cloud security groups must match the access method you chose.

After saving SSL settings, **restart the panel** so `ListenTLS` takes effect. Set `public_url` to the client-facing base URL: subscription links, OAuth callbacks and share links are all generated from it.

### Versions and channels

Tags such as `v1.2.3` are immutable releases; `v1.3.0-rc.1` is an explicitly selected candidate. The versions below are format examples only — replace them with tags that actually exist in Releases.

```bash
sudo sh install.sh v1.2.3
sudo 3m-ui update v1.2.3

# Opt into the rolling test channel; the choice persists for later updates.
sudo env THREE_M_UI_CHANNEL=pre 3m-ui update

# Return to the stable update channel.
sudo env THREE_M_UI_CHANNEL=stable 3m-ui update
```

**Stable** is the default channel for install, `3m-ui update` and Docker `latest`; **Pre** is a separate rolling prerelease channel that requires an explicit choice and persists until you switch back. If no stable release is available the install fails explicitly instead of silently switching to `pre`. Nothing upgrades automatically; the target version is downloaded only when you run an update command.

When publishing your own fork, select the release source explicitly, for example:

```bash
sudo env THREE_M_UI_REPO=YOUR_OWNER/3m-ui sh install.sh
```

The source is saved in the install directory and reused by later updates. Docker uses images from the same release repository, e.g. `ghcr.io/YOUR_OWNER/3m-ui:v1.2.3`. Do not assume that downloading the original script from a fork also changes the default download URL.

Every release download is verified against `SHA256SUMS` and stops on a mismatch. Users with `cosign` installed can set `THREE_M_UI_VERIFY_COSIGN=1` to additionally require workflow signature verification.

### Custom core and advanced layout

A full install uses `/usr/local/lib/3m-ui/mihomo` by default and does not silently adopt a global `/usr/local/bin/mihomo`. A core path already present in existing config is preserved.

`--no-mihomo` installs / updates only the panel, for an existing external core or for other architectures that ship just the standalone panel binary. On a new install you can set `THREE_M_UI_MIHOMO_BINARY=/absolute/path/to/mihomo`. Custom cores must be validated and backed up by the operator; full release packages only guarantee the version pinned in their manifest.

### Management and backup

```bash
sudo 3m-ui status
sudo 3m-ui version
sudo 3m-ui logs
sudo 3m-ui restart
sudo 3m-ui backup
sudo 3m-ui update
sudo 3m-ui reset-config --panel --yes   # rescue broken SSL / listen bind
```

`backup` briefly pauses the service, writes a full snapshot under `/var/lib/3m-ui/backups/`, then restores the previous run state. That directory can grow large; clean it from **Settings → Backup** or call `POST /api/v1/system/backups/cleanup`. A snapshot contains panel binaries, the bundled core, management scripts, service definitions, config, encryption keys, the database and its sidecars, Mihomo data and certificates; historical backups are not recursively included. See [Backup & restore](./backup-restore).

An update finishes download and verification first, then stops the service for a consistent snapshot, replaces the binaries, and runs initialization plus HTTP/HTTPS health checks. A failed update attempts to restore the entire snapshot, including the pre-migration database and keys; if recovery fails, it prints the usable snapshot path.

```bash
# Replace with the absolute path actually created; the command takes another backup of the current state first.
sudo 3m-ui restore /var/lib/3m-ui/backups/ACTUAL-SNAPSHOT.tar.gz
```

Restoring a snapshot requires the same original install paths. To restore another version, use the snapshot from that version — do not swap in an older binary and assume the database can be downgraded. Copy important snapshots to another machine and rehearse recovery regularly.

Automatic snapshots cover this install's config and data directories. If the configured database, core config or certificates actually live in another shared directory, the script reports those paths and stops before shutting down rather than claiming the backup succeeded. Move that storage into the managed directories first, or back it up and update manually. External core binaries are never replaced.

Symlinks inside the certificate, core and ACME directories are checked against their real targets; nested directory symlinks and broken links cannot be snapshotted automatically and must be replaced by real files and directories inside the managed tree.

```bash
sudo 3m-ui uninstall          # keep config, data, keys and certificates
sudo 3m-ui uninstall --purge  # after explicit confirmation, remove all persisted content of this install
```

## Docker

Use `docker-compose.yml` from this release repository's Releases and keep a fixed Compose directory — changing the project name otherwise creates a second, empty set of volumes.

```bash
docker compose up -d
docker compose logs 3m-ui
```

The image ships the panel and the matching Mihomo core. First boot generates config and keys and prints a random initial password once in the logs. Only the password hash is written to the database; after changing it on first login you can rotate the first-boot log per your own retention policy. Config, data and logs live on named volumes whose permissions the image prepares. Restarts and container recreation never regenerate the account or keys.

The image runs as a non-root user. Ordinary listeners need neither `privileged` nor `NET_ADMIN`. If the host restricts ports below 1024, use a high port or add `NET_BIND_SERVICE` for deployments that really need it; features such as TUN require their own capability setup. Losing the persistent volume loses the database and certificates even if you still have the image.

### Network and versions

The default Compose file uses the Linux host network. New listeners bind directly to host ports with no container recreation, but port conflicts, firewall rules and security groups are still yours to handle.

For a bridge network, use the separate standalone template:

```bash
docker compose -f docker-compose.bridge.yml up -d
```

The bridge template maps only the panel to `127.0.0.1:8080`; public access needs a reverse proxy or a changed binding. Every node needs its own TCP/UDP mappings, and the template includes a port-range example. Do not stack the host and bridge templates.

Pin a release tag in a `.env` file next to the Compose file, for example:

```dotenv
THREE_M_UI_IMAGE=ghcr.io/kazeyukiro/3m-ui:v1.2.3
```

Replace the example with a real published tag. Default `latest` follows stable only; `pre` is for actively testing. A fork's image repository matches its release repository.

### Docker upgrade, backup, and restore

Upgrading replaces the image; the host install script does not run inside the container. Pull the new image first, then stop the service and back up the persistent directories:

```bash
docker compose pull
docker compose stop
mkdir -p backups
chmod 700 backups
docker compose run --rm --no-deps --user 0 --entrypoint sh \
  -v "$PWD/backups:/backup" 3m-ui -c \
  'umask 077; tar -czf /backup/before-upgrade.tar.gz /etc/3m-ui /var/lib/3m-ui'
docker compose up -d
docker compose ps
```

Use a different backup filename each time; `before-upgrade.tar.gz` in the example would be overwritten. Certificates and core config should live inside those two persistent directories. Record the image tag or digest a backup belongs to; to recover, stop the service, point `.env` back at that image, then restore the whole snapshot:

```bash
docker compose stop
docker compose run --rm --no-deps --user 0 --entrypoint sh \
  -v "$PWD/backups:/backup:ro" 3m-ui -c \
  'tar -tzf /backup/before-upgrade.tar.gz >/dev/null &&
   find /etc/3m-ui /var/lib/3m-ui -mindepth 1 -maxdepth 1 -exec rm -rf {} \; &&
   tar -xzf /backup/before-upgrade.tar.gz -C /'
docker compose up -d
```

Back up the current volumes before restoring too. The command above first verifies the archive is readable, then clears the existing contents of the two managed directories so stale WAL sidecars cannot mix into the restored result. `docker compose down` keeps volumes; `docker compose down -v` deletes them.

If the admin password is lost:

```bash
docker compose exec 3m-ui /usr/local/bin/3m-ui reset-admin
```

## Maintaining the release set

The pinned Mihomo version, architecture asset names and SHA-256 values live in `distribution/mihomo.env`. Changing it means a new bundled core and requires a fresh install plus core compatibility checks. Native full packages and Docker builds share this manifest.

Release and candidate workflows build by tag and refuse to overwrite published versions. Rolling `pre` is a separate channel. Images publish to `ghcr.io/<current owner>/<current repo>`; on the first release a repository admin must set package visibility so the public can pull.

Release validation should cover both architectures, first boot, a real running core, login and password change, node creation, a live proxy connection, an update that keeps data, and snapshot restore. A green compile alone does not prove a clean server can install.

## Subscription path and port

Optional `server.sub_path` (e.g. `/sub`) and `server.sub_port` can be set in `/etc/3m-ui/config.yaml`, or via `THREE_M_UI_SUB_PATH` / `THREE_M_UI_SUB_PORT`. The legacy `/api/v1/client/sub/:token` route still works. Set `public_url` to the client-facing base URL.

## Independent core updates

The **Core** page supports manual updates and rollback of official **stable** and **Pre** Mihomo builds on Linux amd64 / arm64. The selected version persists in the existing data directory and survives panel upgrades. See [Core updates](./core-updates) for validation, recovery and deployment integration.

## Frontend compression and caching

At startup the panel **gzip-precompresses** embedded text assets once and serves compressed responses when the client accepts them. Hashed JS/CSS use `Cache-Control: public, max-age=31536000, immutable`; HTML and non-hashed assets use `no-cache` with ETags so new deployments are detected. Identity and gzip responses have separate validators and set `Vary: Accept-Encoding`. No reverse-proxy compression setting or writable asset directory is required. Missing `/assets/` paths return an uncached **404** instead of falling back to the SPA HTML.

## Frontend stack (panel UI)

The embedded Web UI is **React + Ant Design** with icons from **Lucide** (`lucide-react`, wrapped in `frontend/src/icons.tsx`). Building the panel binary runs `npm ci` / `npm install` and `npm run build` under `frontend/`.

The overview (dashboard) is a gray canvas with floating cards (resources, traffic, connections), polls about every **2 seconds**, and splits connections by TCP/UDP. Feature search is available in the sidebar (desktop) and the mobile header, with **Ctrl/Cmd+K** as the shortcut. The bundled Mihomo version is pinned in `distribution/mihomo.env` (currently **v1.19.33**).
