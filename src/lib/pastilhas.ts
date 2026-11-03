/**
 * Paleta e desenho das pastilhas usadas nas animações em canvas.
 * Cada cor vira um "carimbo" pré-desenhado (canto arredondado + luz de cima),
 * e cada quadro só carimba: é o jeito mais barato de desenhar centenas de peças.
 */
export const CORES = {
  tinta: '#17161B',
  tinta2: '#2A2830',
  papel: '#F6F5F2',
  creme: '#FFF6EE',
  coral: '#FF5B3A',
  coralClaro: '#FF8A5C',
  coralFundo: '#F0482A',
  vermelho: '#D23C1C',
  vinho: '#A8241A',
  ambar: '#F5B544',
  ambarClaro: '#FAD38A',
  campo: '#2F7D4E',
  campoClaro: '#4E9E62',
  ceu: '#7FA8D9',
  ceuEscuro: '#3E5F8F',
  areia: '#E9DCC8',
  rosa: '#F3A6A0',
} as const

export const TONS_DO_ARROBA = [
  CORES.coral,
  CORES.coral,
  CORES.coral,
  CORES.coralClaro,
  CORES.coralFundo,
  CORES.vermelho,
  CORES.ambar,
  CORES.vinho,
]

export const TONS_DO_AMBIENTE = [
  CORES.tinta,
  CORES.ambar,
  CORES.campo,
  CORES.ceu,
  CORES.coralClaro,
  CORES.areia,
  CORES.rosa,
  CORES.tinta2,
]

const BASE = 64

/** Desenha um retângulo de cantos arredondados (com fallback para navegadores antigos). */
export function retanguloArredondado(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Cria um carimbo de pastilha para uma cor. */
export function criarCarimbo(cor: string, brilho = 0.22): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = BASE
  c.height = BASE
  const ctx = c.getContext('2d')
  if (!ctx) return c
  const r = BASE * 0.24
  retanguloArredondado(ctx, 1, 1, BASE - 2, BASE - 2, r)
  ctx.fillStyle = cor
  ctx.fill()
  // Luz de cima e sombra leve embaixo, como pastilha de vidro.
  const g = ctx.createLinearGradient(0, 0, 0, BASE)
  g.addColorStop(0, `rgba(255,255,255,${brilho})`)
  g.addColorStop(0.45, 'rgba(255,255,255,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.12)')
  ctx.fillStyle = g
  ctx.fill()
  return c
}

export function criarCarimbos(cores: readonly string[]) {
  const mapa = new Map<string, HTMLCanvasElement>()
  for (const cor of cores) if (!mapa.has(cor)) mapa.set(cor, criarCarimbo(cor))
  return mapa
}
