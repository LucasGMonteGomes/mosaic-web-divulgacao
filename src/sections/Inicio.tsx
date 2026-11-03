import { useEffect, useRef } from 'react'
import { BotaoLink } from '../components/Botao'
import { comDestaque } from '../components/Destaque'
import { chamadaPrincipal, inicio } from '../content/site'
import { CampoDePastilhas } from '../lib/campo'
import { aoRolarOuRedimensionar, aparelhoModesto, limitar, useMovimentoReduzido } from '../lib/movimento'
import './inicio.css'

export function Inicio() {
  const secaoRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textoRef = useRef<HTMLDivElement>(null)
  const reduzido = useMovimentoReduzido()

  useEffect(() => {
    const secao = secaoRef.current
    const canvas = canvasRef.current
    if (!secao || !canvas) return

    const modesto = aparelhoModesto()
    const campo = new CampoDePastilhas({
      canvas,
      areasOcupadas: () => {
        const areas = Array.from(textoRef.current?.children ?? []).map((filho) =>
          filho.getBoundingClientRect(),
        )
        const dica = secao.querySelector('.inicio__dica')
        if (dica) areas.push(dica.getBoundingClientRect())
        return areas
      },
      reduzido,
      modesto,
      flutuar: !reduzido && !modesto && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    })
    campo.redimensionar()
    campo.ligar()
    // Quando as fontes terminam de carregar o texto pode mudar de tamanho.
    document.fonts?.ready.then(() => campo.redimensionar())

    // Em telas baixas o texto não cabe com o @ fixo na tela: aí a abertura rola normal.
    const palco = canvas.parentElement
    const medirAltura = () => {
      const curto = !!palco && palco.scrollHeight > window.innerHeight + 4
      if (curto !== (secao.dataset.curto === 'true')) secao.dataset.curto = String(curto)
    }
    medirAltura()

    const ro = new ResizeObserver(() => {
      medirAltura()
      campo.redimensionar()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([e]) => campo.definirVisivel(e.isIntersecting))
    io.observe(secao)

    const pararDeOuvirRolagem = aoRolarOuRedimensionar(() => {
      const r = secao.getBoundingClientRect()
      const percurso = Math.max(160, r.height - window.innerHeight)
      const p = limitar(-r.top / percurso)
      campo.definirProgresso(p)
      secao.style.setProperty('--p', p.toFixed(3))
      secao.dataset.fase = p > 0.5 ? 'longe' : 'perto'
    })

    const local = (x: number, y: number) => {
      const r = canvas.getBoundingClientRect()
      return { x: x - r.left, y: y - r.top }
    }
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const p = local(e.clientX, e.clientY)
      campo.apontar(p.x, p.y, true)
    }
    const sair = () => campo.apontar(-9999, -9999, false)
    const tocar = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const p = local(t.clientX, t.clientY)
      campo.apontar(p.x, p.y, true)
    }
    const soltar = () => campo.apontar(-9999, -9999, false)
    const clicar = (e: PointerEvent) => {
      if ((e.target as Element).closest('a, button')) return
      const p = local(e.clientX, e.clientY)
      campo.impulso(p.x, p.y)
    }

    secao.addEventListener('pointermove', mover, { passive: true })
    secao.addEventListener('pointerleave', sair, { passive: true })
    secao.addEventListener('pointerdown', clicar, { passive: true })
    secao.addEventListener('touchstart', tocar, { passive: true })
    secao.addEventListener('touchmove', tocar, { passive: true })
    secao.addEventListener('touchend', soltar, { passive: true })
    secao.addEventListener('touchcancel', soltar, { passive: true })

    const aoMudarAba = () => campo.definirVisivel(!document.hidden)
    document.addEventListener('visibilitychange', aoMudarAba)

    return () => {
      campo.desligar()
      ro.disconnect()
      io.disconnect()
      pararDeOuvirRolagem()
      document.removeEventListener('visibilitychange', aoMudarAba)
      secao.removeEventListener('pointermove', mover)
      secao.removeEventListener('pointerleave', sair)
      secao.removeEventListener('pointerdown', clicar)
      secao.removeEventListener('touchstart', tocar)
      secao.removeEventListener('touchmove', tocar)
      secao.removeEventListener('touchend', soltar)
      secao.removeEventListener('touchcancel', soltar)
    }
  }, [reduzido])

  return (
    <section id="topo" ref={secaoRef} className="inicio" aria-labelledby="inicio-titulo" data-fase="perto">
      <div className="inicio__palco">
        <canvas ref={canvasRef} className="inicio__campo" aria-hidden="true" />
        <p className="so-leitor">{inicio.descricaoDaAnimacao}</p>
        <div ref={textoRef} className="inicio__texto">
          <p className="selo">
            <span className="selo__pastilha" aria-hidden="true" />
            {inicio.selo}
          </p>
          <h1 id="inicio-titulo" className="inicio__titulo">
            {inicio.titulo.map((linha, i) => (
              <span key={linha} className={`inicio__linha inicio__linha--${i + 1}`}>
                <span className="inicio__linha-interna">{comDestaque(linha)}</span>
              </span>
            ))}
          </h1>
          <p className="inicio__apoio">{inicio.texto}</p>
          <div className="inicio__acoes">
            <BotaoLink href={`#${chamadaPrincipal.ancora}`}>{chamadaPrincipal.rotulo}</BotaoLink>
            <BotaoLink href={`#${inicio.secundario.ancora}`} variante="texto" icone="seta-baixo">
              {inicio.secundario.rotulo}
            </BotaoLink>
          </div>
        </div>
        <p className="inicio__dica" aria-hidden="true">
          <span className="inicio__dica-trilho">
            <span />
          </span>
          {inicio.dica}
        </p>
      </div>
    </section>
  )
}
