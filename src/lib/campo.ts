import { criarAleatorio } from './aleatorio'
import { pastilhasDoArroba } from './arroba'
import { desacelerar, limitar, suavizar } from './movimento'
import { TONS_DO_AMBIENTE, TONS_DO_ARROBA, criarCarimbos } from './pastilhas'

type Peca = {
  // alvo, em unidades do @ (viewBox 512)
  ax: number
  ay: number
  aa: number
  // posição espalhada, em fração da tela (0..1) e giro
  ex: number
  ey: number
  ea: number
  escala: number
  cor: string
  atraso: number
  fase: number
  ambiente: boolean
  // deslocamento causado pelo dedo/cursor (mola)
  dx: number
  dy: number
  vx: number
  vy: number
}

type Opcoes = {
  canvas: HTMLCanvasElement
  /** Retângulos do texto (título, parágrafo, botões), para as peças espalhadas não ficarem por cima. */
  areasOcupadas: () => DOMRect[]
  reduzido: boolean
  modesto: boolean
  /**
   * Abertura (o @ montado que se desfaz) e flutuação contínua: só em computador com mouse.
   * No celular as peças já começam espalhadas e o quadro só é redesenhado quando algo muda,
   * o que deixa o carregamento leve e economiza bateria.
   */
  flutuar: boolean
}

const CENTRO_DO_ARROBA = { x: 254.7, y: 261 }
const LARGURA_DO_ARROBA = 285

/**
 * Campo de pastilhas da abertura.
 * - Ao carregar: o @ aparece montado e se desfaz em pedaços (transição de entrada).
 * - Ao rolar: os pedaços voltam e formam o @ ("de perto, pedaços; de longe, você").
 * - Cursor ou dedo empurram as peças, que voltam com efeito de mola.
 */
export class CampoDePastilhas {
  private ctx: CanvasRenderingContext2D | null
  private pecas: Peca[] = []
  private carimbos: Map<string, HTMLCanvasElement>
  private w = 0
  private h = 0
  private dpr = 1
  private escala = 1
  private cx = 0
  private cy = 0
  private progresso = 0
  private inicio = 0
  private quadroId = 0
  private ativo = false
  private visivel = true
  private ponteiro = { x: -9999, y: -9999, ativo: false }
  private ultimaMudanca = 0
  private rascunho = { x: 0, y: 0, a: 0, t: 0 }

  private op: Opcoes

  constructor(op: Opcoes) {
    this.op = op
    this.ctx = op.canvas.getContext('2d')
    const rnd = criarAleatorio(2026)
    const fileiras = 3
    const alvos = pastilhasDoArroba(fileiras, 1.1)
    const total = alvos.length
    this.pecas = alvos.map((a) => ({
      ax: a.x,
      ay: a.y,
      aa: a.angulo,
      ex: 0,
      ey: 0,
      ea: rnd.entre(-Math.PI, Math.PI),
      escala: rnd.entre(0.9, 1.5),
      cor: rnd.escolher(TONS_DO_ARROBA),
      // Monta seguindo o traço, com um pouco de bagunça.
      atraso: limitar((a.ordem / (total / fileiras)) * 0.7 + rnd.entre(0, 0.3)),
      fase: rnd.entre(0, Math.PI * 2),
      ambiente: false,
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
    }))
    const extras = op.modesto ? 24 : 48
    for (let i = 0; i < extras; i++) {
      this.pecas.unshift({
        ax: 0,
        ay: 0,
        aa: 0,
        ex: 0,
        ey: 0,
        ea: rnd.entre(-Math.PI, Math.PI),
        escala: rnd.entre(0.7, 1.7),
        cor: rnd.escolher(TONS_DO_AMBIENTE),
        atraso: 0,
        fase: rnd.entre(0, Math.PI * 2),
        ambiente: true,
        dx: 0,
        dy: 0,
        vx: 0,
        vy: 0,
      })
    }
    this.carimbos = criarCarimbos([...TONS_DO_ARROBA, ...TONS_DO_AMBIENTE])
    // Sem abertura (celular ou movimento reduzido), as peças já começam espalhadas.
    this.inicio = op.flutuar ? performance.now() : -10000
  }

  redimensionar() {
    const { canvas } = this.op
    const r = canvas.getBoundingClientRect()
    this.w = r.width
    this.h = r.height
    this.dpr = Math.min(window.devicePixelRatio || 1, this.op.modesto || !this.op.flutuar ? 1.5 : 2)
    canvas.width = Math.round(this.w * this.dpr)
    canvas.height = Math.round(this.h * this.dpr)

    // Áreas do texto (com folga), para o @ e as peças soltas não ficarem por cima.
    const ocupadas = this.op
      .areasOcupadas()
      .filter((a) => a.width > 0 && a.height > 0) // elementos escondidos não contam
      .map((a) => ({
        x0: a.left - r.left - 18,
        x1: a.right - r.left + 18,
        y0: a.top - r.top - 18,
        y1: a.bottom - r.top + 18,
      }))

    const largo = this.w >= 900
    if (largo) {
      this.escala = Math.min(this.w * 0.36, this.h * 0.62) / LARGURA_DO_ARROBA
      this.cx = this.w * 0.74
      this.cy = this.h * 0.54
    } else {
      // No celular o @ fica no espaço entre o cabeçalho e o começo do texto.
      const topo = 76
      const comecoDoTexto = ocupadas.length ? Math.min(...ocupadas.map((a) => a.y0)) : this.h * 0.55
      const espaco = Math.max(96, comecoDoTexto - topo)
      this.escala = Math.min(this.w * 0.6, espaco / 1.25) / LARGURA_DO_ARROBA
      this.cx = this.w * 0.5
      this.cy = topo + espaco / 2
    }

    const livre = (x: number, y: number) => ocupadas.every((a) => x < a.x0 || x > a.x1 || y < a.y0 || y > a.y1)
    const rnd = criarAleatorio(77)
    for (const p of this.pecas) {
      let x = 0
      let y = 0
      for (let tentativa = 0; tentativa < 40; tentativa++) {
        x = rnd.entre(0.02, 0.98) * this.w
        y = rnd.entre(0.1, 0.97) * this.h
        if (livre(x, y)) break
      }
      p.ex = x
      p.ey = y
    }
    this.marcarMudanca()
  }

  definirProgresso(p: number) {
    if (Math.abs(p - this.progresso) < 0.0005) return
    this.progresso = p
    this.marcarMudanca()
  }

  apontar(x: number, y: number, ativo: boolean) {
    this.ponteiro.x = x
    this.ponteiro.y = y
    this.ponteiro.ativo = ativo
    if (ativo) this.marcarMudanca()
  }

  /** Toque rápido: empurra as peças em volta, como uma onda. */
  impulso(x: number, y: number) {
    if (this.op.reduzido) return
    for (const p of this.pecas) {
      const pos = this.posicao(p, performance.now())
      const vx = pos.x - x
      const vy = pos.y - y
      const d = Math.hypot(vx, vy)
      if (d < 220 && d > 0.1) {
        const forca = (1 - d / 220) * 14
        p.vx += (vx / d) * forca
        p.vy += (vy / d) * forca
      }
    }
    this.marcarMudanca()
  }

  definirVisivel(v: boolean) {
    this.visivel = v
    if (v) this.marcarMudanca()
  }

  ligar() {
    this.ativo = true
    this.marcarMudanca()
  }

  desligar() {
    this.ativo = false
    cancelAnimationFrame(this.quadroId)
    this.quadroId = 0
  }

  private marcarMudanca() {
    this.ultimaMudanca = performance.now()
    if (this.ativo && this.visivel && !this.quadroId) this.quadroId = requestAnimationFrame(this.quadro)
  }

  /** Quanto cada peça já andou do espalhado até o @ (0 = espalhada, 1 = no lugar). */
  private local(p: Peca, agora: number) {
    if (p.ambiente) return 0
    const montagem = limitar(this.progresso / 0.72)
    const porPeca = suavizar(limitar((montagem - p.atraso * 0.4) / 0.6))
    // Entrada: começa montado e se desfaz.
    const entrada = desacelerar(limitar((agora - this.inicio - 350) / 1300))
    const atrasoEntrada = desacelerar(limitar((agora - this.inicio - 350 - p.atraso * 500) / 1100))
    const e = this.op.reduzido ? 1 : Math.min(entrada, atrasoEntrada)
    return 1 - e * (1 - porPeca)
  }

  private posicao(p: Peca, agora: number) {
    const t = this.local(p, agora)
    const alvoX = this.cx + (p.ax - CENTRO_DO_ARROBA.x) * this.escala
    const alvoY = this.cy + (p.ay - CENTRO_DO_ARROBA.y) * this.escala
    const flutua = this.op.flutuar ? 1 - t : 0
    const fx = Math.sin(agora * 0.00055 + p.fase) * 7 * flutua
    const fy = Math.cos(agora * 0.00047 + p.fase * 1.3) * 7 * flutua
    const s = this.rascunho
    s.x = p.ex + (alvoX - p.ex) * t + fx + p.dx
    s.y = p.ey + (alvoY - p.ey) * t + fy + p.dy
    s.a = p.ea + (p.aa - p.ea) * t + Math.sin(agora * 0.0004 + p.fase) * 0.2 * flutua
    s.t = t
    return s
  }

  private quadro = (agora: number) => {
    this.quadroId = 0
    const ctx = this.ctx
    if (!ctx || !this.ativo || !this.visivel) return
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.w, this.h)

    const lado = (40 / 3) * this.escala * 0.94
    const raio = this.w < 600 ? 90 : 120
    let energia = 0

    for (const p of this.pecas) {
      const pos = this.posicao(p, agora)
      // Mola do cursor/dedo.
      if (!this.op.reduzido) {
        const dx0 = p.dx
        const dy0 = p.dy
        if (this.ponteiro.ativo) {
          const vx = pos.x - this.ponteiro.x
          const vy = pos.y - this.ponteiro.y
          const d = Math.hypot(vx, vy)
          if (d < raio && d > 0.1) {
            const f = Math.pow(1 - d / raio, 2) * 2.4
            p.vx += (vx / d) * f
            p.vy += (vy / d) * f
          }
        }
        p.vx += -p.dx * 0.06
        p.vy += -p.dy * 0.06
        p.vx *= 0.84
        p.vy *= 0.84
        p.dx += p.vx
        p.dy += p.vy
        pos.x += p.dx - dx0
        pos.y += p.dy - dy0
        energia += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.dx) * 0.05 + Math.abs(p.dy) * 0.05
      }

      const carimbo = this.carimbos.get(p.cor)
      if (!carimbo) continue
      const tamanho = lado * (p.escala + (1 - p.escala) * pos.t)
      const cos = Math.cos(pos.a)
      const sin = Math.sin(pos.a)
      ctx.globalAlpha = p.ambiente ? 0.9 - this.progresso * 0.55 : 1
      ctx.setTransform(cos * this.dpr, sin * this.dpr, -sin * this.dpr, cos * this.dpr, pos.x * this.dpr, pos.y * this.dpr)
      ctx.drawImage(carimbo, -tamanho / 2, -tamanho / 2, tamanho, tamanho)
    }
    ctx.globalAlpha = 1

    const emEntrada = agora - this.inicio < 2400
    const flutuando = this.op.flutuar && this.progresso < 0.99
    const recente = agora - this.ultimaMudanca < 120
    if (emEntrada || flutuando || energia > 0.05 || recente || this.ponteiro.ativo) {
      this.quadroId = requestAnimationFrame(this.quadro)
    }
  }
}
