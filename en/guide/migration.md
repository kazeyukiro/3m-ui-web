---
title: Migrate from another panel
description: 3m-ui · Migrate from another panel
---

# Migrate from another panel

3m-ui can read backups exported by 3x-ui and s-ui and append their users and nodes to the current panel for migration.

> Import is append-only: it never replaces or overwrites the existing database. A timestamped backup is created automatically before importing.

## Supported backups

- 3x-ui: classic v2 (`inbounds.settings.clients`) and split-table v3 (`client_records` / `client_inbounds`).
- s-ui: `clients` / `inbounds` / `tls` tables.
- Containers: raw `.db`, `.zip`, `.gz`, `.tar.gz`; a backup from this panel is detected and points to Restore.

## What can be migrated

| Item | Notes |
| --- | --- |
| Users | Username, credentials, traffic limit, used traffic, IP limit, expiry, enabled flag, remark, group |
| Nodes | Protocol, port, listen address, and best-effort mapping of REALITY / WS / gRPC / XHTTP / TLS |
| Bindings | The user-to-node relations |
| Traffic | Upload / download bytes and traffic limit |
| Skipped | Unsupported protocols (e.g. WireGuard) and portless inbounds are listed with a reason |

## Import steps

1. Open Settings → Security & backup and choose a backup under "Migrate from another panel".
2. Review the preview: source, user / node / binding counts, warnings, skipped entries and the node list.
3. Read the four "Please read before importing" notes, then click "Confirm import".
4. Review the result: created counts, auto-renames and the pre-import backup filename.
5. Go to the Listeners page, check every imported node, then enable it manually.

## Important notes

- Imported nodes are disabled with status `inactive`, so unreviewed listeners never go live.
- 3x-ui / s-ui run on Xray / sing-box while 3m-ui runs on Mihomo. Node configs are best-effort mappings and must be checked manually.
- Subscription URLs (`sub_token`) are regenerated; clients must re-import their subscription.
- Duplicate usernames, node names and UUIDs are auto-renamed or regenerated; existing rows are never overwritten.
- Preview writes nothing; import writes in a single transaction, so a failure never leaves partial data.
- The automatic backup is written to `backups/pre-migration-*.zip` next to the database and can be used to roll back.

## Restore guard

Restore replaces the whole database, so uploading a foreign panel backup there would destroy the installation. That endpoint now detects 3x-ui / s-ui backups and returns HTTP **400**, pointing to migration import.

## API

Both endpoints require an administrator JWT and take the multipart field `database`.

```
POST /api/v1/system/backup/migrate/preview
POST /api/v1/system/backup/migrate/import
```

Preview is read-only (credentials are masked); import appends data. See `openapi.yaml` and the Settings preview for all fields.
