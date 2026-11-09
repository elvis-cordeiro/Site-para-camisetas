/**
 * Estilo Ativo - Lógica da Vitrine Digital (script.js)
 * Versão 2.0 - Integração com Fotos Reais e Redirecionamento para Página de Detalhes
 */

// ========================================================
// 1. CONFIGURAÇÃO DO WHATSAPP DO VENDEDOR
// ========================================================
// Para definir o número real, insira: DDI + DDD + telefone (apenas números).
// Exemplo: "5511999999999". Se deixado vazio (""), o WhatsApp abrirá para você escolher o contato.
const WHATSAPP_NUMERO = "";

// Estado em memória das seleções de cada produto no catálogo
const estadoSelecao = {};

// ========================================================
// 2. INICIALIZAÇÃO
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogo();
  inicializarMenuMobile();
  inicializarModalMedidas();
  atualizarAnoRodape();
});

// ========================================================
// 3. RENDERIZAÇÃO DO CATÁLOGO
// ========================================================
function renderizarCatalogo() {
  const container = document.getElementById("catalogo-lista");
  if (!container) return;

  if (!produtos || produtos.length === 0) {
    container.innerHTML = `
      <div class="alerta-vazio">
        <p>Nenhum produto cadastrado no catálogo no momento.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = produtos.map(produto => {
    // Inicializa seleção padrão (tamanho com estoque disponível)
    const tamanhosDisponiveis = Object.entries(produto.tamanhos).filter(([_, qtd]) => qtd > 0);
    const primeiroDisponivel = tamanhosDisponiveis.length > 0 ? tamanhosDisponiveis[0][0] : null;
    estadoSelecao[produto.id] = primeiroDisponivel;

    return `
      <article class="card-produto" id="card-produto-${produto.id}" data-id="${produto.id}">
        <!-- Cabeçalho Visual da Imagem (Clicável para ver as 3 fotos) -->
        <div class="card-imagem-container">
          <span class="badge-tag">${produto.destaque || "Pronta Entrega"}</span>
          
          <a href="produto.html?id=${produto.id}" class="card-imagem-link" title="Clique para ver as 3 fotos de ${produto.nome}">
            <img 
              src="${produto.imagemPrincipal}" 
              alt="${produto.nome}" 
              class="card-imagem"
              loading="lazy"
            />
            <div class="card-imagem-overlay">
              <span class="overlay-tag">🔍 Ver 3 fotos em alta definição</span>
            </div>
          </a>

          <div class="card-cor-pill">
            <span class="cor-indicador" style="background-color: ${produto.corPillHex || '#333'}"></span>
            ${produto.cor}
          </div>
        </div>

        <!-- Barra de Miniaturas das 3 Fotos -->
        <div class="card-fotos-preview-strip">
          <span class="strip-label">3 Fotos Disponíveis:</span>
          <div class="strip-thumbs">
            ${produto.imagens.map((img, idx) => `
              <a href="produto.html?id=${produto.id}" class="strip-thumb-item" title="Ver foto ${idx + 1}: ${img.titulo}">
                <img src="${img.url}" alt="${img.titulo}" />
              </a>
            `).join("")}
          </div>
          <a href="produto.html?id=${produto.id}" class="link-todas-fotos">Ver todas &rarr;</a>
        </div>

        <!-- Conteúdo do Card -->
        <div class="card-conteudo">
          <header class="card-header">
            <h3 class="card-titulo">
              <a href="produto.html?id=${produto.id}">${produto.nome}</a>
            </h3>
            <p class="card-descricao">${produto.descricaoCurta}</p>
          </header>

          <!-- Preço -->
          <div class="card-preco-box">
            <span class="preco-rotulo">Preço unitário</span>
            <div class="preco-valor">
              <span class="preco-moeda">R$</span>
              <span class="preco-numero">${produto.preco.toFixed(2).replace(".", ",")}</span>
            </div>
            <span class="preco-pagamento">✓ Pagamento na entrega ou Pix</span>
          </div>

          <!-- Seletor de Tamanhos e Estoque -->
          <div class="seletor-tamanho-secao">
            <div class="seletor-topo">
              <label class="seletor-label" for="tamanho-grupo-${produto.id}">
                Tamanho:
              </label>
              <button 
                type="button" 
                class="btn-guia-medidas-link" 
                onclick="abrirModalMedidas()"
                aria-label="Ver tabela de medidas"
              >
                <img src="assets/icons/ruler.svg" alt="" width="14" height="14" />
                Guia de Medidas
              </button>
            </div>

            <div class="seletor-tamanhos-botoes" id="tamanho-grupo-${produto.id}" role="radiogroup" aria-label="Tamanhos disponíveis">
              ${renderizarBotoesTamanho(produto)}
            </div>

            <!-- Feedback de disponibilidade em tempo real -->
            <div class="feedback-estoque" id="feedback-estoque-${produto.id}">
              ${obterTextoEstoque(produto, primeiroDisponivel)}
            </div>
          </div>

          <!-- Ações do Card: Ver 3 Fotos + Pedir no WhatsApp -->
          <div class="card-acoes">
            <a href="produto.html?id=${produto.id}" class="btn-ver-fotos-card">
              <span>Ver as 3 fotos & especificações</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <button 
              type="button" 
              class="btn-whatsapp" 
              id="btn-whatsapp-${produto.id}"
              onclick="enviarParaWhatsApp(${produto.id})"
              aria-label="Pedir ${produto.nome} pelo WhatsApp"
            >
              <img src="assets/icons/whatsapp.svg" alt="WhatsApp" class="icon-whatsapp" width="20" height="20" />
              <span>Pedir no WhatsApp</span>
            </button>
            <p class="nota-atendimento">Disponibilidade e frete confirmados na conversa</p>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ========================================================
// 4. AUXILIARES DE RENDERIZAÇÃO
// ========================================================
function renderizarBotoesTamanho(produto) {
  const tamanhos = Object.entries(produto.tamanhos);
  const tamanhoAtivo = estadoSelecao[produto.id];

  return tamanhos.map(([tam, qtd]) => {
    const esgotado = qtd <= 0;
    const selecionado = tam === tamanhoAtivo && !esgotado;

    return `
      <button 
        type="button" 
        class="btn-tamanho ${selecionado ? "ativo" : ""} ${esgotado ? "esgotado" : ""}"
        ${esgotado ? "disabled aria-disabled='true'" : ""}
        onclick="selecionarTamanho(${produto.id}, '${tam}')"
        aria-checked="${selecionado}"
        role="radio"
        title="${esgotado ? 'Tamanho esgotado' : qtd + ' unidade(s) disponível(is)'}"
      >
        <span class="tam-letra">${tam}</span>
        <span class="tam-status">${esgotado ? "Esgotado" : `${qtd} un.`}</span>
      </button>
    `;
  }).join("");
}

function obterTextoEstoque(produto, tamanho) {
  if (!tamanho) {
    return `<span class="aviso-atencao">Selecione um tamanho disponível acima.</span>`;
  }
  const qtd = produto.tamanhos[tamanho] || 0;
  if (qtd <= 0) {
    return `<span class="aviso-esgotado">Tamanho ${tamanho} temporariamente indisponível.</span>`;
  }
  if (qtd === 1) {
    return `<span class="aviso-alerta">⚡ Resta apenas <strong>1 unidade</strong> no tamanho <strong>${tamanho}</strong>!</span>`;
  }
  return `<span class="aviso-disponivel">✓ <strong>${qtd} unidades</strong> prontas para envio no tamanho <strong>${tamanho}</strong>.</span>`;
}

// ========================================================
// 5. INTERAÇÃO E SELEÇÃO DE TAMANHOS
// ========================================================
function selecionarTamanho(produtoId, tamanho) {
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;

  const estoqueQtd = produto.tamanhos[tamanho] || 0;
  if (estoqueQtd <= 0) return;

  estadoSelecao[produtoId] = tamanho;

  const grupoContainer = document.getElementById(`tamanho-grupo-${produtoId}`);
  if (grupoContainer) {
    const botoes = grupoContainer.querySelectorAll(".btn-tamanho");
    botoes.forEach(btn => {
      const letra = btn.querySelector(".tam-letra")?.textContent.trim();
      if (letra === tamanho) {
        btn.classList.add("ativo");
        btn.setAttribute("aria-checked", "true");
      } else {
        btn.classList.remove("ativo");
        btn.setAttribute("aria-checked", "false");
      }
    });
  }

  const feedbackEl = document.getElementById(`feedback-estoque-${produtoId}`);
  if (feedbackEl) {
    feedbackEl.innerHTML = obterTextoEstoque(produto, tamanho);
  }
}

// ========================================================
// 6. INTEGRAÇÃO COM WHATSAPP
// ========================================================
function enviarParaWhatsApp(produtoId) {
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;

  const tamanhoEscolhido = estadoSelecao[produtoId];

  if (!tamanhoEscolhido) {
    alert("Por favor, selecione um tamanho disponível (G ou GG) antes de enviar a mensagem.");
    const container = document.getElementById(`card-produto-${produtoId}`);
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const estoqueDisponivel = produto.tamanhos[tamanhoEscolhido] || 0;
  if (estoqueDisponivel <= 0) {
    alert(`O tamanho ${tamanhoEscolhido} está esgotado no momento. Escolha outro tamanho com estoque.`);
    return;
  }

  /**
   * Mensagem pré-formatada estritamente conforme a especificação do projeto (Seção 5):
   * “Olá! Tenho interesse em [nome do produto], na cor [cor], tamanho [tamanho]. Gostaria de confirmar a disponibilidade e combinar a entrega.”
   */
  const mensagem = `Olá! Tenho interesse em ${produto.nome}, na cor ${produto.cor}, tamanho ${tamanhoEscolhido}. Gostaria de confirmar a disponibilidade e combinar a entrega.`;

  const textoCodificado = encodeURIComponent(mensagem);
  let urlWhatsApp = "";

  if (WHATSAPP_NUMERO && WHATSAPP_NUMERO.trim() !== "") {
    const numeroLimpo = WHATSAPP_NUMERO.replace(/\D/g, "");
    urlWhatsApp = `https://wa.me/${numeroLimpo}?text=${textoCodificado}`;
  } else {
    urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
  }

  window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
}

// ========================================================
// 7. GUIA DE MEDIDAS (MODAL)
// ========================================================
function inicializarModalMedidas() {
  const modal = document.getElementById("modal-medidas");
  const fecharBtn = document.getElementById("fechar-modal-medidas");
  const overlay = document.getElementById("modal-overlay");

  if (!modal) return;

  if (fecharBtn) {
    fecharBtn.addEventListener("click", fecharModalMedidas);
  }

  if (overlay) {
    overlay.addEventListener("click", fecharModalMedidas);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("ativo")) {
      fecharModalMedidas();
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

// ========================================================
// 8. MENU MOBILE
// ========================================================
function inicializarMenuMobile() {
  const btnMenu = document.getElementById("btn-menu-mobile");
  const navMenu = document.getElementById("nav-menu");

  if (!btnMenu || !navMenu) return;

  btnMenu.addEventListener("click", () => {
    const aberto = navMenu.classList.toggle("ativo");
    btnMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  const links = navMenu.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("ativo");
      btnMenu.setAttribute("aria-expanded", "false");
    });
  });
}

function atualizarAnoRodape() {
  const elAno = document.getElementById("ano-atual");
  if (elAno) {
    elAno.textContent = new Date().getFullYear();
  }
}
