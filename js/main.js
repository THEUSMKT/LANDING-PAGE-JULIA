/* ==========================================================================
   CONFIGURAÇÃO — edite somente aqui
   Todos os links de WhatsApp, Instagram e a cidade da página saem daqui.
   ========================================================================== */
const CONFIG = {
  // Somente números: 55 + DDD + número. Ex.: "5511987654321"
  whatsapp: "5551991962607",
  instagram: "https://instagram.com/[USUARIO]",
  cidade: "[CIDADE/REGIÃO]",

  mostrarPrecos: false,      // true = troca "Valor sob consulta" por "a partir de R$ ..." (valores em "precos")
  mostrarDepoimentos: false, // true = mostra a seção de depoimentos (preencha "depoimentos" antes)
  metaPixelId: "",           // ID do Meta Pixel. Vazio = pixel desligado.

  // Mensagens que já vão prontas para o WhatsApp
  mensagens: {
    padrao: "Oi, Júlia! Vi seu site e quero saber sobre uma maquiagem ✨",
    portfolio: "Oi, Júlia! Vi seu portfólio e quero uma make parecida ✨",
    reservar: "Oi, Júlia! Vi seu site e quero reservar minha data ✨",
    servico: "Oi, Júlia! Quero saber sobre maquiagem para {servico} ✨"
  },

  // Só aparecem se mostrarPrecos = true. Ex.: noiva: "450"
  precos: {
    festa: "[VALOR]",
    noiva: "[VALOR]",
    madrinhaFormanda: "[VALOR]",
    quinzeAnos: "[VALOR]",
    ensaio: "[VALOR]"
  },

  // Portfólio: para adicionar uma foto, basta incluir uma linha.
  // "posicao" (opcional) escolhe o enquadramento da miniatura: "50% 20%" = centro na horizontal, mais para cima.
  // Na ampliação (lightbox) a foto aparece inteira.
  portfolio: [
    { src: "assets/img/portfolio/make-01.jpg", ocasiao: "Ensaio", posicao: "55% 40%",
      alt: "Cliente de chapéu preto e lenço vermelho com make de pele bronzeada, esfumado dourado e bronze, cílios marcados, sobrancelhas definidas e boca nude com gloss, feita por Júlia Cardoso" },
    { src: "assets/img/portfolio/make-02.jpg", ocasiao: "Festa", posicao: "50% 35%",
      alt: "Cliente de cabelo longo castanho-avermelhado com make de pele iluminada, olhos em marrom suave com brilho no canto interno e batom rosado com gloss, feita por Júlia Cardoso" },
    { src: "assets/img/portfolio/make-03.jpg", ocasiao: "Social", posicao: "50% 15%",
      alt: "Cliente de cabelo longo liso e vestido coral com make de esfumado marrom suave, delineado discreto, pele luminosa e boca nude rosada, feita por Júlia Cardoso" }
  ],

  // Preencher SOMENTE com depoimentos reais de clientes.
  // "foto" é opcional (foto da cliente ou print da conversa).
  depoimentos: [
    // { texto: "Texto real da cliente", nome: "Nome da cliente", ocasiao: "Noiva", foto: "assets/img/depoimentos/cliente-1.jpg", fotoAlt: "Print da conversa com a cliente" },
  ]
};

/* ========================================================================== */

(function () {
  "use strict";

  const $ = (seletor, el = document) => el.querySelector(seletor);
  const $$ = (seletor, el = document) => Array.from(el.querySelectorAll(seletor));
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- WhatsApp ---------- */
  const numeroWhats = String(CONFIG.whatsapp).replace(/\D/g, "");
  if (!/^55\d{10,11}$/.test(numeroWhats)) {
    console.warn("[Julia Studio] Preencha CONFIG.whatsapp no js/main.js (ex.: 5511987654321).");
  }

  function linkWhats(mensagem) {
    return "https://wa.me/" + numeroWhats + "?text=" + encodeURIComponent(mensagem);
  }

  function mensagemDo(el) {
    const msg = CONFIG.mensagens[el.dataset.wa] || CONFIG.mensagens.padrao;
    return msg.replace("{servico}", el.dataset.servico || "");
  }

  /* ---------- Rastreamento ---------- */
  function iniciarPixel() {
    if (!CONFIG.metaPixelId) return;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", CONFIG.metaPixelId);
    window.fbq("track", "PageView");
  }

  /* GA4 — espaço reservado.
     Para ativar, descomente o bloco abaixo e troque G-XXXXXXXXXX pelo seu ID.
     Os eventos de WhatsApp e do formulário já são enviados ao GA4 pela função rastrear().

  (function () {
    const GA4_ID = "G-XXXXXXXXXX";
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
  })();
  */

  // Envia o evento para o Meta Pixel (se ativo), GA4 (se ativo) e dataLayer (GTM).
  function rastrear(evento, params) {
    params = params || {};
    if (typeof window.fbq === "function") window.fbq("track", evento, params);
    if (typeof window.gtag === "function") {
      window.gtag("event", evento === "Lead" ? "generate_lead" : "clique_whatsapp", params);
    }
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: evento }, params));
  }

  /* ---------- Aplica o CONFIG na página ---------- */
  function aplicarConfig() {
    $$("[data-wa]").forEach((a) => {
      a.href = linkWhats(mensagemDo(a));
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-instagram]").forEach((a) => {
      a.href = CONFIG.instagram;
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-cidade]").forEach((el) => { el.textContent = CONFIG.cidade; });
    $$("[data-ano]").forEach((el) => { el.textContent = new Date().getFullYear(); });
    if (CONFIG.mostrarPrecos) {
      $$("[data-preco]").forEach((el) => {
        const valor = CONFIG.precos[el.dataset.preco];
        if (valor) el.textContent = "a partir de R$ " + valor;
      });
    }
  }

  // Destaca tudo que ainda está [ENTRE COLCHETES] para facilitar a revisão.
  // Quando os textos forem preenchidos, não sobra nada para destacar.
  function destacarPendentes() {
    const regex = /(\[[^\]\n]+\])/;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(no) {
        if (!regex.test(no.nodeValue)) return NodeFilter.FILTER_REJECT;
        return no.parentElement.closest("script, style, option, select, textarea, noscript, .pendente")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nos = [];
    while (walker.nextNode()) nos.push(walker.currentNode);
    nos.forEach((no) => {
      const frag = document.createDocumentFragment();
      no.nodeValue.split(regex).forEach((parte) => {
        if (!parte) return;
        if (regex.test(parte)) {
          const mark = document.createElement("mark");
          mark.className = "pendente";
          mark.textContent = parte;
          frag.append(mark);
        } else {
          frag.append(parte);
        }
      });
      no.replaceWith(frag);
    });
  }

  /* ---------- Trava de scroll e bloqueio de fundo (menu e lightbox) ---------- */
  let travas = 0;
  function travarScroll(travar) {
    const html = document.documentElement;
    travas = Math.max(0, travas + (travar ? 1 : -1));
    if (travas > 0 && !html.classList.contains("travado")) {
      const barra = window.innerWidth - html.clientWidth;
      if (barra > 0) document.body.style.paddingRight = barra + "px";
      html.classList.add("travado");
    } else if (travas === 0) {
      html.classList.remove("travado");
      document.body.style.paddingRight = "";
    }
  }

  function prenderFoco(e, container) {
    const focaveis = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && (document.activeElement === primeiro || !container.contains(document.activeElement))) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && (document.activeElement === ultimo || !container.contains(document.activeElement))) {
      e.preventDefault();
      primeiro.focus();
    }
  }

  /* ---------- CTAs fixos (barra mobile e botão flutuante desktop) ---------- */
  const ctaFixo = (function () {
    const barra = $("#barra-cta");
    const flutuante = $("#flutuante");
    const hero = $("#inicio");
    const estado = { passouHero: false, zonas: new Set(), bloqueios: 0 };

    function atualizar() {
      const liberado = estado.passouHero && estado.bloqueios === 0;
      // A barra some quando o formulário, o CTA final ou o rodapé estão na tela.
      barra.classList.toggle("visivel", liberado && estado.zonas.size === 0);
      flutuante.classList.toggle("visivel", liberado);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entrada]) => {
        estado.passouHero = !entrada.isIntersecting && entrada.boundingClientRect.top < 0;
        atualizar();
      }).observe(hero);

      const obsZonas = new IntersectionObserver((entradas) => {
        entradas.forEach((en) => (en.isIntersecting ? estado.zonas.add(en.target) : estado.zonas.delete(en.target)));
        atualizar();
      });
      $$("[data-sem-barra]").forEach((el) => obsZonas.observe(el));
    }

    return {
      bloquear(sim) {
        estado.bloqueios = Math.max(0, estado.bloqueios + (sim ? 1 : -1));
        atualizar();
      }
    };
  })();

  /* ---------- Header ---------- */
  function iniciarHeader() {
    const header = $("#header");
    let agendado = false;
    const atualizar = () => {
      header.classList.toggle("rolado", window.scrollY > 24);
      agendado = false;
    };
    window.addEventListener("scroll", () => {
      if (!agendado) {
        agendado = true;
        requestAnimationFrame(atualizar);
      }
    }, { passive: true });
    atualizar();

    // Destaca o item do menu da seção visível
    if (!("IntersectionObserver" in window)) return;
    const links = $$(".nav__lista a");
    const porId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.remove("ativo"));
        const link = porId.get(en.target.id);
        if (link) link.classList.add("ativo");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section").forEach((s) => obs.observe(s));
  }

  /* ---------- Menu mobile ---------- */
  function iniciarMenu() {
    const botao = $(".hamburguer");
    const menu = $("#menu-mobile");
    const header = $("#header");
    const fundo = [$("main"), $(".rodape")];
    let aberto = false;

    function abrir() {
      aberto = true;
      menu.classList.add("aberto");
      botao.setAttribute("aria-expanded", "true");
      botao.setAttribute("aria-label", "Fechar menu");
      fundo.forEach((el) => { el.inert = true; });
      travarScroll(true);
      ctaFixo.bloquear(true);
      setTimeout(() => { const l = $("a", menu); if (l) l.focus(); }, 60);
    }

    function fechar(devolverFoco) {
      if (!aberto) return;
      aberto = false;
      menu.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu");
      fundo.forEach((el) => { el.inert = false; });
      travarScroll(false);
      ctaFixo.bloquear(false);
      if (devolverFoco) botao.focus();
    }

    botao.addEventListener("click", () => (aberto ? fechar(true) : abrir()));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) fechar(false); });

    document.addEventListener("keydown", (e) => {
      if (!aberto) return;
      if (e.key === "Escape") fechar(true);
      if (e.key === "Tab") {
        // Foco preso entre o header e o menu
        const grupo = { contains: (el) => header.contains(el) || menu.contains(el) };
        const focaveis = $$("a[href], button", header).concat($$("a[href], button", menu))
          .filter((el) => el.offsetParent !== null);
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && (document.activeElement === primeiro || !grupo.contains(document.activeElement))) {
          e.preventDefault(); ultimo.focus();
        } else if (!e.shiftKey && (document.activeElement === ultimo || !grupo.contains(document.activeElement))) {
          e.preventDefault(); primeiro.focus();
        }
      }
    });

    window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => { if (e.matches) fechar(false); });
  }

  /* ---------- Fotos (WebP 800/1600 + JPG + placeholder) ---------- */
  function criarPlaceholder(texto) {
    const ph = document.createElement("span");
    ph.className = "foto__ph";
    ph.setAttribute("aria-hidden", "true");
    ph.innerHTML = '<svg><use href="#i-estrela"/></svg>';
    const legenda = document.createElement("span");
    legenda.textContent = texto;
    ph.append(legenda);
    return ph;
  }

  function criarPicture(src, alt, sizes, lazy) {
    const base = src.replace(/\.(jpe?g|png)$/i, "");
    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = base + "-800.webp 800w, " + base + "-1600.webp 1600w";
    source.sizes = sizes;
    picture.append(source);

    const img = document.createElement("img");
    if (lazy) img.loading = "lazy";
    img.decoding = "async";
    img.width = 800;
    img.height = 1000;
    img.alt = alt;
    img.onerror = () => window.jsFotoErro(img);
    picture.append(img);
    img.src = src; // por último, para o navegador já considerar o <source> WebP
    return picture;
  }

  /* ---------- Portfólio ---------- */
  function renderizarPortfolio() {
    const grade = $("#portfolio-grade");
    const total = CONFIG.portfolio.length;
    CONFIG.portfolio.forEach((item, i) => {
      // Com número ímpar de fotos, a primeira ocupa a largura toda no celular (ver style.css)
      const destaque = i === 0 && total % 2 === 1;
      const li = document.createElement("li");
      li.className = "revelar";

      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "portfolio__btn foto";
      botao.dataset.indice = i;
      botao.setAttribute("aria-label", "Ampliar foto " + (i + 1) + " de " + total + ": " + item.alt);
      botao.append(
        criarPlaceholder("Make " + pad(i + 1)),
        criarPicture(item.src, item.alt, "(min-width: 1200px) 390px, (min-width: 768px) 32vw, " + (destaque ? "100vw" : "50vw"), true)
      );
      if (item.posicao) $("img", botao).style.objectPosition = item.posicao;

      if (item.ocasiao) {
        const tag = document.createElement("span");
        tag.className = "portfolio__tag";
        tag.setAttribute("aria-hidden", "true");
        tag.textContent = item.ocasiao;
        botao.append(tag);
      }

      li.append(botao);
      grade.append(li);
    });
  }

  /* ---------- Lightbox ---------- */
  function iniciarLightbox() {
    const lb = $("#lightbox");
    const caixa = $("#lightbox-foto");
    const legenda = $("#lightbox-legenda");
    const contador = $("#lightbox-contador");
    const botaoFechar = $(".lightbox__fechar", lb);
    const fundo = [$("#header"), $("main"), $(".rodape"), $("#barra-cta"), $("#flutuante")];
    const total = CONFIG.portfolio.length;
    let atual = 0;
    let aberto = false;
    let gatilho = null;
    let timerTroca = null;

    function montar(i) {
      atual = (i + total) % total;
      const item = CONFIG.portfolio[atual];
      caixa.classList.remove("sem-foto", "carregada");
      const picture = criarPicture(item.src, item.alt, "(min-width: 800px) 760px, 100vw", false);
      const img = $("img", picture);
      img.addEventListener("load", () => caixa.classList.add("carregada"));
      caixa.replaceChildren(criarPlaceholder("Make " + pad(atual + 1)), picture);
      legenda.textContent = item.ocasiao || "";
      contador.textContent = (atual + 1) + " / " + total;
    }

    function ir(i) {
      // O índice muda na hora (cliques rápidos não se perdem); só a troca da imagem espera o fade.
      atual = (i + total) % total;
      contador.textContent = (atual + 1) + " / " + total;
      if (movimentoReduzido.matches) return montar(atual);
      caixa.classList.add("trocando");
      clearTimeout(timerTroca);
      timerTroca = setTimeout(() => {
        montar(atual);
        caixa.classList.remove("trocando");
      }, 180);
    }

    function abrir(i, origem) {
      gatilho = origem;
      aberto = true;
      montar(i);
      lb.hidden = false;
      void lb.offsetWidth; // força o reflow para a transição de opacidade
      lb.classList.add("aberto");
      fundo.forEach((el) => { el.inert = true; });
      travarScroll(true);
      ctaFixo.bloquear(true);
      botaoFechar.focus();
    }

    function fechar() {
      if (!aberto) return;
      aberto = false;
      lb.classList.remove("aberto");
      fundo.forEach((el) => { el.inert = false; });
      travarScroll(false);
      ctaFixo.bloquear(false);
      setTimeout(() => {
        if (!aberto) {
          lb.hidden = true;
          caixa.replaceChildren();
        }
      }, movimentoReduzido.matches ? 0 : 300);
      if (gatilho) gatilho.focus();
    }

    $("#portfolio-grade").addEventListener("click", (e) => {
      const botao = e.target.closest(".portfolio__btn");
      if (botao) abrir(Number(botao.dataset.indice), botao);
    });

    botaoFechar.addEventListener("click", fechar);
    $$(".lightbox__seta", lb).forEach((b) => b.addEventListener("click", () => ir(atual + Number(b.dataset.dir))));
    // Clique fora da foto fecha
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lightbox__figura") || e.target.classList.contains("lightbox__controles")) fechar();
    });

    document.addEventListener("keydown", (e) => {
      if (!aberto) return;
      if (e.key === "Escape") fechar();
      else if (e.key === "ArrowLeft") ir(atual - 1);
      else if (e.key === "ArrowRight") ir(atual + 1);
      else if (e.key === "Tab") prenderFoco(e, lb);
    });

    // Swipe no celular
    let x0 = null;
    let y0 = null;
    lb.addEventListener("touchstart", (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) ir(atual + (dx < 0 ? 1 : -1));
      x0 = y0 = null;
    }, { passive: true });
  }

  /* ---------- Serviços: pontos do carrossel (mobile) ---------- */
  function iniciarServicos() {
    const trilho = $("#servicos-trilho");
    const caixaPontos = $("#servicos-pontos");
    const cards = $$(".servico", trilho);

    cards.forEach((card, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ver serviço " + (i + 1) + " de " + cards.length + ": " + $(".servico__titulo", card).textContent);
      b.addEventListener("click", () => {
        trilho.scrollTo({
          left: card.offsetLeft - (trilho.clientWidth - card.offsetWidth) / 2,
          behavior: movimentoReduzido.matches ? "auto" : "smooth"
        });
      });
      caixaPontos.append(b);
    });
    const pontos = $$("button", caixaPontos);

    let agendado = false;
    function atualizar() {
      agendado = false;
      const centro = trilho.scrollLeft + trilho.clientWidth / 2;
      let ativo = 0;
      let menor = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centro);
        if (d < menor) { menor = d; ativo = i; }
      });
      pontos.forEach((p, i) => p.setAttribute("aria-current", i === ativo ? "true" : "false"));
    }
    trilho.addEventListener("scroll", () => {
      if (!agendado) { agendado = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  }

  /* ---------- Formulário "Monte seu pedido" ---------- */
  function dataISO(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function iniciarFormulario() {
    const form = $("#form-pedido");
    const nome = $("#f-nome");
    const ocasiao = $("#f-ocasiao");
    const data = $("#f-data");
    const hoje = dataISO(new Date());
    data.min = hoje;

    const regras = [
      [nome, () => (nome.value.trim().length < 2 ? "Me conta seu nome, para eu saber como te chamar." : "")],
      [ocasiao, () => (!ocasiao.value ? "Escolha a ocasião da sua make." : "")],
      [data, () => {
        if (data.validity.badInput) return "Data incompleta. Confira dia, mês e ano.";
        if (!data.value) return "Qual é a data do evento?";
        if (data.value < hoje) return "Essa data já passou. Escolha uma data a partir de hoje.";
        return "";
      }]
    ];

    function mostrarErro(campo, mensagem) {
      $("#" + campo.id + "-erro").textContent = mensagem;
      if (mensagem) campo.setAttribute("aria-invalid", "true");
      else campo.removeAttribute("aria-invalid");
    }

    // Ao corrigir, o erro some na hora
    regras.forEach(([campo, regra]) => {
      const evento = campo.tagName === "SELECT" || campo.type === "date" ? "change" : "input";
      campo.addEventListener(evento, () => {
        if (campo.getAttribute("aria-invalid") === "true") mostrarErro(campo, regra());
      });
      campo.addEventListener("blur", () => {
        if (campo.getAttribute("aria-invalid") === "true") mostrarErro(campo, regra());
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let primeiroInvalido = null;
      regras.forEach(([campo, regra]) => {
        const msg = regra();
        mostrarErro(campo, msg);
        if (msg && !primeiroInvalido) primeiroInvalido = campo;
      });
      if (primeiroInvalido) {
        primeiroInvalido.focus();
        return;
      }

      const [ano, mes, dia] = data.value.split("-");
      const horario = $("#f-horario").value;
      const localEl = $('input[name="local"]:checked', form);
      const obs = $("#f-obs").value.trim();

      const linhas = [
        "Oi, Júlia! Me chamo " + nome.value.trim() + " ✨",
        "Quero uma maquiagem para: " + ocasiao.value + ".",
        "Data: " + dia + "/" + mes + "/" + ano + "."
      ];
      if (horario) linhas.push("Horário: " + horario + " (aproximado).");
      if (localEl) linhas.push("Local: " + localEl.value + ".");
      if (obs) linhas.push("Obs: " + obs);

      const url = linkWhats(linhas.join("\n"));
      rastrear("Lead", { content_name: "formulario", ocasiao: ocasiao.value });
      rastrear("Contact", { content_name: "formulario", botao: "formulario" });

      const janela = window.open(url, "_blank");
      if (janela) janela.opener = null;
      else window.location.href = url;
    });
  }

  /* ---------- Dúvidas (accordion, um aberto por vez) ---------- */
  function iniciarFaq() {
    const botoes = $$(".faq__botao");
    const painel = (b) => document.getElementById(b.getAttribute("aria-controls"));
    botoes.forEach((botao) => {
      botao.addEventListener("click", () => {
        const abrir = botao.getAttribute("aria-expanded") !== "true";
        botoes.forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          painel(b).classList.remove("aberto");
        });
        if (abrir) {
          botao.setAttribute("aria-expanded", "true");
          painel(botao).classList.add("aberto");
        }
      });
    });
  }

  /* ---------- Depoimentos (somente se ativado e com depoimentos reais) ---------- */
  function iniciarDepoimentos() {
    const lista = CONFIG.depoimentos.filter((d) => d && (d.texto || d.foto));
    if (!CONFIG.mostrarDepoimentos || !lista.length) return;
    const ul = $("#depoimentos-lista");
    lista.slice(0, 3).forEach((d) => {
      const li = document.createElement("li");
      li.className = "revelar";
      const fig = document.createElement("figure");
      fig.className = "depoimento";
      if (d.foto) {
        const img = document.createElement("img");
        img.className = "depoimento__foto";
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = d.fotoAlt || "Depoimento de " + d.nome;
        img.src = d.foto;
        fig.append(img);
      }
      if (d.texto) {
        const bq = document.createElement("blockquote");
        const p = document.createElement("p");
        p.textContent = "“" + d.texto + "”";
        bq.append(p);
        fig.append(bq);
      }
      const cap = document.createElement("figcaption");
      const strong = document.createElement("strong");
      strong.textContent = d.nome || "";
      cap.append(strong, d.ocasiao || "");
      fig.append(cap);
      li.append(fig);
      ul.append(li);
    });
    $("#depoimentos").hidden = false;
  }

  /* ---------- Animações ---------- */
  function iniciarRevelar() {
    $$("[data-escalonar]").forEach((grupo) => {
      Array.from(grupo.children).forEach((el, i) => el.style.setProperty("--i", Math.min(i, 6)));
    });
    const elementos = $$(".revelar");
    if (!("IntersectionObserver" in window) || movimentoReduzido.matches) {
      elementos.forEach((el) => el.classList.add("visivel"));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("visivel");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    elementos.forEach((el) => obs.observe(el));
  }

  function iniciarBrilhos() {
    // Tempos aleatórios para as estrelinhas piscarem de forma natural
    $$(".glint").forEach((g) => {
      g.style.setProperty("--dur", (2.4 + Math.random() * 2.6).toFixed(2) + "s");
      g.style.setProperty("--atraso", (Math.random() * 3).toFixed(2) + "s");
    });
  }

  /* ---------- Cliques de conversão ---------- */
  function iniciarCliques() {
    document.addEventListener("click", (e) => {
      const whats = e.target.closest("[data-wa]");
      if (whats) {
        const origem = whats.dataset.origem || "desconhecido";
        rastrear("Contact", { content_name: origem, botao: origem });
        return;
      }
      const insta = e.target.closest("[data-instagram]");
      if (insta && typeof window.fbq === "function") {
        window.fbq("trackCustom", "CliqueInstagram", { botao: insta.dataset.origem || "desconhecido" });
      }
    });
  }

  /* ---------- Início ---------- */
  iniciarPixel();
  aplicarConfig();
  renderizarPortfolio();
  iniciarDepoimentos();
  destacarPendentes();
  iniciarHeader();
  iniciarMenu();
  iniciarLightbox();
  iniciarServicos();
  iniciarFormulario();
  iniciarFaq();
  iniciarRevelar();
  iniciarBrilhos();
  iniciarCliques();
})();
