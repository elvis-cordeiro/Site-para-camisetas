/**
 * Estilo Ativo - Catálogo de Produtos e Fotos Reais
 * Versão 2.0 - Suporte a Múltiplas Imagens e Linha Total 90
 */

const produtos = [
  {
    id: 1,
    slug: "total-90-amarela",
    nome: "Camiseta Seleção Brasileira - Modelo Total 90",
    modelo: "Total 90 Clássica (2004)",
    cor: "Amarela Canarinho",
    corPillHex: "#FFD700",
    preco: 75.00,
    destaque: "Ícone Total 90",
    imagemPrincipal: "assets/images/total90-amarela-frente.png",
    imagens: [
      {
        url: "assets/images/total90-amarela-frente.png",
        titulo: "Vista Frontal",
        descricao: "Design clássico Total 90 com escudo central e costuras ergonômicas verdes."
      },
      {
        url: "assets/images/total90-amarela-costas.png",
        titulo: "Vista Traseira",
        descricao: "Costas limpas com recortes anatômicos e caimento atlético impecável."
      },
      {
        url: "assets/images/total90-amarela-detalhe.png",
        titulo: "Detalhe do Tecido e Gola",
        descricao: "Gola em V canelada dupla, textura micro-dry e acabamento premium."
      }
    ],
    descricaoCurta: "O lendário modelo Total 90 da Seleção Brasileira com costuras circulares, recortes ergonômicos e tecido Dry de alta respirabilidade.",
    descricaoCompleta: "Uma das modelagens mais cultuadas da história do futebol mundial: o lendário corte Total 90. Confeccionada em malha esportiva tecnológica com textura respirável, a peça conta com a icônica gola em V verde com friso duplo, costuras laterais ergonômicas que acompanham a anatomia corporal e caimento solto e confortável.",
    especificacoes: [
      "Modelo clássico Total 90 com curvas anatômicas",
      "Tecido Dry respirável de rápida evaporação de suor",
      "Escudo com as 5 estrelas e acabamento reforçado",
      "Gola canelada em verde escuro de alto conforto",
      "Ideal para colecionadores, jogos, treinos e torcida"
    ],
    tamanhos: {
      G: 1,
      GG: 4
    }
  },
  {
    id: 2,
    slug: "brasil-digital-azul-preta",
    nome: "Camiseta Seleção Brasileira - Padrão Digital Azul & Preta",
    modelo: "Edição Especial Digital Graphic",
    cor: "Azul e Preta",
    corPillHex: "#1565C0",
    preco: 75.00,
    destaque: "Edição Especial",
    imagemPrincipal: "assets/images/digital-azul-frente.png",
    imagens: [
      {
        url: "assets/images/digital-azul-frente.png",
        titulo: "Vista Frontal",
        descricao: "Padrão digital futurista em azul vibrante sobre malha preta profunda."
      },
      {
        url: "assets/images/digital-azul-angulo.png",
        titulo: "Vista em Ângulo (3/4)",
        descricao: "Destaque para os frisos amarelos e recortes laterais em verde esportivo."
      },
      {
        url: "assets/images/digital-azul-detalhe.png",
        titulo: "Detalhe do Peito e Textura",
        descricao: "Escudo do Brasil em relevo contrastante e tecido tecnológico sedoso."
      }
    ],
    descricaoCurta: "Design contemporâneo com padrão digital em azul elétrico sobre fundo preto, frisos contrastantes e máxima flexibilidade.",
    descricaoCompleta: "Uma releitura moderna e arrojada do manto brasileiro: fundo preto fosco com grafismo digital vertical em azul royal vibrante, detalhes em amarelo vivo nos ombros e painéis laterais em verde bandeira. Confeccionada em malha tecnológica leve e flexível que garante total liberdade de movimentos.",
    especificacoes: [
      "Grafismo digital esportivo de alta definição",
      "Tecido tecnológico flexível com toque macio",
      "Painéis laterais respiráveis para controle de temperatura",
      "Frisos de contraste nos ombros e gola careca canelada",
      "Excelente caimento para prática esportiva e estilo streetwear"
    ],
    tamanhos: {
      G: 0, // Conforme especificação comercial: esgotado
      GG: 5
    }
  }
];

// Medidas de referência para a tabela de tamanhos
const guiaDeMedidas = {
  G: {
    torax: "106 a 112 cm",
    comprimento: "74 cm",
    manga: "23 cm"
  },
  GG: {
    torax: "114 a 122 cm",
    comprimento: "77 cm",
    manga: "24 cm"
  }
};

// Função auxiliar para buscar produto por ID ou Slug
function obterProdutoPorIdOuSlug(param) {
  if (!param) return produtos[0];
  const idNum = Number(param);
  if (!isNaN(idNum)) {
    return produtos.find(p => p.id === idNum) || produtos[0];
  }
  return produtos.find(p => p.slug === param) || produtos[0];
}
