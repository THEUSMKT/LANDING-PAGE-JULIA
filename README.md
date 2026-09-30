# Julia Studio Makeup — landing page

Landing page da **Júlia Cardoso**, maquiadora. É um site estático em HTML, CSS e JavaScript puro, sem build.
Abre direto no navegador e pode ser publicado na Netlify do jeito que está.

```
index.html              página (textos, SEO, dados estruturados)
css/style.css           visual (cores e fontes no topo, em :root)
js/main.js              CONFIG (WhatsApp, Instagram, cidade, portfólio...) + interações
assets/img/             logo, fotos da Júlia, og-image, favicon
assets/img/portfolio/   fotos dos trabalhos (make-01.jpg ... make-06.jpg)
scripts/                ferramentas locais de imagem (não vão para o ar)
netlify.toml            configuração da Netlify (sem build, cache das imagens)
```

## Editar o básico: o `CONFIG`

Fica no topo do `js/main.js`. Todos os links de WhatsApp e Instagram, a cidade, os preços, o Pixel
e o portfólio saem dali.

```js
whatsapp: "5511987654321",                 // 55 + DDD + número, só números
instagram: "https://instagram.com/usuario",
cidade: "São Paulo",
mostrarPrecos: false,                      // true = "a partir de R$ ..." (valores em "precos")
mostrarDepoimentos: false,                 // true = mostra a seção (só com depoimentos reais)
metaPixelId: "",                           // ID do Pixel. Vazio = desligado
```

As mensagens prontas do WhatsApp ficam em `CONFIG.mensagens`.

> O `<head>` do `index.html` (título, descrição, Open Graph e JSON-LD) precisa ser editado à mão.
> O WhatsApp, o Instagram e o Google leem essa parte sem rodar JavaScript.

## Adicionar as fotos

1. **Coloque os arquivos** com estes nomes exatos:
   - `assets/img/logo.png` (logo circular, fundo transparente)
   - `assets/img/julia-1.jpg` (foto do topo) e `assets/img/julia-2.jpg` (seção "Sobre")
   - `assets/img/portfolio/make-01.jpg` até `make-06.jpg`

   Use fotos verticais (4:5), com 1600px de largura ou mais. Nada de banco de imagens no portfólio.
2. **Rode os scripts** (precisa ter o [Node.js](https://nodejs.org) instalado):
   ```bash
   cd scripts
   npm install        # só na primeira vez
   npm run otimizar   # gera as versões WebP 800px e 1600px das fotos
   npm run logo       # otimiza o logo e gera og-image.jpg, favicon.png e apple-touch-icon.png
   ```
   Depois, abra o `assets/img/favicon.png`. Se o monograma "JS" estiver mal enquadrado, ajuste
   `RECORTE_MONOGRAMA` no topo do `scripts/preparar-logo.mjs` e rode `npm run logo` de novo.
3. **Revise os textos alternativos**: em `CONFIG.portfolio` (no `js/main.js`), troque cada
   `[DESCREVER A FOTO]` por uma descrição curta da make (ex.: "olho esfumado marrom e pele iluminada").

Para ter mais fotos no portfólio, salve como `make-07.jpg`, inclua uma linha em `CONFIG.portfolio`
e rode `npm run otimizar`.

Enquanto uma foto não existir, a página mostra um placeholder elegante no lugar dela. Se o WebP ainda
não foi gerado, o navegador usa o JPG.

## Publicar na Netlify

1. Em [app.netlify.com](https://app.netlify.com), clique em **Add new site → Import an existing project**,
   escolha **GitHub** e selecione este repositório.
2. Deixe **Build command** vazio e **Publish directory** como `.` (o `netlify.toml` já faz isso).
   Clique em **Deploy**.
3. Em **Domain management**, troque o nome do site (ex.: `juliastudiomakeup.netlify.app`) ou ligue um
   domínio próprio. Depois atualize os `[SEU-DOMINIO]` do `<head>` do `index.html`.

Daqui em diante, cada alteração enviada para o GitHub é publicada sozinha.
(Alternativa sem GitHub: arraste a pasta do projeto em [app.netlify.com/drop](https://app.netlify.com/drop).
Antes, apague `scripts/node_modules`.)

## Rastreamento

Com `CONFIG.metaPixelId` preenchido:

| Evento | Quando | Parâmetros |
|---|---|---|
| `PageView` | ao carregar | — |
| `Contact` | todo clique em botão de WhatsApp | `botao` e `content_name`: `header`, `menu-mobile`, `hero`, `portfolio`, `servico-festa`, `servico-noiva`, `servico-madrinha-formanda`, `servico-15-anos`, `servico-ensaio`, `cta-final`, `rodape`, `barra-mobile`, `flutuante`, `formulario` |
| `Lead` | envio do formulário | `content_name: formulario`, `ocasiao` |
| `CliqueInstagram` (custom) | clique em link do Instagram | `botao` |

O envio do formulário também abre o WhatsApp, por isso dispara `Lead` **e** `Contact`. Assim o `Contact`
conta todas as conversas iniciadas.

Os eventos também vão para o `dataLayer` (GTM), se ele existir. Há um bloco comentado para o **GA4**
em `js/main.js` (procure "GA4"). É só descomentar e colocar o ID.

## Checklist do que falta preencher

A página destaca tudo que ainda está `[ENTRE COLCHETES]` (sublinhado tracejado), para facilitar a revisão.
O destaque some quando o texto é preenchido.

**No `js/main.js` (CONFIG)**
- [ ] `whatsapp`: número com DDD
- [ ] `instagram`: usuário
- [ ] `cidade`: cidade/região
- [ ] `metaPixelId` (quando for rodar anúncios)
- [ ] `precos`: valores (só se `mostrarPrecos: true`)
- [ ] `portfolio`: `[DESCREVER A FOTO]` nas 6 fotos, e a ocasião certa de cada uma
- [ ] `depoimentos`: somente depoimentos reais, e então `mostrarDepoimentos: true`

**No `<head>` do `index.html`**
- [ ] `[CIDADE]` no `<title>`, na meta description, no og:title e no twitter:title
- [ ] `[SEU-DOMINIO]` em og:url, og:image, twitter:image e no JSON-LD (e descomentar o canonical)
- [ ] JSON-LD: `telephone`, `areaServed`, `addressLocality`, `[UF]`, `sameAs` (Instagram)

**Textos para confirmar com a Júlia (`index.html`)**
- [ ] Sobre: `[HISTÓRIA DA JÚLIA]` e o texto todo (`[CONFIRMAR COM A JÚLIA]`)
- [ ] Diferencial "Feita para durar": técnicas de fixação `[CONFIRMAR]`
- [ ] Diferencial "Higiene em primeiro lugar": `[CONFIRMAR]`
- [ ] Serviços: "Atendimento no estúdio ou a domicílio" `[CONFIRMAR]`
- [ ] Formulário: opção "A domicílio" `[CONFIRMAR]` (se ela não atende a domicílio, remover a opção)
- [ ] Dúvidas: tempo da make (`[TEMPO]` social e noiva)
- [ ] Dúvidas: regiões atendidas a domicílio e taxa de deslocamento
- [ ] Dúvidas: cílios inclusos ou à parte
- [ ] Dúvidas: duração da make (técnicas de fixação)
- [ ] Dúvidas: como reservar (sinal/condição de reserva)
- [ ] Dúvidas: formas de pagamento

**Imagens**
- [ ] `logo.png`, `julia-1.jpg`, `julia-2.jpg`, `make-01.jpg` a `make-06.jpg`
- [ ] Rodar `npm run otimizar` e `npm run logo`. O `og-image.jpg` e o `favicon.png` atuais são provisórios,
      feitos com um monograma "JS". O `logo-provisorio.png` só aparece enquanto o `logo.png` não existir.
