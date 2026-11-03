import { useState } from 'react'
import { BordaDePastilhas } from '../components/BordaDePastilhas'
import { comDestaque } from '../components/Destaque'
import { Glifo } from '../components/Glifo'
import { porVir } from '../content/site'
import './por-vir.css'

export function PorVir() {
  const [ativo, setAtivo] = useState(0)
  const atual = porVir.pilares[ativo]

  return (
    <section id="por-vir" className="por-vir" aria-labelledby="por-vir-titulo">
      <BordaDePastilhas cor="var(--papel)" semente={29} />
      <div className="conteiner">
        <header className="por-vir__cabeca">
          <p className="rotulo" data-revelar>
            <span className="rotulo__pastilha" aria-hidden="true" />
            {porVir.rotulo}
          </p>
          <h2 id="por-vir-titulo" className="titulo-secao" data-revelar>
            {comDestaque(porVir.titulo)}
          </h2>
        </header>

        <div className="por-vir__corpo">
          <ul className="pilares">
            {porVir.pilares.map((pilar, i) => {
              const aberto = i === ativo
              const idPainel = `pilar-${i}`
              return (
                <li
                  key={pilar.nome}
                  className={`pilar ${aberto ? 'pilar--aberto' : ''}`}
                  style={{ ['--cor' as string]: `var(--${pilar.cor})` }}
                  data-revelar
                >
                  <h3 className="pilar__titulo">
                    <button
                      type="button"
                      className="pilar__botao"
                      aria-expanded={aberto}
                      aria-controls={idPainel}
                      onClick={() => setAtivo(i)}
                      onMouseEnter={() => setAtivo(i)}
                    >
                      <span className="pilar__numero">{String(i + 1).padStart(2, '0')}</span>
                      <span className="pilar__nome">{pilar.nome}</span>
                      <span className="pilar__marca" aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={idPainel} className="pilar__painel" hidden={!aberto}>
                    <Glifo glifo={pilar.glifo} cor={pilar.cor} className="pilar__glifo-mini" estatico />
                    <p>{pilar.texto}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="por-vir__palco" aria-hidden="true">
            <div className="por-vir__fixo">
              <Glifo key={atual.glifo} glifo={atual.glifo} cor={atual.cor} className="por-vir__glifo" />
              <p className="por-vir__legenda">
                <span>{String(ativo + 1).padStart(2, '0')}</span>
                {atual.nome}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
