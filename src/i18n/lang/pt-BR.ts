import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Início",
    posts: "Artigos",
    tags: "Tags",
    about: "Sobre",
    archives: "Arquivo",
    search: "Buscar",
  },
  post: {
    publishedAt: "Publicado em",
    updatedAt: "Atualizado em",
    sharePostIntro: "Compartilhe este artigo:",
    sharePostOn: "Compartilhar este artigo no {{platform}}",
    sharePostViaEmail: "Compartilhar este artigo por e-mail",
    tagLabel: "Tags",
    backToTop: "Voltar ao topo",
    goBack: "Voltar",
    editPage: "Editar página",
    previousPost: "Artigo anterior",
    nextPost: "Próximo artigo",
  },
  pagination: {
    prev: "Anterior",
    next: "Próxima",
    page: "Página",
  },
  home: {
    socialLinks: "Redes sociais",
    featured: "Em destaque",
    recentPosts: "Artigos recentes",
    allPosts: "Todos os artigos",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "Todos os direitos reservados.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "Todos os artigos com a tag",

    tagsTitle: "Tags",
    tagsDesc: "Todas as tags utilizadas nos artigos.",

    postsTitle: "Artigos",
    postsDesc: "Todos os artigos publicados.",

    archivesTitle: "Arquivo",
    archivesDesc: "Todos os artigos arquivados.",

    searchTitle: "Buscar",
    searchDesc: "Busque em qualquer artigo...",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    toggleTheme: "Alternar tema",
    searchPlaceholder: "Buscar artigos...",
    noResults: "Nenhum resultado encontrado",
    goToPreviousPage: "Ir para a página anterior",
    goToNextPage: "Ir para a próxima página",
  },
  notFound: {
    title: "404 Não encontrado",
    message: "Página não encontrada",
    goHome: "Voltar para o início",
  },
} satisfies UIStrings;
