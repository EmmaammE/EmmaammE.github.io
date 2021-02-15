module.exports = {
  title: 'VuePress Blog',
  description: 'Just play around',
  base: '/',
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { 
      permalinkClass: 'header-anchor',  
      permalink: true, 
      permalinkBefore: true, 
      permalinkSymbol: ''
    },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2] },

    extractHeaders: [ 'h1', 'h2', 'h3' ]
  },

  // plugins: ['@vuepress/active-header-links', {
  //   sidebarLinkSelector: '.sidebar-link',
  //   headerAnchorSelector: '.header-anchor'
  // }]
}