import type { UIStrings } from '../types';

export default {
  nav: {
    home: 'Home',
    posts: 'Posts',
    tags: 'Tags',
    authors: 'Authors',
    about: 'About',
    archives: 'Archives',
    search: 'Search'
  },
  post: {
    publishedAt: 'Published at',
    updatedAt: 'Updated',
    byAuthor: 'By',
    sharePostIntro: 'Share this post:',
    sharePostOn: 'Share this post on {{platform}}',
    sharePostViaEmail: 'Share this post via email',
    copyLink: 'Copy link',
    copyLinkSuccess: 'Link copied!',
    tagLabel: 'Tags',
    backToTop: 'Back to top',
    goBack: 'Go back',
    editPage: 'Edit page',
    previousPost: 'Previous Post',
    nextPost: 'Next Post'
  },
  pagination: {
    prev: 'Prev',
    next: 'Next',
    page: 'Page'
  },
  home: {
    socialLinks: 'Social Links',
    featured: 'Featured',
    recentPosts: 'Recent Posts',
    allPosts: 'All Posts',
    tagline:
      'Notes on Azure and DevOps engineering, architecture, and consulting from LuzTech Development.',
    intro:
      'LuzTech Development is a Brazilian consultancy for cloud-native development, architecture, and DevOps on Azure. Here we share the technical side — implementation notes, architecture decisions, and practical write-ups.'
  },
  footer: {
    copyright: 'Copyright',
    allRightsReserved: 'All rights reserved.'
  },
  pages: {
    tagTitle: 'Tag',
    tagDesc: 'All the articles with the tag',

    tagsTitle: 'Tags',
    tagsDesc: 'All the tags used in posts.',

    authorTitle: 'Author',
    authorDesc: 'All the articles written by',

    authorsTitle: 'Authors',
    authorsDesc: 'All the people who have contributed to the blog.',

    postsTitle: 'Posts',
    postsDesc: "All the articles I've posted.",

    archivesTitle: 'Archives',
    archivesDesc: "All the articles I've archived.",

    searchTitle: 'Search',
    searchDesc: 'Search any article ...'
  },
  a11y: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toggleTheme: 'Toggle theme',
    searchPlaceholder: 'Search posts...',
    noResults: 'No results found',
    goToPreviousPage: 'Go to previous page',
    goToNextPage: 'Go to next page'
  },
  notFound: {
    title: '404 Not Found',
    message: 'Page Not Found',
    goHome: 'Go back home'
  }
} satisfies UIStrings;
