---
title: Backup & restore
description: 3m-ui · Backup & restore
---

## Download backup (panel)

Settings → Backup → **Download backup** exports a `.zip` (SQLite DB + Mihomo config snapshot + meta). Use **Restore** to upload a zip or raw `.db`.

**Restore behavior (updated):** After a successful upload, the panel automatically exits (`os.Exit(0)`) so systemd's `Restart=always` brings it back with the new DB. The web page polls `/api/v1/health` and auto-reloads — **no manual SSH restart needed**.

The handler validates the SQLite magic header (`"SQLite format 3\0"`) before replacing the DB file, so corrupt or non-DB uploads are rejected with HTTP 400 (not 500). Stale `-journal` / `-wal` / `-shm` files are removed automatically to prevent rollback.

## On-disk install snapshots

`3m-ui update` / install scripts write tarballs under:

```
/var/lib/3m-ui/backups/

```

These can grow large (several GB). In the panel: **Settings → Backup** lists them with total size. You can:

- Delete one snapshot

- **Cleanup**: keep the newest *N* and/or delete entries older than *D* days

**Cleanup semantics (fixed):** When both `keep` and `older_than_days` are set, the newest `keep` entries are **always** preserved even if they're older than the age threshold. Age-based deletion only applies to entries *beyond* the keep window. This prevents accidentally losing all backups when they're all older than the age threshold.

### API

```
# List on-disk backups
curl -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/backups

# Cleanup: keep last 3, also drop anything older than 7 days
# (AND semantics — newest 3 always survive even if older than 7 days)
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"keep":3,"older_than_days":7}' \
  https://panel.example.com/api/v1/system/backups/cleanup

# Delete one by name
curl -X DELETE -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/backups/20260920T152614Z-100903.tar.gz

# Restart panel after config changes (no SSH needed)
curl -X POST -H "Authorization: Bearer <token>" \
  https://panel.example.com/api/v1/system/restart

```

Also back up `/etc/3m-ui`, `listener-certs/`, and `mihomo/` for a full machine restore.

