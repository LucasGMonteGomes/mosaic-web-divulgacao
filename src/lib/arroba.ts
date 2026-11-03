/**
 * O @ cursivo da Mosaicofy (ícone escolhido em 03/11/2026).
 * Traço único, pontas redondas, inclinação de 0,18. Mesmo desenho dos arquivos
 * em mosaic-docs/marketing/marca/mosaicofy-icone-arroba-cursivo-*.svg.
 */
export const ARROBA_VIEWBOX = 512
export const ARROBA_TRACO = 40
export const ARROBA_CAMINHO =
  'M 293.9 236.0 C 289.6 210.0 270.1 196.0 248.1 196.0 C 210.1 196.0 178.0 230.0 171.5 266.0 ' +
  'C 165.0 302.0 184.7 326.0 212.7 326.0 C 242.7 326.0 273.4 300.0 288.2 262.0 ' +
  'C 295.1 246.0 299.4 228.0 301.9 214.0 C 294.4 250.0 285.2 290.0 291.2 312.0 ' +
  'C 297.6 332.0 322.6 338.0 343.4 322.0 C 373.4 300.0 393.5 266.0 397.6 232.0 ' +
  'C 405.2 168.0 357.1 124.0 285.1 124.0 C 203.1 124.0 129.9 186.0 115.9 264.0 ' +
  'C 101.8 342.0 153.8 398.0 235.8 398.0 C 277.8 398.0 315.6 388.0 349.2 368.0'

export type Ponto = { x: number; y: number }

/** Lê o caminho (só M e C) e devolve uma polilinha bem amostrada. */
export function polilinha(caminho = ARROBA_CAMINHO, passosPorCurva = 48): Ponto[] {
  const n = (caminho.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
  const pts: Ponto[] = []
  let x0 = n[0]
  let y0 = n[1]
  pts.push({ x: x0, y: y0 })
  for (let i = 2; i + 5 < n.length; i += 6) {
    const [x1, y1, x2, y2, x3, y3] = n.slice(i, i + 6)
    for (let k = 1; k <= passosPorCurva; k++) {
      const t = k / passosPorCurva
      const u = 1 - t
      pts.push({
        x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
      })
    }
    x0 = x3
    y0 = y3
  }
  return pts
}

/** Reamostra a polilinha em passos de comprimento fixo, com o ângulo da tangente. */
export function reamostrar(pts: Ponto[], passo: number): (Ponto & { angulo: number })[] {
  const saida: (Ponto & { angulo: number })[] = []
  let resto = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy)
    if (len === 0) continue
    const angulo = Math.atan2(dy, dx)
    let d = resto === 0 ? 0 : passo - resto
    while (d <= len) {
      saida.push({ x: a.x + (dx * d) / len, y: a.y + (dy * d) / len, angulo })
      d += passo
    }
    resto = (resto + len) % passo
  }
  return saida
}

export type PastilhaAlvo = Ponto & { angulo: number; fileira: number; ordem: number }

/**
 * Distribui pastilhas ao longo do traço do @, em fileiras paralelas,
 * como no ícone em mosaico. Descarta peças que se sobreporiam nas curvas fechadas.
 */
export function pastilhasDoArroba(fileiras = 3, folga = 1.08): PastilhaAlvo[] {
  const lado = ARROBA_TRACO / fileiras
  const passo = lado * folga
  const base = reamostrar(polilinha(), passo)
  const aceitas: PastilhaAlvo[] = []
  const grade = new Map<string, PastilhaAlvo[]>()
  const chave = (x: number, y: number) => `${Math.floor(x / lado)}:${Math.floor(y / lado)}`
  const minimo = lado * 0.9
  base.forEach((p, ordem) => {
    const nx = -Math.sin(p.angulo)
    const ny = Math.cos(p.angulo)
    for (let f = 0; f < fileiras; f++) {
      const desloc = (f - (fileiras - 1) / 2) * lado * 1.02
      const c = { x: p.x + nx * desloc, y: p.y + ny * desloc, angulo: p.angulo, fileira: f, ordem }
      const gx = Math.floor(c.x / lado)
      const gy = Math.floor(c.y / lado)
      let livre = true
      for (let i = -1; i <= 1 && livre; i++) {
        for (let j = -1; j <= 1 && livre; j++) {
          for (const o of grade.get(`${gx + i}:${gy + j}`) ?? []) {
            if (Math.hypot(o.x - c.x, o.y - c.y) < minimo) {
              livre = false
              break
            }
          }
        }
      }
      if (!livre) continue
      aceitas.push(c)
      const k = chave(c.x, c.y)
      grade.set(k, [...(grade.get(k) ?? []), c])
    }
  })
  return aceitas
}

/** Distância de um ponto até o traço do @ (em unidades do viewBox). */
export function criarMedidorDoTraco(passos = 24) {
  const pts = polilinha(ARROBA_CAMINHO, passos)
  return (x: number, y: number) => {
    let melhor = Infinity
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]
      const b = pts[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1)))
      const d = Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy))
      if (d < melhor) melhor = d
    }
    return melhor
  }
}
