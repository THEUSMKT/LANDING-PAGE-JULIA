# Julia Studio Makeup — landing page

Landing page da **Julia Cardoso**, maquiadora. É um site estático em HTML, CSS e JavaScript puro, sem build.
Abre direto no navegador e é publicado no **GitHub Pages**, no domínio próprio:
**https://juliamakeup.com.br/**

```
index.html              página (textos, SEO, dados estruturados)
css/style.css           visual (cores e fontes no topo, em :root)
js/main.js              CONFIG (WhatsApp, Instagram, cidade, portfólio...) + interações
assets/img/             logo, fotos da Julia, og-image, favicon
assets/img/portfolio/   fotos dos trabalhos (make-01.jpg, make-02.jpg...)
scripts/                ferramentas de imagem (rodam sozinhas na publicação; não vão para o ar)
.github/workflows/      publicação automática no GitHub Pages
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

## Publicar no GitHub Pages (uma vez só)

1. No GitHub, abra o repositório e vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**. Não precisa salvar mais nada.
3. Vá na aba **Actions**, clique em **Publicar site → Run workflow** e aguarde o círculo ficar verde
   (cerca de 1 minuto). O endereço aparece no próprio resultado e em **Settings → Pages**.

Daí em diante, **toda alteração na branch `main` é publicada sozinha** em cerca de 1 minuto.
Se algo der errado, a execução aparece com um X vermelho na aba **Actions** e o site continua com a
versão anterior no ar.

## Domínio próprio (juliamakeup.com.br)

O domínio foi registrado no [Registro.br](https://registro.br) e aponta para o GitHub Pages:

1. **DNS no Registro.br** (Painel → juliamakeup.com.br → DNS → editar zona, no modo avançado):

   | Tipo | Nome | Valor |
   |---|---|---|
   | A | *(em branco: o próprio juliamakeup.com.br)* | `185.199.108.153` |
   | A | *(em branco)* | `185.199.109.153` |
   | A | *(em branco)* | `185.199.110.153` |
   | A | *(em branco)* | `185.199.111.153` |
   | CNAME | `www` | `theusmkt.github.io` |

2. **GitHub**: Settings → Pages → Custom domain → `juliamakeup.com.br` → Save. Quando aparecer
   "DNS check successful", marque **Enforce HTTPS**.

O endereço antigo (`theusmkt.github.io/LANDING-PAGE-JULIA/`) passa a redirecionar sozinho para o domínio.
Se o endereço mudar um dia, troque-o no `<head>` do `index.html`, no `sitemap.xml`, no `robots.txt` e no `CNAME`.

## Adicionar as fotos

1. **Suba os arquivos pelo site do GitHub**: abra a pasta certa no repositório, clique em
   **Add file → Upload files**, arraste as fotos e clique em **Commit changes**. Use estes nomes exatos:
   - `assets/img/logo.png` (já está no repositório; para trocar, suba outro PNG com fundo transparente)
   - `assets/img/julia-1.jpg` (foto do topo) e `assets/img/julia-2.jpg` (seção "Sobre"). Já estão no ar;
     para trocar, suba outra com o mesmo nome
   - `assets/img/portfolio/make-04.jpg`, `make-05.jpg`... (já existem `make-01` a `make-03`)

   Use fotos verticais (4:5), com 1600px de largura ou mais. Nada de banco de imagens no portfólio.
2. **Espere a publicação automática** (aba **Actions**). Ela gera as versões WebP de 800px e 1600px
   das fotos e, a partir do `logo.png`, o logo otimizado, o `logo-pequeno.png` do header, a
   `og-image.jpg`, o `favicon.png` e o `apple-touch-icon.png`. Se um dia trocar o logo, confira o
   favicon: o recorte do monograma "JS" fica em `RECORTE_MONOGRAMA`, no topo do
   `scripts/preparar-logo.mjs` (dá para editar pelo próprio GitHub, no ícone de lápis).
3. **Inclua uma linha por foto nova** em `CONFIG.portfolio` (no `js/main.js`), com a ocasião e uma
   descrição curta da make (ex.: "olho esfumado marrom e pele iluminada"). Use as linhas que já estão lá
   como modelo. `posicao` ajusta o enquadramento da miniatura, se o rosto ficar cortado.

Quantidade: com número ímpar de fotos, a primeira ocupa a largura toda no celular. No computador são
3 por linha, então 3, 6 ou 9 fotos fecham a grade certinho.

Enquanto uma foto não existir, a página mostra um placeholder elegante no lugar dela. Se o WebP ainda
não foi gerado (por exemplo, abrindo o `index.html` direto no computador), o navegador usa o JPG.

<details>
<summary>Rodar os scripts de imagem no computador (opcional)</summary>

Precisa do [Node.js](https://nodejs.org):

```bash
cd scripts
npm install        # só na primeira vez
npm run otimizar   # versões WebP 800px e 1600px das fotos
npm run logo       # logo otimizado, og-image.jpg, favicon.png e apple-touch-icon.png
```

Os WebP não entram no Git (estão no `.gitignore`), porque a publicação gera de novo.
</details>

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
- [x] `whatsapp`: (51) 99196-2607
- [x] `instagram`: @juliastudio.art
- [x] `cidade`: São Leopoldo
- [ ] `metaPixelId` (quando for rodar anúncios)
- [ ] `precos`: valores (só se `mostrarPrecos: true`)
- [x] `portfolio`: ocasiões confirmadas (make-01 Ensaio, make-02 Festa, make-03 Social)
- [ ] `depoimentos`: somente depoimentos reais, e então `mostrarDepoimentos: true`

**No `<head>` do `index.html`**
- [x] Cidade no `<title>`, na meta description, no og:title e no twitter:title
- [x] Domínio próprio `juliamakeup.com.br` no `<head>`, sitemap e robots (falta só o DNS e o Custom domain,
      ver "Domínio próprio")
- [x] JSON-LD: telefone, São Leopoldo/RS e Instagram (sem endereço, de propósito)

**Textos para confirmar com a Julia (`index.html`)**
- [x] Sobre: texto com a motivação da Julia
- [x] Diferencial "Feita para durar"
- [x] Diferencial "Higiene em primeiro lugar"
- [x] Atendimento: com hora marcada em São Leopoldo ou no local do evento (nunca citar a casa dela)
- [ ] Dúvidas: tempo da make (`[TEMPO]` social e noiva)
- [ ] Dúvidas: cílios inclusos ou à parte
- [ ] Dúvidas: duração da make (técnicas de fixação)
- [ ] Dúvidas: como reservar (sinal/condição de reserva)
- [ ] Dúvidas: formas de pagamento

**Imagens**
- [x] Logo (`logo.png`, recortado com fundo transparente), og-image, favicon e apple-touch-icon
- [x] Fotos da Julia (`julia-1.jpg`, `julia-2.jpg`) e 3 fotos de clientes no portfólio
- [ ] Mais fotos de clientes (opcional), de preferência o arquivo original, em pé e com boa resolução
