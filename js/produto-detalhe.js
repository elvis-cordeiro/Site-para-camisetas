/**
 * Estilo Ativo - Lógica da Página de Detalhes do Produto (produto-detalhe.js)
 * Versão 2.0
 * 
 * Funcionalidades:
 * - Carregamento dinâmico dos dados do produto via parâmetro da URL (?id=1 ou ?id=2)
 * - Exibição das 3 imagens em alta resolução com galeria interativa e miniaturas
 * - Validação rigorosa de estoque por tamanho (G e GG)
 * - Bloqueio de tamanho com estoque zero (ex: Azul G)
 * - Geração de link e mensagem dinâmica para o WhatsApp logo abaixo das imagens
 * - Modal do Guia de Medidas e navegação
 */

// ========================================================
// 1. CONFIGURAÇÃO DO WHATSAPP
// ========================================================
// Insira o número oficial no formato: DDI + DDD + Número (apenas dígitos).
// Exemplo: "5511999999999". Se deixado vazio (""), abrirá o WhatsApp para escolher o contato.
const WHATSAPP_NUMERO = "";

// Estado da página
let produtoAtual = null;
let tamanhoSelecionado = null;
let indiceImagemAtiva = 0;

// ========================================================
// 2. INICIALIZAÇÃO
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  carregarProduto();
  inicializarModalMedidas();
  atualizarAnoRodape();
});

// ========================================================
// 3. CARREGAR PRODUTO PELA URL
// ========================================================
function carregarProduto() {
  const params = new URLSearchParams(window.location.search);
  const idOuSlug = params.get("id") || "1";

  produtoAtual = obterProdutoPorIdOuSlug(idOuSlug);

  if (!produtoAtual) {
    document.getElementById("detalhe-produto-container").innerHTML = `
      <div class="alerta-vazio">
        <h3>Produto não encontrado</h3>
        <p>Não encontramos o produto solicitado.</p>
        <a href="index.html#catalogo" class="btn-hero-primario" style="margin-top: 1rem;">Voltar ao Catálogo</a>
      </div>
    `;
    return;
  }

  // Define o tamanho inicial disponível com estoque > 0
  const tamanhosDisponiveis = Object.entries(produtoAtual.tamanhos).filter(([_, qtd]) => qtd > 0);
  tamanhoSelecionado = tamanhosDisponiveis.length > 0 ? tamanhosDisponiveis[0][0] : null;

  // Atualiza título da página
  document.title = `${produtoAtual.nome} | Estilo Ativo`;

  // Renderiza os componentes da página
  renderizarDetalhes();
}

// ========================================================
// 4. RENDERIZAÇÃO DA PÁGINA DE DETALHES
// ========================================================
function renderizarDetalhes() {
  // Breadcrumbs e Tags
  const elBreadcrumbNome = document.getElementById("breadcrumb-produto-nome");
  if (elBreadcrumbNome) elBreadcrumbNome.textContent = produtoAtual.nome;

  const elBadge = document.getElementById("detalhe-badge");
  if (elBadge) elBadge.textContent = produtoAtual.destaque;

  const elTitulo = document.getElementById("detalhe-titulo");
  if (elTitulo) elTitulo.textContent = produtoAtual.nome;

  const elModelo = document.getElementById("detalhe-modelo");
  if (elModelo) elModelo.textContent = `Modelo: ${produtoAtual.modelo} • Cor: ${produtoAtual.cor}`;

  const elPreco = document.getElementById("detalhe-preco");
  if (elPreco) elPreco.textContent = produtoAtual.preco.toFixed(2).replace(".", ",");

  const elDescricao = document.getElementById("detalhe-descricao");
  if (elDescricao) elDescricao.textContent = produtoAtual.descricaoCompleta;

  // Renderizar a Galeria de 3 Imagens (Principal + Miniaturas)
  renderizarGaleriaImagens();

  // Renderizar o Grid Completo das 3 Imagens com legendas
  renderizarGradeTresImagens();

  // Renderizar Seletor de Tamanhos
  renderizarSeletorTamanhos();

  // Renderizar Especificações Técnicas
  renderizarEspecificacoes();

  // Renderizar Sugestão de Outro Modelo
  renderizarOutrosModelos();

  // Atualizar o estado do WhatsApp
  atualizarLinkWhatsApp();
}

// ========================================================
// 5. GALERIA INTERATIVA DAS 3 IMAGENS
// ========================================================
function renderizarGaleriaImagens() {
  const containerPrincipal = document.getElementById("galeria-imagem-principal-box");
  const containerMiniaturas = document.getElementById("galeria-miniaturas");

  if (!containerPrincipal || !containerMiniaturas) return;

  const imgAtiva = produtoAtual.imagens[indiceImagemAtiva] || produtoAtual.imagens[0];

  // Imagem Principal com efeito de zoom suave
  containerPrincipal.innerHTML = `
    <div class="visualizador-wrapper">
      <img 
        src="${imgAtiva.url}" 
        alt="${produtoAtual.nome} - ${imgAtiva.titulo}" 
        id="imagem-principal-detalhe"
        class="imagem-principal-detalhe"
        onclick="abrirZoomImagem('${imgAtiva.url}', '${imgAtiva.titulo}')"
      />
      <div class="legenda-foto-ativa">
        <span class="foto-numero">${indiceImagemAtiva + 1}/3</span>
        <span>${imgAtiva.titulo}</span>
      </div>
    </div>
  `;

  // Miniaturas das 3 Imagens
  containerMiniaturas.innerHTML = produtoAtual.imagens.map((img, idx) => {
    const isAtiva = idx === indiceImagemAtiva;
    return `
      <button 
        type="button" 
        class="miniatura-btn ${isAtiva ? "ativo" : ""}" 
        onclick="trocarImagemPrincipal(${idx})"
        aria-label="Ver ${img.titulo}"
      >
        <img src="${img.url}" alt="${img.titulo}" />
        <span class="miniatura-rotulo">${img.titulo}</span>
      </button>
    `;
  }).join("");
}

function trocarImagemPrincipal(indice) {
  indiceImagemAtiva = indice;
  renderizarGaleriaImagens();
}

// ========================================================
// 6. GRADE COM TODAS AS 3 IMAGENS LADO A LADO
// ========================================================
function renderizarGradeTresImagens() {
  const container = document.getElementById("grade-tres-imagens");
  if (!container) return;

  container.innerHTML = produtoAtual.imagens.map((img, idx) => `
    <div class="card-foto-tres" onclick="trocarImagemPrincipal(${idx})">
      <div class="foto-badge">Foto ${idx + 1} de 3</div>
      <div class="foto-img-wrap">
        <img src="${img.url}" alt="${produtoAtual.nome} - ${img.titulo}" loading="lazy" />
      </div>
      <div class="foto-info">
        <h4>${img.titulo}</h4>
        <p>${img.descricao}</p>
      </div>
    </div>
  `).join("");
}

// ========================================================
// 7. SELETOR DE TAMANHOS E ESTOQUE
// ========================================================
function renderizarSeletorTamanhos() {
  const container = document.getElementById("detalhe-seletor-botoes");
  const feedbackEl = document.getElementById("detalhe-feedback-estoque");

  if (!container) return;

  const tamanhos = Object.entries(produtoAtual.tamanhos);

  container.innerHTML = tamanhos.map(([tam, qtd]) => {
    const esgotado = qtd <= 0;
    const isSelecionado = tam === tamanhoSelecionado && !esgotado;

    return `
      <button 
        type="button" 
        class="btn-tamanho ${isSelecionado ? "ativo" : ""} ${esgotado ? "esgotado" : ""}"
        ${esgotado ? "disabled aria-disabled='true'" : ""}
        onclick="selecionarTamanhoDetalhe('${tam}')"
        aria-checked="${isSelecionado}"
        role="radio"
        title="${esgotado ? 'Tamanho esgotado' : qtd + ' unidade(s) disponível(is)'}"
      >
        <span class="tam-letra">${tam}</span>
        <span class="tam-status">${esgotado ? "Esgotado" : `${qtd} un. disp.`}</span>
      </button>
    `;
  }).join("");

  if (feedbackEl) {
    if (!tamanhoSelecionado) {
      feedbackEl.innerHTML = `<span class="aviso-atencao">Selecione um tamanho disponível acima para continuar.</span>`;
    } else {
      const qtd = produtoAtual.tamanhos[tamanhoSelecionado] || 0;
      if (qtd === 1) {
        feedbackEl.innerHTML = `<span class="aviso-alerta">⚡ Resta apenas <strong>1 unidade</strong> no tamanho <strong>${tamanhoSelecionado}</strong>!</span>`;
      } else if (qtd > 1) {
        feedbackEl.innerHTML = `<span class="aviso-disponivel">✓ Pronta entrega: <strong>${qtd} unidades disponíveis</strong> no tamanho <strong>${tamanhoSelecionado}</strong>.</span>`;
      }
    }
  }
}

function selecionarTamanhoDetalhe(tamanho) {
  const qtd = produtoAtual.tamanhos[tamanho] || 0;
  if (qtd <= 0) return;

  tamanhoSelecionado = tamanho;
  renderizarSeletorTamanhos();
  atualizarLinkWhatsApp();
}

// ========================================================
// 8. ESPECIFICAÇÕES TÉCNICAS E SUGESTÕES
// ========================================================
function renderizarEspecificacoes() {
  const lista = document.getElementById("detalhe-especificacoes");
  if (!lista) return;

  lista.innerHTML = produtoAtual.especificacoes.map(item => `
    <li>
      <img src="assets/icons/check.svg" alt="" width="16" height="16" />
      <span>${item}</span>
    </li>
  `).join("");
}

function renderizarOutrosModelos() {
  const container = document.getElementById("outros-modelos-container");
  if (!container) return;

  const outros = produtos.filter(p => p.id !== produtoAtual.id);
  if (outros.length === 0) {
    container.parentElement.style.display = "none";
    return;
  }

  container.innerHTML = outros.map(prod => `
    <a href="produto.html?id=${prod.id}" class="card-outro-modelo">
      <img src="${prod.imagemPrincipal}" alt="${prod.nome}" />
      <div class="outro-info">
        <span class="outro-tag">${prod.destaque}</span>
        <h4>${prod.nome}</h4>
        <span class="outro-preco">R$ ${prod.preco.toFixed(2).replace(".", ",")}</span>
        <span class="outro-link">Ver 3 Fotos e Detalhes &rarr;</span>
      </div>
    </a>
  `).join("");
}

// ========================================================
// 9. WHATSAPP - BOTÃO LOGO ABAIXO DAS IMAGENS
// ========================================================
function atualizarLinkWhatsApp() {
  const btn = document.getElementById("btn-whatsapp-detalhe");
  if (!btn) return;

  // Atualiza texto ou tooltip
  if (!tamanhoSelecionado) {
    btn.classList.add("desabilitado");
  } else {
    btn.classList.remove("desabilitado");
  }
}

function dispararWhatsAppDetalhe() {
  if (!tamanhoSelecionado) {
    alert("Por favor, selecione um tamanho disponível (G ou GG) antes de enviar a mensagem.");
    const seletor = document.getElementById("detalhe-seletor-botoes");
    if (seletor) seletor.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const estoque = produtoAtual.tamanhos[tamanhoSelecionado] || 0;
  if (estoque <= 0) {
    alert(`O tamanho ${tamanhoSelecionado} está esgotado. Por favor selecione outro tamanho disponível.`);
    return;
  }

  /**
   * Mensagem pré-preenchida estritamente conforme a especificação do projeto (Seção 5):
   * “Olá! Tenho interesse em [nome do produto], na cor [cor], tamanho [tamanho]. Gostaria de confirmar a disponibilidade e combinar a entrega.”
   */
  const mensagem = `Olá! Tenho interesse em ${produtoAtual.nome}, na cor ${produtoAtual.cor}, tamanho ${tamanhoSelecionado}. Gostaria de confirmar a disponibilidade e combinar a entrega.`;

  const textoCodificado = encodeURIComponent(mensagem);
  let url = "";

  if (WHATSAPP_NUMERO && WHATSAPP_NUMERO.trim() !== "") {
    const numeroLimpo = WHATSAPP_NUMERO.replace(/\D/g, "");
    url = `https://wa.me/${numeroLimpo}?text=${textoCodificado}`;
  } else {
    url = `https://wa.me/?text=${textoCodificado}`;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

// ========================================================
// 10. MODAL DE MEDIDAS E ZOOM
// ========================================================
function inicializarModalMedidas() {
  const modal = document.getElementById("modal-medidas");
  const fecharBtn = document.getElementById("fechar-modal-medidas");
  const overlay = document.getElementById("modal-overlay");

  if (!modal) return;

  if (fecharBtn) fecharBtn.addEventListener("click", fecharModalMedidas);
  if (overlay) overlay.addEventListener("click", fecharModalMedidas);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharModalMedidas();
      fecharZoomImagem();
    }
  });
}

function abrirModalMedidas() {
  const modal = document.getElementById("modal-medidas");
  if (modal) {
    modal.classList.add("ativo");
    document.body.style.overflow = "hidden";
  }
}

function fecharModalMedidas() {
  const modal = document.getElementById("modal-medidas");
  if (modal) {
    modal.classList.remove("ativo");
    document.body.style.overflow = "";
  }
}

function abrirZoomImagem(url, titulo) {
  const modalZoom = document.getElementById("modal-zoom-imagem");
  const imgZoom = document.getElementById("zoom-imagem-src");
  const legendaZoom = document.getElementById("zoom-imagem-legenda");

  if (!modalZoom || !imgZoom) return;

  imgZoom.src = url;
  if (legendaZoom) legendaZoom.textContent = titulo;
  modalZoom.classList.add("ativo");
  document.body.style.overflow = "hidden";
}

function fecharZoomImagem() {
  const modalZoom = document.getElementById("modal-zoom-imagem");
  if (modalZoom) {
    modalZoom.classList.remove("ativo");
    document.body.style.overflow = "";
  }
}

function atualizarAnoRodape() {
  const el = document.getElementById("ano-atual");
  if (el) el.textContent = new Date().getFullYear();
}
