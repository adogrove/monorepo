import { defineConfig } from 'vitepress'

const sidebarContent = [
  {
    text: 'GeoLite2',
    link: '/packages/geolite2',
    items: [
      { text: 'Introduction', link: '/packages/geolite2' },
      {
        text: 'Installation',
        link: '/packages/geolite2/installation',
      },
      { text: 'Configuration', link: '/packages/geolite2/configuration' },
      { text: 'Usage', link: '/packages/geolite2/usage' },
    ],
  },
  {
    text: 'Auditing',
    link: '/packages/auditing',
    items: [
      {
        text: 'Introduction',
        link: '/packages/auditing',
      },
      {
        text: 'Installation',
        link: '/packages/auditing/installation',
      },
      {
        text: 'Configuration',
        items: [
          {
            text: 'General configuration',
            link: '/packages/auditing/configuration/general-configuration',
          },
        ],
      },
      {
        text: 'Basic usage',
        items: [
          {
            text: 'Model setup',
            link: '/packages/auditing/basic-usage/model-setup',
          },
          {
            text: 'Getting audits',
            link: '/packages/auditing/basic-usage/getting-audits',
          },
        ],
      },
      {
        text: 'Advanced usage',
        items: [
          {
            text: 'Audit resolvers',
            link: '/packages/auditing/advanced-usage/audit-resolvers',
          },
          {
            text: 'User resolver',
            link: '/packages/auditing/advanced-usage/user-resolver',
          },
        ],
      },
    ],
  },
]

const sidebar = sidebarContent.reduce((acc, { text, link, items }) => {
  const mainSection = { text, items }

  const otherPackages = sidebarContent
    .filter(({ link: otherLink }) => otherLink !== link)
    .map(({ text, link: otherLink }) => ({ text, link: otherLink }))

  acc[link] = [mainSection, { text: 'Other packages', items: otherPackages }]

  return acc
}, {})

console.log(JSON.stringify(sidebar, null, 2))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Adogrove',
  description: 'Hand-grown utility packages for AdonisJS',
  themeConfig: {
    nav: [
      {
        text: 'Packages',
        items: sidebarContent.map(({ text, link }) => ({ text, link })),
      },
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],

    lastUpdated: {},
    editLink: {
      pattern: ({ filePath }) =>
        `https://github.com/adogrove/monorepo/edit/main/docs/${filePath}`,
    },
    footer: {
      message: 'Released under the AGPL-3.0-or-later License.',
      copyright: 'Copyright © 2026 Xavier Stouder.',
    },
  },
})
