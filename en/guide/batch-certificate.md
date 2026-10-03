---
title: Batch apply node certificates
---

# Batch apply node certificates

Use **Nodes → batch certificate** to push one PEM certificate and private key to many listeners that already use TLS (or TLS-native protocols such as TUIC / Hysteria2 / AnyTLS).

## Behaviour

- Only **selected** listeners are updated; others are unchanged.
- The panel stores the PEM in **certstore** for that listener and refreshes generated Mihomo config when you apply.
- Share links and subscriptions resolve SNI / `skip-cert-verify` from this material (see the export pipeline).

## Requirements

- Valid certificate + private key PEM (or paths the panel can read when compiling).
- Listeners must be TLS-capable; pure plaintext protocols are skipped.

## After apply

1. **Generate / validate / apply** config so the core reloads.
2. Refresh client subscriptions so URIs pick up the new identity.
