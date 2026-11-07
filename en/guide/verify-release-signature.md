---
title: Verify signatures
description: 3m-ui · Verify signatures
---

# Verify signatures

## Verify release signatures

Official release assets include checksums (and signatures when published). Verify downloads before installing on production hosts.

## About the `SHA256SUMS.pem` encoding

`SHA256SUMS.pem` is **base64 text** (cosign's output format), not a directly readable PEM certificate. `cosign verify-blob` accepts it as-is — **no decoding needed** — and the installer's `THREE_M_UI_VERIFY_COSIGN=1` uses it directly too.

If you want to inspect the certificate with a PEM-only tool such as `openssl x509`, decode it first:

```bash
base64 -d SHA256SUMS.pem > SHA256SUMS.cert.pem
openssl x509 -in SHA256SUMS.cert.pem -noout -text
```

