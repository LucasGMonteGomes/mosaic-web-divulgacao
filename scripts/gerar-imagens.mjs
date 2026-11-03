// Gera os PNGs e o favicon.ico a partir dos SVGs de assets-fonte/.
// Uso: npm run assets  (só precisa rodar quando um SVG de assets-fonte mudar;
// os arquivos gerados ficam em public/ e vão para o repositório).
import { Resvg } from '@resvg/resvg-js'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const fonte = (nome) => readFileSync(join(raiz, 'assets-fonte', nome))
const destino = (nome) => join(raiz, 'public', nome)

function png(svg, largura) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: largura }, background: 'rgba(0,0,0,0)' }).render().asPng()
}

const saidas = [
  ['icone.svg', 'icone-192.png', 192],
  ['icone.svg', 'icone-512.png', 512],
  ['icone-maskable.svg', 'icone-maskable-512.png', 512],
  ['icone-quadrado.svg', 'apple-touch-icon.png', 180],
  ['og-image.svg', 'og-image.png', 1200],
]

for (const [svg, arquivo, largura] of saidas) {
  writeFileSync(destino(arquivo), png(fonte(svg), largura))
  console.log(`gerado: public/${arquivo} (${largura}px)`)
}

// Banner do README (também serve de imagem de prévia do repositório no GitHub, 1280 x 640)
mkdirSync(join(raiz, '.github', 'assets'), { recursive: true })
writeFileSync(join(raiz, '.github', 'assets', 'banner.png'), png(fonte('banner.svg'), 1280))
console.log('gerado: .github/assets/banner.png (1280px)')

// favicon.ico com 16, 32 e 48 px (PNG dentro do ICO, aceito por todos os navegadores atuais)
const tamanhos = [16, 32, 48]
const imagens = tamanhos.map((t) => png(fonte('favicon-pequeno.svg'), t))
const cabecalho = Buffer.alloc(6 + 16 * imagens.length)
cabecalho.writeUInt16LE(0, 0)
cabecalho.writeUInt16LE(1, 2)
cabecalho.writeUInt16LE(imagens.length, 4)
let posicao = cabecalho.length
imagens.forEach((img, i) => {
  const base = 6 + 16 * i
  cabecalho.writeUInt8(tamanhos[i], base)
  cabecalho.writeUInt8(tamanhos[i], base + 1)
  cabecalho.writeUInt8(0, base + 2)
  cabecalho.writeUInt8(0, base + 3)
  cabecalho.writeUInt16LE(1, base + 4)
  cabecalho.writeUInt16LE(32, base + 6)
  cabecalho.writeUInt32LE(img.length, base + 8)
  cabecalho.writeUInt32LE(posicao, base + 12)
  posicao += img.length
})
writeFileSync(destino('favicon.ico'), Buffer.concat([cabecalho, ...imagens]))
console.log('gerado: public/favicon.ico (16, 32 e 48 px)')
