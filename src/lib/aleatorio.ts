/**
 * Gerador pseudoaleatório com semente (mulberry32).
 * Mesma semente = mesmo resultado no servidor (pré-renderização) e no navegador,
 * o que evita diferenças de hidratação e deixa as composições estáveis.
 */
export function criarAleatorio(semente: number) {
  let a = semente >>> 0
  const proximo = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    proximo,
    entre: (min: number, max: number) => min + (max - min) * proximo(),
    escolher: <T,>(lista: readonly T[]): T => lista[Math.floor(proximo() * lista.length)],
  }
}

export type Aleatorio = ReturnType<typeof criarAleatorio>
