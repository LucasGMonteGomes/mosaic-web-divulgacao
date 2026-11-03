import { useEffect, useRef } from 'react'
import { BordaDePastilhas } from '../components/BordaDePastilhas'
import { construcao } from '../content/site'
import { Obra } from '../lib/obra'
import { useMovimentoReduzido } from '../lib/movimento'
import './construcao.css'

export function Construcao() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contadorRef = useRef<HTMLSpanElement>(null)
  const reduzido = useMovimentoReduzido()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let ultimo = ''
    const obra = new Obra(
      canvas,
      (feitas, total) => {
        const texto = `${String(feitas).padStart(3, '0')} / ${total}`
        if (texto !== ultimo && contadorRef.current) {
          contadorRef.current.textContent = texto
          ultimo = texto
        }
      },
      reduzido,
    )
    obra.redimensionar()
    const ro = new ResizeObserver(() => obra.redimensionar())
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? obra.ligar() : obra.pausar()), {
      threshold: 0.15,
    })
    io.observe(canvas)
    const aba = () => (document.hidden ? obra.pausar() : obra.ligar())
    document.addEventListener('visibilitychange', aba)
    return () => {
      obra.pausar()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', aba)
    }
  }, [reduzido])

  return (
    <section className="construcao" aria-labelledby="construcao-titulo">
      <BordaDePastilhas cor="var(--tinta)" semente={23} />
      <div className="conteiner construcao__grade">
        <div className="construcao__texto">
          <p className="rotulo rotulo--claro" data-revelar>
            <span className="rotulo__pastilha" aria-hidden="true" />
            {construcao.rotulo}
          </p>
          <h2 id="construcao-titulo" className="construcao__titulo" data-revelar>
            {construcao.titulo}
          </h2>
          <p className="construcao__apoio" data-revelar>
            {construcao.texto}
          </p>
          <div className="diario" data-revelar>
            <h3 className="diario__titulo">{construcao.diarioTitulo}</h3>
            <ol className="diario__lista">
              {construcao.diario.map((item) => (
                <li key={item.etapa} className={`diario__item diario__item--${item.situacao.replaceAll(' ', '-')}`}>
                  <span className="diario__marca" aria-hidden="true" />
                  <span className="diario__etapa">{item.etapa}</span>
                  <span className="diario__situacao">{item.situacao}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <figure className="construcao__obra">
          <canvas ref={canvasRef} className="construcao__canvas" aria-hidden="true" />
          <span className="so-leitor">{construcao.descricaoDaAnimacao}</span>
          <figcaption className="construcao__contador" aria-hidden="true">
            <span className="construcao__ponto" />
            pastilhas assentadas <span ref={contadorRef}>000</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
