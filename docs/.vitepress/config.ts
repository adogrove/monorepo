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
  {
    text: 'Translatable',
    link: '/packages/translatable',
    items: [
      { text: 'Introduction', link: '/packages/translatable' },
      {
        text: 'Installation',
        link: '/packages/translatable/installation',
      },
      { text: 'Usage', link: '/packages/translatable/usage' },
    ],
  },
  {
    text: 'Cap',
    link: '/packages/cap',
    items: [
      {
        text: 'Introduction',
        link: '/packages/cap',
      },
      {
        text: 'Installation',
        link: '/packages/cap/installation',
      },
      {
        text: 'Configuration',
        link: '/packages/cap/configuration',
      },
      {
        text: 'Usage',
        items: [
          {
            text: 'Register routes',
            link: '/packages/cap/usage/register-routes',
          },
          {
            text: 'VineJS bindings',
            link: '/packages/cap/usage/vinejs-bindings',
          },
          {
            text: 'Service',
            link: '/packages/cap/usage/service',
          },
        ],
      },
      {
        text: 'Digging deeper',
        items: [
          {
            text: 'Custom stores',
            link: '/packages/cap/digging-deeper/custom-stores',
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

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Adogrove',
  description: 'Hand-grown utility packages for AdonisJS',

  head: [
    ['meta', { property: 'og:title', content: 'Adogrove' }],
    ['meta', { property: 'og:site_name', content: 'Adogrove' }],
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Adogrove - Hand-grown utility packages for AdonisJS.',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://adogrove.github.io/' }],
  ],

  lang: 'en-US',

  lastUpdated: true,

  themeConfig: {
    nav: [
      {
        text: 'Packages',
        items: sidebarContent.map(({ text, link }) => ({ text, link })),
      },
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/adogrove/monorepo' },
    ],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/adogrove/monorepo/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the AGPL-3.0-or-later License.',
      copyright: 'Copyright © 2026 Xavier Stouder.',
    },
  },
})
