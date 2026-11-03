import { useEffect, useRef, useState } from 'react'
import { BordaDePastilhas } from '../components/BordaDePastilhas'
import { Celular, ConteudoDaTela } from '../components/TelaDoCelular'
import { comDestaque } from '../components/Destaque'
import { ideias } from '../content/site'
import './ideias.css'

export function Ideias() {
  const [ativo, setAtivo] = useState(0)
  const passosRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtivo(Number((e.target as HTMLElement).dataset.indice))
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    passosRef.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="ideias" className="ideias" aria-labelledby="ideias-titulo">
      <BordaDePastilhas cor="var(--papel)" semente={5} />
      <div className="conteiner">
        <header className="ideias__cabeca">
          <p className="rotulo" data-revelar>
            <span className="rotulo__pastilha" aria-hidden="true" />
            {ideias.rotulo}
          </p>
          <h2 id="ideias-titulo" className="titulo-secao" data-revelar>
            {comDestaque(ideias.titulo)}
          </h2>
          <p className="ideias__intro" data-revelar>
            {ideias.texto}
          </p>
        </header>

        <div className="ideias__corpo">
          <ol className="ideias__passos">
            {ideias.passos.map((passo, i) => (
              <li
                key={passo.tela}
                ref={(el) => {
                  passosRef.current[i] = el
                }}
                data-indice={i}
                className={`passo ${ativo === i ? 'passo--ativo' : ''}`}
              >
                <Celular className="passo__celular">
                  <ConteudoDaTela tela={passo.tela} />
                </Celular>
                <div className="passo__texto" data-revelar>
                  <p className="passo__chapeu">
                    <span className="passo__numero">{String(i + 1).padStart(2, '0')}</span>
                    {passo.chapeu}
                    <span className="selo-ideia">{ideias.selo}</span>
                  </p>
                  <h3 className="passo__titulo">{passo.titulo}</h3>
                  <p className="passo__descricao">{passo.texto}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="ideias__palco">
            <div className="ideias__fixo">
              <Celular className="ideias__celular">
                {ideias.passos.map((passo, i) => (
                  <div
                    key={passo.tela}
                    className={`ideias__tela ${i === ativo ? 'ideias__tela--ativa' : ''} ${i < ativo ? 'ideias__tela--passou' : ''}`}
                  >
                    <ConteudoDaTela tela={passo.tela} />
                  </div>
                ))}
              </Celular>
              <ol className="ideias__marcadores" aria-hidden="true">
                {ideias.passos.map((passo, i) => (
                  <li key={passo.tela} className={i === ativo ? 'ativo' : ''} />
                ))}
              </ol>
              <span className="ideias__fragmento ideias__fragmento--a" aria-hidden="true" />
              <span className="ideias__fragmento ideias__fragmento--b" aria-hidden="true" />
              <span className="ideias__fragmento ideias__fragmento--c" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
