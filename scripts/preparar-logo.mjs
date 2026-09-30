// Prepara tudo o que depende do logo, a partir de assets/img/logo.png:
//   - logo.png otimizado (480px). O arquivo original é guardado como logo-original.png
//   - og-image.jpg (1200x630): logo sobre o fundo escuro da marca, com glow rose
//   - favicon.png (192px) e apple-touch-icon.png (180px): recorte do monograma "JS"
//
// Uso (dentro da pasta scripts):  npm run logo
//
// O favicon usa o recorte definido em RECORTE_MONOGRAMA (frações do tamanho do logo).
// Depois de rodar, abra assets/img/favicon.png: se o "JS" não estiver bem enquadrado,
// ajuste os números abaixo e rode de novo.

import sharp from "sharp";
import { access, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RECORTE_MONOGRAMA = { x: 0.22, y: 0.12, largura: 0.56 }; // x/y = canto superior esquerdo
const FUNDO = "#140E0F";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(RAIZ, "assets/img");
const LOGO = path.join(IMG, "logo.png");
const ORIGINAL = path.join(IMG, "logo-original.png");

const existe = (f) => access(f).then(() => true, () => false);

if (!(await existe(LOGO))) {
  console.error("Não encontrei assets/img/logo.png. Coloque o logo (PNG com fundo transparente) e rode de novo.");
  process.exit(1);
}

// Trabalha sempre a partir do original em alta resolução.
// Um logo.png que não seja 480x480 é um logo novo colocado por você: vira o novo original.
// (Se trocar o logo por outro de exatamente 480x480, apague logo-original.png antes.)
const atual = await sharp(LOGO).metadata();
if (!(await existe(ORIGINAL)) || atual.width !== 480 || atual.height !== 480) {
  await copyFile(LOGO, ORIGINAL);
}
const original = sharp(ORIGINAL).ensureAlpha();
const { width, height } = await original.metadata();
const lado = Math.min(width, height);

// 1) Logo otimizado para a página (aparece com 44px a 120px; 480px cobre telas 4x)
const logoInfo = await sharp(ORIGINAL)
  .resize(480, 480, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, palette: true, quality: 95 })
  .toFile(LOGO);
console.log(`  ok  assets/img/logo.png (480x480, ${(logoInfo.size / 1024).toFixed(0)} KB)`);

// 2) og-image.jpg
const glow = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="55%">
        <stop offset="0" stop-color="#DDA084" stop-opacity=".26"/>
        <stop offset=".55" stop-color="#DDA084" stop-opacity=".06"/>
        <stop offset="1" stop-color="#DDA084" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="${FUNDO}"/>
    <rect width="1200" height="630" fill="url(#g)"/>
  </svg>`);
const logoOg = await sharp(ORIGINAL).resize(500, 500, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
await sharp(glow)
  .composite([{ input: logoOg, gravity: "center" }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(IMG, "og-image.jpg"));
console.log("  ok  assets/img/og-image.jpg (1200x630)");

// 3) Favicon e apple-touch-icon a partir do monograma
const recorte = {
  left: Math.round(RECORTE_MONOGRAMA.x * width),
  top: Math.round(RECORTE_MONOGRAMA.y * height),
  width: Math.round(RECORTE_MONOGRAMA.largura * lado),
  height: Math.round(RECORTE_MONOGRAMA.largura * lado)
};
const monograma = await sharp(ORIGINAL).extract(recorte).toBuffer();

async function icone(tamanho, arquivo, redondo) {
  const miolo = Math.round(tamanho * 0.86);
  const mono = await sharp(monograma).resize(miolo, miolo, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const forma = redondo
    ? `<circle cx="${tamanho / 2}" cy="${tamanho / 2}" r="${tamanho / 2}" fill="${FUNDO}"/>`
    : `<rect width="${tamanho}" height="${tamanho}" fill="${FUNDO}"/>`;
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tamanho}" height="${tamanho}">${forma}</svg>`))
    .composite([{ input: mono, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(IMG, arquivo));
  console.log(`  ok  assets/img/${arquivo} (${tamanho}x${tamanho})`);
}

await icone(192, "favicon.png", true);
await icone(180, "apple-touch-icon.png", false);

console.log("\nPronto! Confira o favicon.png: se o monograma estiver cortado, ajuste RECORTE_MONOGRAMA no topo deste arquivo.");
