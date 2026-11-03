import { criarAleatorio } from '../lib/aleatorio'

type Props = {
  /** Cor da seção que começa (as pastilhas "invadem" a seção anterior). */
  cor: string
  semente?: number
  colunas?: number
}

// Medidas em unidades do desenho (o SVG estica junto com a largura da tela).
const LADO = 14
const VAO = 4
const BASE = LADO * 0.7
const RAIO = LADO * 0.26
const ALTURA = 48

/** Quadrado de cantos arredondados, girado: polígono recuado + contorno grosso com junção redonda. */
function peca(cx: number, cy: number, largura: number, altura: number, giro: number) {
  const a = (giro * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  const mx = largura / 2 - RAIO
  const my = altura / 2 - RAIO
  const cantos = [
    [-mx, -my],
    [mx, -my],
    [mx, my],
    [-mx, my],
  ].map(([x, y]) => `${(cx + x * cos - y * sin).toFixed(2)} ${(cy + x * sin + y * cos).toFixed(2)}`)
  return `M${cantos.join('L')}Z`
}

/**
 * Transição entre seções: em vez de uma linha reta, a borda da seção seguinte
 * aparece como pastilhas ainda sendo assentadas (fileira de baixo completa,
 * algumas peças soltas por cima). Desenhada num SVG só, para pesar pouco.
 * Decorativa: escondida de leitores de tela.
 */
export function BordaDePastilhas({ cor, semente = 7, colunas = 44 }: Props) {
  const rnd = criarAleatorio(semente)
  const largura = colunas * LADO + (colunas - 1) * VAO
  let d = ''
  for (let i = 0; i < colunas; i++) {
    const cx = i * (LADO + VAO) + LADO / 2
    const sorte = rnd.proximo()
    const pecas = sorte < 0.1 ? 3 : sorte < 0.5 ? 2 : 1
    // Fileira de baixo: passa da borda inferior para ficar reta onde encosta na seção.
    d += peca(cx, ALTURA - BASE / 2 + RAIO, LADO, BASE + 2 * RAIO, 0)
    for (let k = 1; k < pecas; k++) {
      const base = ALTURA - BASE - VAO - (k - 1) * (LADO + VAO)
      d += peca(cx, base - LADO / 2, LADO, LADO, rnd.entre(-10, 10))
    }
  }
  return (
    <div className="borda" aria-hidden="true" data-revelar="borda">
      <svg viewBox={`0 0 ${largura} ${ALTURA}`} preserveAspectRatio="xMidYMax meet" focusable="false">
        <path d={d} style={{ fill: cor, stroke: cor }} strokeWidth={RAIO * 2} strokeLinejoin="round" />
      </svg>
    </div>
  )
}
