import { useEffect, useRef } from 'react'
import type { Cena } from '../content/site'
import { rota } from '../lib/caminhos'

/**
 * Uma cena do carrossel. Sem `imagem`, desenha a ilustração em pastilhas
 * (carregada só quando a cena chega perto da tela). Com `imagem`, mostra a foto.
 */
export function CenaEmPastilhas({ cena, className }: { cena: Cena; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || cena.imagem) return
    let desenhar: ((c: HTMLCanvasElement) => void) | null = null
    let espera = 0
    let ultimaLargura = 0

    const pintar = () => {
      const largura = canvas.getBoundingClientRect().width
      if (!desenhar || Math.abs(largura - ultimaLargura) < 2) return
      ultimaLargura = largura
      desenhar(canvas)
      canvas.dataset.pronta = 'true'
    }

    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || desenhar) return
        io.disconnect()
        // Divisão de código: o desenho das cenas só é baixado quando precisa.
        const { desenharCena } = await import('../lib/cenas')
        desenhar = (c) => desenharCena(c, cena.cena, c.getBoundingClientRect().width < 360 ? 11 : 14)
        pintar()
      },
      { rootMargin: '400px' },
    )
    io.observe(canvas)

    const ro = new ResizeObserver(() => {
      clearTimeout(espera)
      espera = window.setTimeout(pintar, 150)
    })
    ro.observe(canvas)

    return () => {
      io.disconnect()
      ro.disconnect()
      clearTimeout(espera)
    }
  }, [cena])

  if (cena.imagem) {
    return <img className={`cena-imagem ${className ?? ''}`} src={rota(cena.imagem)} alt={cena.alt} loading="lazy" decoding="async" />
  }
  return (
    <>
      <canvas ref={ref} className={`cena-canvas cena-canvas--${cena.cena} ${className ?? ''}`} aria-hidden="true" />
      <span className="so-leitor">{cena.alt}</span>
    </>
  )
}
