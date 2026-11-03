import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const CONSULTA_MOVIMENTO = '(prefers-reduced-motion: reduce)'

function assinarMovimento(aviso: () => void) {
  const mq = window.matchMedia(CONSULTA_MOVIMENTO)
  mq.addEventListener('change', aviso)
  return () => mq.removeEventListener('change', aviso)
}

/**
 * true quando a pessoa pediu para reduzir o movimento no sistema.
 * No servidor (pré-renderização) vale false; no navegador lê a preferência real.
 */
export function useMovimentoReduzido() {
  return useSyncExternalStore(
    assinarMovimento,
    () => window.matchMedia(CONSULTA_MOVIMENTO).matches,
    () => false,
  )
}

export function movimentoReduzidoAgora() {
  return typeof window !== 'undefined' && window.matchMedia(CONSULTA_MOVIMENTO).matches
}

/**
 * Aparelho modesto: poucos núcleos, pouca memória ou economia de dados ligada.
 * Nesses casos as animações ficam mais leves (menos pastilhas, sem parallax).
 */
export function aparelhoModesto() {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  const nucleos = nav.hardwareConcurrency ?? 8
  const memoria = nav.deviceMemory ?? 8
  return nucleos <= 4 || memoria <= 4 || nav.connection?.saveData === true
}

/** Observa se o elemento está na tela (com margem), sem disparar re-render a cada quadro. */
export function useNaTela<T extends Element>(margem = '0px', umaVez = false) {
  const ref = useRef<T>(null)
  const [naTela, setNaTela] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNaTela(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        setNaTela(entrada.isIntersecting)
        if (entrada.isIntersecting && umaVez) obs.disconnect()
      },
      { rootMargin: margem },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margem, umaVez])
  return [ref, naTela] as const
}

type Ouvinte = () => void
const ouvintes = new Set<Ouvinte>()
let agendado = false

function aoRolar() {
  if (agendado) return
  agendado = true
  requestAnimationFrame(() => {
    agendado = false
    ouvintes.forEach((o) => o())
  })
}

/**
 * Um único ouvinte de rolagem (passivo) para o site inteiro, com no máximo
 * uma rodada por quadro. Cada componente só lê medidas e escreve transform/opacity.
 */
export function aoRolarOuRedimensionar(ouvinte: Ouvinte) {
  if (ouvintes.size === 0) {
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar, { passive: true })
  }
  ouvintes.add(ouvinte)
  ouvinte()
  return () => {
    ouvintes.delete(ouvinte)
    if (ouvintes.size === 0) {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
  }
}

export const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const suavizar = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const desacelerar = (t: number) => 1 - Math.pow(1 - t, 3)
