import type { Glifo } from '../content/site'
import { criarAleatorio } from './aleatorio'
import { criarMedidorDoTraco } from './arroba'
import { LADO_DO_GLIFO, glifoAceso } from './glifos'
import { desacelerar, limitar } from './movimento'
import { CORES, criarCarimbos } from './pastilhas'

type Desenho = 'arroba' | Glifo
const SEQUENCIA: Desenho[] = ['arroba', 'cerquilha', 'seta', 'faisca']

const FUNDO = [CORES.tinta2, '#24222A', '#2F2C35', '#26242C', '#34313B']
const ACESA = [CORES.coral, CORES.coral, CORES.coralClaro, CORES.coralFundo, CORES.ambar]

type Celula = { x: number; y: number; cor: string; quando: number; saida: number; giro: number }

const TEMPO = { assentar: 3600, segurar: 1900, brilho: 900, desmontar: 900 }
const CICLO = TEMPO.assentar + 420 + TEMPO.segurar + TEMPO.brilho + TEMPO.desmontar

/**
 * A "obra": pastilhas assentadas uma a uma, de baixo para cima, até formar um
 * desenho. Segura, brilha, desmonta e começa outro. Pausa fora da tela.
 */
export class Obra {
  private ctx: CanvasRenderingContext2D | null
  private carimbos = criarCarimbos([...FUNDO, ...ACESA])
  private celulas: Celula[] = []
  private w = 0
  private h = 0
  private dpr = 1
  private lado = 20
  private ciclo = 0
  private inicioCiclo = 0
  private pausadoEm = 0
  private quadroId = 0
  private rodando = false
  private medir = criarMedidorDoTraco(16)

  private canvas: HTMLCanvasElement
  private aoContar: (assentadas: number, total: number) => void
  private reduzido: boolean

  constructor(canvas: HTMLCanvasElement, aoContar: (assentadas: number, total: number) => void, reduzido: boolean) {
    this.canvas = canvas
    this.aoContar = aoContar
    this.reduzido = reduzido
    this.ctx = canvas.getContext('2d')
  }

  redimensionar() {
    const r = this.canvas.getBoundingClientRect()
    this.w = r.width
    this.h = r.height
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    this.lado = this.w < 560 ? 15 : this.w < 900 ? 18 : 22
    this.montar()
    if (this.reduzido || !this.rodando) this.desenhar(performance.now(), true)
  }

  private montar() {
    const colunas = Math.floor(this.w / this.lado)
    const linhas = Math.floor(this.h / this.lado)
    const sobraX = (this.w - colunas * this.lado) / 2
    const sobraY = (this.h - linhas * this.lado) / 2
    const desenho = SEQUENCIA[this.ciclo % SEQUENCIA.length]
    const rnd = criarAleatorio(100 + this.ciclo)
    const ligado = this.mascara(desenho, colunas, linhas)
    this.celulas = []
    for (let j = 0; j < linhas; j++) {
      for (let i = 0; i < colunas; i++) {
        const aceso = ligado(i, j)
        const deBaixo = (linhas - 1 - j) / Math.max(1, linhas - 1)
        this.celulas.push({
          x: sobraX + (i + 0.5) * this.lado,
          y: sobraY + (j + 0.5) * this.lado,
          cor: aceso ? rnd.escolher(ACESA) : rnd.escolher(FUNDO),
          // De baixo para cima, da esquerda para a direita, com um pouco de acaso.
          quando: limitar(deBaixo * 0.78 + (i / colunas) * 0.14 + rnd.entre(0, 0.08)),
          saida: rnd.proximo(),
          giro: rnd.entre(-0.06, 0.06),
        })
      }
    }
  }

  /** Diz se a célula (i, j) faz parte do desenho atual. */
  private mascara(desenho: Desenho, colunas: number, linhas: number) {
    const tamanho = Math.min(colunas, linhas) * 0.86
    const ox = (colunas - tamanho) / 2
    const oy = (linhas - tamanho) / 2
    if (desenho === 'arroba') {
      return (i: number, j: number) => {
        const x = 254.7 + ((i + 0.5 - ox) / tamanho - 0.5) * 330
        const y = 261 + ((j + 0.5 - oy) / tamanho - 0.5) * 330
        return this.medir(x, y) < 24
      }
    }
    const mapa = glifoAceso(desenho)
    return (i: number, j: number) => {
      const gx = Math.floor(((i + 0.5 - ox) / tamanho) * LADO_DO_GLIFO)
      const gy = Math.floor(((j + 0.5 - oy) / tamanho) * LADO_DO_GLIFO)
      if (gx < 0 || gy < 0 || gx >= LADO_DO_GLIFO || gy >= LADO_DO_GLIFO) return false
      return mapa[gy * LADO_DO_GLIFO + gx]
    }
  }

  ligar() {
    if (this.reduzido || this.rodando) return
    this.rodando = true
    const agora = performance.now()
    if (this.pausadoEm) this.inicioCiclo += agora - this.pausadoEm
    else this.inicioCiclo = agora
    this.pausadoEm = 0
    this.quadroId = requestAnimationFrame(this.quadro)
  }

  pausar() {
    if (!this.rodando) return
    this.rodando = false
    this.pausadoEm = performance.now()
    cancelAnimationFrame(this.quadroId)
  }

  private quadro = (agora: number) => {
    if (!this.rodando) return
    if (agora - this.inicioCiclo > CICLO) {
      this.ciclo++
      this.inicioCiclo = agora
      this.montar()
    }
    this.desenhar(agora, false)
    this.quadroId = requestAnimationFrame(this.quadro)
  }

  private desenhar(agora: number, completo: boolean) {
    const ctx = this.ctx
    if (!ctx) return
    const t = completo ? TEMPO.assentar + 420 + TEMPO.segurar * 0.5 : agora - this.inicioCiclo
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.w, this.h)
    const tam = this.lado * 0.86
    const inicioBrilho = TEMPO.assentar + 420 + TEMPO.segurar
    const inicioSaida = inicioBrilho + TEMPO.brilho
    const faixa = (t - inicioBrilho) / TEMPO.brilho
    let assentadas = 0

    for (const c of this.celulas) {
      const entrada = limitar((t - c.quando * TEMPO.assentar) / 420)
      if (entrada <= 0) continue
      const saida = limitar((t - inicioSaida - c.saida * TEMPO.desmontar * 0.7) / (TEMPO.desmontar * 0.3))
      if (saida >= 1) continue
      if (entrada >= 1) assentadas++
      // Entrada com leve "pulo" (passa um pouco do tamanho e volta).
      const e = desacelerar(entrada)
      const pulo = 1 + Math.sin(entrada * Math.PI) * 0.12
      const escala = e * pulo * (1 - saida)
      const y = c.y - (1 - e) * 16 + saida * 10
      const carimbo = this.carimbos.get(c.cor)
      if (!carimbo) continue
      const cos = Math.cos(c.giro)
      const sin = Math.sin(c.giro)
      ctx.globalAlpha = Math.min(1, entrada * 1.6) * (1 - saida)
      ctx.setTransform(cos * this.dpr, sin * this.dpr, -sin * this.dpr, cos * this.dpr, c.x * this.dpr, y * this.dpr)
      const s = tam * escala
      ctx.drawImage(carimbo, -s / 2, -s / 2, s, s)
      // Brilho passando na diagonal depois de pronto.
      if (faixa > 0 && faixa < 1) {
        const pos = (c.x + c.y) / (this.w + this.h)
        const d = Math.abs(pos - faixa)
        if (d < 0.08) {
          ctx.globalAlpha = (1 - d / 0.08) * 0.35
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(-s / 2, -s / 2, s, s)
        }
      }
    }
    ctx.globalAlpha = 1
    this.aoContar(assentadas, this.celulas.length)
  }
}
