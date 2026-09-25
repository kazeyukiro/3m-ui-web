import { defineConfig } from 'vitepress'

const zhNav = [
  { text: '文档', link: '/guide/quick-start' },
  { text: '安装', link: '/guide/install' },
  { text: 'GitHub', link: 'https://github.com/kazeyukiro/3m-ui' },
]

const enNav = [
  { text: 'Docs', link: '/en/guide/quick-start' },
  { text: 'Install', link: '/en/guide/install' },
  { text: 'GitHub', link: 'https://github.com/kazeyukiro/3m-ui' },
]

const zhSidebar = [
  {
    text: '入门',
    items: [
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '安装', link: '/guide/install' },
      { text: '预发布通道', link: '/guide/dev-channel' },
    ],
  },
  {
    text: '面板',
    items: [
      { text: '面板配置', link: '/guide/panel-config' },
      { text: 'NAT 与端口', link: '/guide/nat-port' },
      { text: '节点（Listeners）', link: '/guide/listeners' },
      { text: '用户与流量', link: '/guide/users-traffic' },
      { text: '订阅', link: '/guide/subscription' },
      { text: '路由规则', link: '/guide/routing' },
      { text: '内核', link: '/guide/core' },
      { text: '分享', link: '/guide/share' },
    ],
  },
  {
    text: '运维',
    items: [
      { text: '多机节点', link: '/guide/cluster' },
      { text: 'Telegram', link: '/guide/telegram-bot' },
      { text: 'SSL 证书', link: '/guide/ssl-cert' },
      { text: '系统设置', link: '/guide/system-settings' },
      { text: '备份与恢复', link: '/guide/backup-restore' },
      { text: '安全', link: '/guide/security' },
      { text: '校验发布签名', link: '/guide/verify-release-signature' },
      { text: '故障排查', link: '/guide/troubleshoot' },
    ],
  },
  {
    text: 'API',
    items: [{ text: 'API 与鉴权', link: '/guide/api-auth' }],
  },
]

const enSidebar = [
  {
    text: 'Getting started',
    items: [
      { text: 'Quick start', link: '/en/guide/quick-start' },
      { text: 'Install', link: '/en/guide/install' },
      { text: 'Pre-release channel', link: '/en/guide/dev-channel' },
    ],
  },
  {
    text: 'Panel',
    items: [
      { text: 'Panel config', link: '/en/guide/panel-config' },
      { text: 'NAT & ports', link: '/en/guide/nat-port' },
      { text: 'Listeners', link: '/en/guide/listeners' },
      { text: 'Users & traffic', link: '/en/guide/users-traffic' },
      { text: 'Subscriptions', link: '/en/guide/subscription' },
      { text: 'Routing', link: '/en/guide/routing' },
      { text: 'Core', link: '/en/guide/core' },
      { text: 'Share', link: '/en/guide/share' },
    ],
  },
  {
    text: 'Operations',
    items: [
      { text: 'Cluster', link: '/en/guide/cluster' },
      { text: 'Telegram', link: '/en/guide/telegram-bot' },
      { text: 'SSL certificates', link: '/en/guide/ssl-cert' },
      { text: 'System settings', link: '/en/guide/system-settings' },
      { text: 'Backup & restore', link: '/en/guide/backup-restore' },
      { text: 'Security', link: '/en/guide/security' },
      { text: 'Verify signatures', link: '/en/guide/verify-release-signature' },
      { text: 'Troubleshooting', link: '/en/guide/troubleshoot' },
    ],
  },
  {
    text: 'API',
    items: [{ text: 'API & auth', link: '/en/guide/api-auth' }],
  },
]

export default defineConfig({
  lang: 'zh-CN',
  title: '3m-ui',
  description: 'Mihomo 服务端 Web 管理面板',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/logo.png', type: 'image/png' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '3m-ui',
      description: 'Mihomo 服务端 Web 管理面板 — 节点、用户、订阅与运维',
      themeConfig: {
        nav: zhNav,
        sidebar: { '/guide/': zhSidebar },
        outline: { label: '本页目录', level: [2, 3] },
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色',
        darkModeSwitchTitle: '切换到深色',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        lastUpdated: { text: '最后更新' },
        editLink: {
          pattern: 'https://github.com/kazeyukiro/3m-ui-web/edit/main/:path',
          text: '在 GitHub 上编辑此页',
        },
        footer: {
          message: 'Mihomo · 自托管面板',
          copyright: 'MIT · <a href="https://github.com/kazeyukiro/3m-ui">kazeyukiro/3m-ui</a>',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: '3m-ui',
      description: 'Web panel for Mihomo — nodes, users, subscriptions and ops',
      themeConfig: {
        nav: enNav,
        sidebar: { '/en/guide/': enSidebar },
        outline: { label: 'On this page', level: [2, 3] },
        docFooter: { prev: 'Previous', next: 'Next' },
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light',
        darkModeSwitchTitle: 'Switch to dark',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Back to top',
        lastUpdated: { text: 'Last updated' },
        editLink: {
          pattern: 'https://github.com/kazeyukiro/3m-ui-web/edit/main/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Mihomo · Self-hosted panel',
          copyright: 'MIT · <a href="https://github.com/kazeyukiro/3m-ui">kazeyukiro/3m-ui</a>',
        },
      },
    },
  },
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '3m-ui',
    socialLinks: [{ icon: 'github', link: 'https://github.com/kazeyukiro/3m-ui' }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有结果',
                resetButtonTitle: '清除',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
          en: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search docs' },
              modal: {
                noResultsText: 'No results',
                resetButtonTitle: 'Clear',
                footer: { selectText: 'to select', navigateText: 'to navigate', closeText: 'to close' },
              },
            },
          },
        },
      },
    },
  },
})
