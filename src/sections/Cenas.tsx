import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { BordaDePastilhas } from '../components/BordaDePastilhas'
import { CenaEmPastilhas } from '../components/CenaEmPastilhas'
import { comDestaque } from '../components/Destaque'
import { Icone } from '../components/Icone'
import { acessibilidade, cenas } from '../content/site'
import { aparelhoModesto, movimentoReduzidoAgora } from '../lib/movimento'
import './cenas.css'

export function Cenas() {
  const trilhoRef = useRef<HTMLElement>(null)
  const [ativo, setAtivo] = useState(0)
  const ativoRef = useRef(0)
  const total = cenas.itens.length

  const slides = () => Array.from(trilhoRef.current?.querySelectorAll<HTMLElement>('.cena') ?? [])

  const ir = useCallback((indice: number) => {
    const trilho = trilhoRef.current
    const alvo = slides()[Math.max(0, Math.min(total - 1, indice))]
    if (!trilho || !alvo) return
    const centro = alvo.offsetLeft + alvo.offsetWidth / 2 - trilho.clientWidth / 2
    trilho.scrollTo({ left: centro, behavior: movimentoReduzidoAgora() ? 'auto' : 'smooth' })
  }, [total])

  // Cena ativa, parallax e arrastar com o mouse.
  useEffect(() => {
    const trilho = trilhoRef.current
    if (!trilho) return
    const comParallax = !movimentoReduzidoAgora() && !aparelhoModesto()
    let quadro = 0

    const atualizar = () => {
      quadro = 0
      const centro = trilho.scrollLeft + trilho.clientWidth / 2
      let melhor = 0
      let menor = Infinity
      slides().forEach((s, i) => {
        const meio = s.offsetLeft + s.offsetWidth / 2
        const d = (meio - centro) / s.offsetWidth
        if (Math.abs(d) < menor) {
          menor = Math.abs(d)
          melhor = i
        }
        if (comParallax) {
          const k = Math.max(-1, Math.min(1, d))
          s.style.setProperty('--desloc', k.toFixed(3))
        }
      })
      if (melhor !== ativoRef.current) {
        ativoRef.current = melhor
        setAtivo(melhor)
      }
    }
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar)
    }
    trilho.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar, { passive: true })
    atualizar()

    const encaixe = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        trilho.classList.add('encaixa')
        encaixe.disconnect()
      },
      { rootMargin: '300px 0px' },
    )
    encaixe.observe(trilho)

    // Arrastar com o mouse (o toque já é nativo).
    let arrastando = false
    let inicioX = 0
    let inicioScroll = 0
    let moveu = 0
    const descer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      arrastando = true
      moveu = 0
      inicioX = e.clientX
      inicioScroll = trilho.scrollLeft
      trilho.classList.add('arrastando')
    }
    const mover = (e: PointerEvent) => {
      if (!arrastando) return
      const dx = e.clientX - inicioX
      moveu = Math.max(moveu, Math.abs(dx))
      trilho.scrollLeft = inicioScroll - dx
    }
    const subir = () => {
      if (!arrastando) return
      arrastando = false
      trilho.classList.remove('arrastando')
      if (moveu > 4) ir(ativoRef.current)
    }
    trilho.addEventListener('pointerdown', descer)
    window.addEventListener('pointermove', mover, { passive: true })
    window.addEventListener('pointerup', subir)

    return () => {
      cancelAnimationFrame(quadro)
      encaixe.disconnect()
      trilho.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      trilho.removeEventListener('pointerdown', descer)
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', subir)
    }
  }, [ir])

  const teclado = (e: KeyboardEvent<HTMLElement>) => {
    const mapa: Record<string, number> = {
      ArrowRight: ativo + 1,
      ArrowLeft: ativo - 1,
      Home: 0,
      End: total - 1,
    }
    if (e.key in mapa) {
      e.preventDefault()
      ir(mapa[e.key])
    }
  }

  return (
    <section id="cenas" className="cenas" aria-labelledby="cenas-titulo">
      <BordaDePastilhas cor="var(--creme)" semente={17} />
      <div className="conteiner cenas__cabeca">
        <p className="rotulo" data-revelar>
          <span className="rotulo__pastilha" aria-hidden="true" />
          {cenas.rotulo}
        </p>
        <h2 id="cenas-titulo" className="titulo-secao" data-revelar>
          {comDestaque(cenas.titulo)}
        </h2>
        <p className="cenas__intro" data-revelar>
          {cenas.texto}
        </p>
      </div>

      {/* A faixa rolável recebe foco para ser usada pelo teclado (setas, Home e End). */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <section
        ref={trilhoRef}
        className="carrossel__trilho"
        aria-roledescription="carrossel"
        aria-label={acessibilidade.carrossel}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onKeyDown={teclado}
      >
        {cenas.itens.map((cena, i) => (
          <figure
            key={cena.cena}
            className={`cena ${i === ativo ? 'cena--ativa' : ''}`}
            aria-roledescription="slide"
            aria-label={acessibilidade.slide(i + 1, total)}
          >
            <div className="cena__quadro">
              <CenaEmPastilhas cena={cena} className="cena__arte" />
            </div>
            <figcaption className="cena__legenda">
              <span className="cena__quando">{cena.quando}</span>
              <span className="cena__texto">{cena.texto}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      <div className="conteiner carrossel__controles">
        <button type="button" className="botao-icone" onClick={() => ir(ativo - 1)} disabled={ativo === 0} aria-label={acessibilidade.anterior}>
          <Icone nome="esquerda" />
        </button>
        <ol className="carrossel__progresso" aria-hidden="true">
          {cenas.itens.map((c, i) => (
            <li key={c.cena} className={i <= ativo ? 'cheio' : ''} />
          ))}
        </ol>
        <p className="carrossel__contador" aria-live="polite">
          <span>{String(ativo + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
        </p>
        <button
          type="button"
          className="botao-icone"
          onClick={() => ir(ativo + 1)}
          disabled={ativo === total - 1}
          aria-label={acessibilidade.proxima}
        >
          <Icone nome="direita" />
        </button>
      </div>
    </section>
  )
}
