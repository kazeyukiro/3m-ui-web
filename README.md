# 3m-ui 官网与文档

- 站点：https://3m-ui.top  
- 技术栈：[VitePress](https://vitepress.dev/)（布局与风格对齐常见文档站：顶栏、侧栏、搜索、深色模式）

```bash
npm install
npm run dev
npm run build
```

面板源码：https://github.com/kazeyukiro/3m-ui

## 站点地图

线上 `https://3m-ui.top/sitemap.xml` 的源文件是 `public/sitemap.xml`：`public/` 下的文件会在构建时复制到站点根目录，仓库根目录直接放 `sitemap.xml` 是不会被发布的。新增页面后请同步更新该文件，避免 robots.txt 指向的地图与实际页面脱节。
