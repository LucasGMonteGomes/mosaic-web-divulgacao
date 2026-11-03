import type { NomeDaCena } from '../content/site'
import { criarAleatorio, type Aleatorio } from './aleatorio'
import { criarMedidorDoTraco } from './arroba'
import { CORES as C, criarCarimbos } from './pastilhas'

/**
 * Cenas em pastilhas: a "fotografia" provisória da Mosaicofy.
 * Cada cena é uma função que diz a cor da pastilha em cada ponto (u, v de 0 a 1).
 * As cores vêm de uma paleta fechada, como num mosaico de verdade, e os degradês
 * são feitos misturando pastilhas vizinhas (pontilhado).
 * Podem ser trocadas por fotos reais pelo campo `imagem` em src/content/site.ts.
 */

type Ponto = { u: number; v: number; aspecto: number; r: Aleatorio }
type Cena = { rejunte: string; pintar: (p: Ponto) => string }

/** Escolhe uma cor de uma escala com pontilhado (mistura entre tons vizinhos). */
function escala(t: number, cores: string[], r: Aleatorio, ruido = 0.5) {
  const x = Math.min(0.9999, Math.max(0, t)) * (cores.length - 1)
  const i = Math.floor(x)
  const resto = x - i + (r.proximo() - 0.5) * ruido
  return cores[Math.min(cores.length - 1, Math.max(0, resto > 0.5 ? i + 1 : i))]
}

const dist = (p: Ponto, cx: number, cy: number) => Math.hypot((p.u - cx) * p.aspecto, p.v - cy)

const CENAS: Record<NomeDaCena, Cena> = {
  arquibancada: {
    rejunte: '#3A3841',
    pintar: (p) => {
      const { u, v, r } = p
      if (v > 0.72) {
        if (Math.abs(v - 0.86) < 0.012) return C.creme
        return Math.floor(v * 22) % 2 ? C.campo : C.campoClaro
      }
      if (v > 0.685) return Math.abs(v - 0.7) < 0.008 ? C.coral : C.tinta
      // Bandeirão listrado na diagonal.
      if (u > 0.06 && u < 0.46 && v > 0.1 && v < 0.42) return Math.floor((u + v) * 14) % 2 ? C.coral : C.creme
      if (u > 0.62 && u < 0.9 && v > 0.24 && v < 0.46) return Math.floor((u - v) * 12 + 20) % 2 ? C.ambar : C.tinta
      if (r.proximo() < 0.03) return '#FFFFFF'
      const fileira = Math.floor(v * 16) % 3 === 0
      return r.escolher(fileira ? [C.tinta, C.tinta2, C.vinho] : [C.tinta, C.tinta2, C.coral, C.ambar, C.creme, C.ceu, C.rosa, C.vinho])
    },
  },
  almoco: {
    rejunte: '#C9B9A6',
    pintar: (p) => {
      const { r } = p
      const d1 = dist(p, 0.34, 0.36)
      const d2 = dist(p, 0.66, 0.68)
      const copo = dist(p, 0.8, 0.2)
      if (copo < 0.07) return copo > 0.05 ? '#FFFFFF' : r.escolher([C.ceu, '#A9C6E8'])
      if (d1 < 0.25) {
        if (d1 > 0.21) return '#FFFFFF'
        if (d1 > 0.19) return C.creme
        const ang = Math.atan2(p.v - 0.36, (p.u - 0.34) * p.aspecto)
        if (ang < -1.2) return r.escolher([C.creme, '#FFFFFF', C.areia])
        if (ang < 0.6) return r.escolher([C.vinho, C.tinta2, C.vinho])
        if (ang < 2.0) return r.escolher([C.campo, C.campoClaro, C.campoClaro])
        return r.escolher([C.ambar, C.ambarClaro])
      }
      if (d2 < 0.24) {
        if (d2 > 0.2) return '#FFFFFF'
        if (d2 > 0.18) return C.creme
        if (d2 < 0.07) return r.escolher([C.vermelho, C.coral])
        return r.escolher([C.ambar, C.ambarClaro, C.ambar])
      }
      // Talheres
      if (Math.abs(p.u - 0.08) < 0.018 && p.v > 0.2 && p.v < 0.6) return '#B8B2AE'
      // Toalha xadrez
      const xadrez = (Math.floor(p.u * 8) + Math.floor(p.v * 10)) % 2
      return xadrez ? (r.proximo() < 0.9 ? C.coral : C.coralClaro) : r.proximo() < 0.92 ? C.creme : C.areia
    },
  },
  'por-do-sol': {
    rejunte: '#5B2A24',
    pintar: (p) => {
      const { u, v, r } = p
      const horizonte = 0.6
      if (v < horizonte) {
        const sol = dist(p, 0.5, 0.5)
        if (sol < 0.14) return sol < 0.1 ? C.creme : C.ambarClaro
        return escala(v / horizonte, [C.vinho, C.vermelho, C.coral, C.coralClaro, C.ambar, C.ambarClaro], r, 0.8)
      }
      const fundo = (v - horizonte) / (1 - horizonte)
      const largura = 0.16 * (1 - fundo * 0.6)
      if (Math.abs(u - 0.5) < largura && r.proximo() < 0.62 - fundo * 0.3)
        return r.escolher([C.ambar, C.ambarClaro, C.coralClaro])
      return escala(fundo, [C.ceuEscuro, '#2E4468', C.tinta2], r, 0.9)
    },
  },
  noite: {
    rejunte: '#0E0D12',
    pintar: (p) => {
      const { r } = p
      const luzes: [number, number, number, string][] = [
        [0.24, 0.22, 0.16, C.coral],
        [0.7, 0.18, 0.12, C.ambar],
        [0.52, 0.48, 0.2, C.rosa],
        [0.2, 0.7, 0.13, C.ceu],
        [0.8, 0.66, 0.17, C.coralClaro],
        [0.46, 0.86, 0.1, C.ambarClaro],
      ]
      for (const [cx, cy, raio, cor] of luzes) {
        const d = dist(p, cx, cy)
        const borda = raio * (0.82 + r.proximo() * 0.3)
        if (d < borda) return d > raio * 0.86 ? C.creme : cor
      }
      // Rastro da foto tremida
      if (Math.abs(p.v - (0.95 - p.u * 0.9)) < 0.02 && r.proximo() < 0.7) return C.ambarClaro
      return r.escolher([C.tinta, C.tinta, C.tinta2, '#2B2440'])
    },
  },
  pelada: {
    rejunte: '#1F5435',
    pintar: (p) => {
      const { u, v, r, aspecto } = p
      const jogadores: [number, number, string][] = [
        [0.3, 0.2, C.coral], [0.62, 0.3, C.coral], [0.42, 0.42, C.coral], [0.2, 0.36, C.coral], [0.5, 0.1, C.coral],
        [0.58, 0.6, C.ceu], [0.34, 0.66, C.ceu], [0.72, 0.74, C.ceu], [0.46, 0.8, C.ceu], [0.5, 0.92, C.ceu],
      ]
      const passo = 1 / 26
      for (const [x, y, cor] of jogadores) {
        if (Math.abs(u - x) < passo * 0.9 && Math.abs(v - y) < (passo * aspecto) / 1.5) return cor
      }
      if (dist(p, 0.47, 0.47) < 0.022) return '#FFFFFF'
      const linha = 0.016
      const dentro = u > 0.07 && u < 0.93 && v > 0.05 && v < 0.95
      const bordaX = Math.abs(u - 0.07) < linha || Math.abs(u - 0.93) < linha
      const bordaY = Math.abs(v - 0.05) < linha * 0.8 || Math.abs(v - 0.95) < linha * 0.8
      if ((bordaX && v > 0.05 && v < 0.95) || (bordaY && u > 0.07 && u < 0.93)) return C.creme
      if (dentro && Math.abs(v - 0.5) < linha * 0.7) return C.creme
      const circulo = dist(p, 0.5, 0.5)
      if (Math.abs(circulo - 0.15) < 0.014) return C.creme
      const area = u > 0.3 && u < 0.7 && (Math.abs(v - 0.16) < linha * 0.7 || Math.abs(v - 0.84) < linha * 0.7)
      const areaLados = (Math.abs(u - 0.3) < linha || Math.abs(u - 0.7) < linha) && (v < 0.16 || v > 0.84) && dentro
      if (area || areaLados) return C.creme
      void r
      return Math.floor(u * 9) % 2 ? C.campo : C.campoClaro
    },
  },
  chuva: {
    rejunte: '#2C3A52',
    pintar: (p) => {
      const { u, v, r } = p
      if (Math.abs(u - 0.5) < 0.022 || Math.abs(v - 0.46) < 0.016) return C.tinta
      if (u < 0.035 || u > 0.965 || v < 0.03 || v > 0.97) return C.tinta
      const luz = dist(p, 0.74, 0.74)
      if (luz < 0.2 && r.proximo() < 1 - luz * 3.2) return luz < 0.08 ? C.ambarClaro : C.ambar
      if (r.proximo() < 0.07) return r.escolher([C.ceu, '#A9C6E8', C.creme])
      return escala(v, ['#3E5F8F', '#4D6E9C', '#5F7FA8', '#4D6E9C'], r, 0.9)
    },
  },
  hashtag: {
    rejunte: '#B8321A',
    pintar: (p) => {
      const { u, v, r } = p
      const inclina = (0.5 - v) * 0.14
      const barraV = (x: number) => Math.abs(u - (x + inclina)) < 0.065 && v > 0.16 && v < 0.84
      const barraH = (y: number) => Math.abs(v - y) < 0.055 && u > 0.18 && u < 0.82
      if (barraV(0.4) || barraV(0.62) || barraH(0.39) || barraH(0.62)) return r.proximo() < 0.94 ? C.creme : '#FFFFFF'
      if (v < 0.14 && r.proximo() < 0.18 - v) return C.ambarClaro
      return r.escolher([C.coral, C.coral, C.coralFundo, C.coralClaro])
    },
  },
  voce: {
    rejunte: '#E3D7C8',
    pintar: (() => {
      let medir: ((x: number, y: number) => number) | null = null
      return (p: Ponto) => {
        medir ??= criarMedidorDoTraco()
        const { u, v, r, aspecto } = p
        // O @ ocupa ~72% da largura, centralizado.
        const escalaX = 285 / 0.72
        const x = 254.7 + (u - 0.5) * escalaX
        const y = 261 + ((v - 0.5) * escalaX) / aspecto
        const d = medir(x, y)
        if (d < 21) return d < 7 ? r.escolher([C.coral, C.coral, C.coralFundo]) : r.escolher([C.coral, C.coralClaro, C.vermelho, C.ambar])
        return r.escolher([C.creme, C.creme, C.papel, C.areia])
      }
    })(),
  },
}

/**
 * Desenha a cena num canvas, ocupando o tamanho atual do elemento.
 * `lado` é o tamanho aproximado de cada pastilha em px de tela.
 */
export function desenharCena(canvas: HTMLCanvasElement, nome: NomeDaCena, lado = 14) {
  const r = canvas.getBoundingClientRect()
  if (r.width === 0 || r.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(r.width * dpr)
  canvas.height = Math.round(r.height * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cena = CENAS[nome]
  const colunas = Math.max(12, Math.round(r.width / lado))
  const celula = r.width / colunas
  const linhas = Math.ceil(r.height / celula)
  const aspecto = r.width / r.height
  const rnd = criarAleatorio(nome.length * 977 + colunas)
  const desenho = criarAleatorio(31)

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = cena.rejunte
  ctx.fillRect(0, 0, r.width, r.height)

  const cores: string[] = []
  const pecas: { x: number; y: number; cor: string; giro: number; tam: number }[] = []
  for (let j = 0; j < linhas; j++) {
    for (let i = 0; i < colunas; i++) {
      const u = (i + 0.5) / colunas
      const v = ((j + 0.5) * celula) / r.height
      const cor = cena.pintar({ u, v, aspecto, r: rnd })
      cores.push(cor)
      pecas.push({
        x: (i + 0.5) * celula + desenho.entre(-0.06, 0.06) * celula,
        y: (j + 0.5) * celula + desenho.entre(-0.06, 0.06) * celula,
        cor,
        giro: desenho.entre(-0.07, 0.07),
        tam: celula * desenho.entre(0.82, 0.9),
      })
    }
  }
  const carimbos = criarCarimbos(cores)
  for (const p of pecas) {
    const carimbo = carimbos.get(p.cor)
    if (!carimbo) continue
    const cos = Math.cos(p.giro)
    const sin = Math.sin(p.giro)
    ctx.setTransform(cos * dpr, sin * dpr, -sin * dpr, cos * dpr, p.x * dpr, p.y * dpr)
    ctx.drawImage(carimbo, -p.tam / 2, -p.tam / 2, p.tam, p.tam)
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
