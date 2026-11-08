---
title: 预发布通道
description: 3m-ui · 预发布通道
---

# 预发布通道

默认安装与 `3m-ui update` 使用 **正式 Release（stable）**。

尝试预发布：

```bash
sudo 3m-ui channel pre --update
# 或在交互式菜单中切换；`3m-ui update pre` 亦可
```

生产环境建议使用稳定版。预发布可能随 `pre` 标签滚动更新，行为以当次构建说明为准。
