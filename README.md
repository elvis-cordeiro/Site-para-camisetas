# Estilo Ativo — Vitrine Digital de Artigos Esportivos

> **Versão:** 2.0 — Linha Total 90, Galeria com 3 Fotos Reais e Página de Detalhes  
> **Tecnologias:** HTML5 Semântico • CSS3 • JavaScript Puro (Vanilla JS)  
> **Formato:** Loja-vitrine responsiva (*Mobile-First*) com navegação para página de produto e atendimento via WhatsApp

---

## 1. O que há de novo na Versão 2.0

1. **Seção Especial do Modelo Total 90:**
   - Destaque no topo do site dedicado à histórica modelagem **Total 90** da Seleção Brasileira (anos 2000).
   - Apresenta as 3 fotos reais do modelo (Frente, Costas e Gola/Micro-Dry) diretamente na página inicial com botões rápidos de ação.
2. **3 Fotos Reais em Alta Resolução por Camiseta:**
   - **Camiseta Modelo Total 90 (Amarela):**
     - Foto 1: Frente com escudo 5 estrelas e costuras ergonômicas
     - Foto 2: Costas e caimento anatômico
     - Foto 3: Detalhes do tecido micro-dry e gola canelada dupla
   - **Camiseta Padrão Digital (Azul & Preta):**
     - Foto 1: Frente com grafismo digital vertical
     - Foto 2: Vista em ângulo (3/4) destacando frisos e recortes
     - Foto 3: Detalhe do peito, escudo e textura sedosa
3. **Página Dedicada do Produto (`produto.html`):**
   - Ao clicar em qualquer camiseta no catálogo, na seção Total 90 ou nos botões de fotos, o cliente é redirecionado para a página detalhada daquele modelo.
   - **Galeria Interativa:** Visualizador principal ampliado com miniaturas clicáveis e zoom em lightbox.
   - **Exibição das 3 fotos lado a lado:** Bloco com as 3 fotos acompanhadas de legendas explicativas.
   - **Botão do WhatsApp Logo Abaixo:** Seletor de tamanho (G e GG) com validação de estoque e o botão principal do WhatsApp posicionado diretamente abaixo das fotos para conversão imediata.

---

## 2. Estrutura de Arquivos

```text
Projeto Site para camisetas/
├── index.html                   # Página inicial com Hero, Diferenciais, Seção Total 90, Catálogo e Rodapé
├── produto.html                 # Página de detalhes com as 3 fotos, galeria, especificações e WhatsApp
├── css/
│   └── style.css                # Folha de estilos unificada com paleta esportiva, galeria e responsividade
├── js/
│   ├── produtos.js              # Base de dados com fotos reais, especificações e controle de estoque
│   ├── script.js                # Lógica da página inicial (renderização dinâmica, menu e WhatsApp)
│   └── produto-detalhe.js       # Lógica da página de detalhes (carregamento por ID, troca de fotos e WhatsApp)
├── assets/
│   ├── images/
│   │   ├── total90-amarela-frente.png   # Foto 1 da Total 90 (Frente)
│   │   ├── total90-amarela-costas.png   # Foto 2 da Total 90 (Costas)
│   │   ├── total90-amarela-detalhe.png  # Foto 3 da Total 90 (Gola e Detalhes)
│   │   ├── digital-azul-frente.png      # Foto 1 da Digital Azul (Frente)
│   │   ├── digital-azul-angulo.png      # Foto 2 da Digital Azul (Ângulo 3/4)
│   │   └── digital-azul-detalhe.png     # Foto 3 da Digital Azul (Detalhe do Peito)
│   └── icons/
│       ├── whatsapp.svg         # Ícone do WhatsApp
│       ├── truck.svg            # Ícone de entrega
│       ├── ruler.svg            # Ícone da tabela de medidas
│       ├── shield.svg           # Ícone de autenticidade
│       └── check.svg            # Ícone de especificações
└── README.md                    # Documentação do projeto
```

---

## 3. Estoque e Variações Atuais

| Produto / Modelo | Cor | Tamanho G | Tamanho GG | Preço | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Camiseta Modelo Total 90** | Amarela Canarinho | 1 unid. | 4 unids. | R$ 75,00 | Pronta Entrega |
| **Camiseta Edição Digital** | Azul e Preta | 0 unid. *(Esgotado)* | 5 unids. | R$ 75,00 | GG Disponível |

> **Observação:** O tamanho **G** da camiseta azul permanece bloqueado/desabilitado tanto no catálogo quanto na página de produto, cumprindo o princípio de transparência de estoque.

---

## 4. Como Configurar o WhatsApp Comercial

1. Abra os arquivos [`js/script.js`](file:///c:/Users/elvis.acordeiro/Desktop/Projeto%20Site%20para%20camisetas/js/script.js) e [`js/produto-detalhe.js`](file:///c:/Users/elvis.acordeiro/Desktop/Projeto%20Site%20para%20camisetas/js/produto-detalhe.js).
2. Localize a constante no início dos arquivos:
   ```javascript
   const WHATSAPP_NUMERO = "";
   ```
3. Digite o número com código do país (55 para Brasil) e DDD:
   ```javascript
   const WHATSAPP_NUMERO = "5511999999999";
   ```
4. Ao clicar no botão, a mensagem gerada automaticamente será:
   > *“Olá! Tenho interesse em [nome do produto], na cor [cor], tamanho [tamanho]. Gostaria de confirmar a disponibilidade e combinar a entrega.”*

---

## 5. Como Testar Localmente

- Para abrir a página inicial: Dê um duplo clique no arquivo [`index.html`](file:///c:/Users/elvis.acordeiro/Desktop/Projeto%20Site%20para%20camisetas/index.html).
- Clique em qualquer foto ou botão **"Ver as 3 fotos"** para ser redirecionado para a página de produto ([`produto.html`](file:///c:/Users/elvis.acordeiro/Desktop/Projeto%20Site%20para%20camisetas/produto.html)).
- Alterne entre as 3 miniaturas para ver cada ângulo e teste o botão do WhatsApp logo abaixo.
