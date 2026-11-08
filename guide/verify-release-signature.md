---
title: 校验发布签名
description: 3m-ui · 校验发布签名
---

# 校验发布签名

## 发布校验材料

官方 Release 提供校验和（以及工作流发布的签名材料）。生产环境安装前请核对下载文件与 `SHA256SUMS`（及说明中的 Sigstore 验证步骤）。

## 关于 `SHA256SUMS.pem` 的编码

`SHA256SUMS.pem` 是 **base64 文本**（cosign 的输出格式），不是可直接阅读的 PEM 证书。`cosign verify-blob` 可直接读取，**无需解码**；安装脚本的 `THREE_M_UI_VERIFY_COSIGN=1` 也是直接使用。

若要用 `openssl x509` 等只接受 PEM 的工具查看证书内容，请先解码：

```bash
base64 -d SHA256SUMS.pem > SHA256SUMS.cert.pem
openssl x509 -in SHA256SUMS.cert.pem -noout -text
```

