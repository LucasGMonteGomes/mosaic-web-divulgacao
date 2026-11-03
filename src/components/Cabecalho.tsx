import { useEffect, useRef } from 'react'
import './cabecalho.css'
import { acessibilidade, chamadaPrincipal, navegacao } from '../content/site'
import { ancora, rota } from '../lib/caminhos'
import { aoRolarOuRedimensionar } from '../lib/movimento'
import { BotaoLink } from './Botao'
import { Marca } from './Marca'

/** Cabeçalho fixo: fica sólido depois do topo e se esconde ao rolar para baixo. */
export function Cabecalho({ naPaginaInicial = true }: { naPaginaInicial?: boolean }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let ultimo = window.scrollY
    return aoRolarOuRedimensionar(() => {
      const y = window.scrollY
      el.dataset.solido = String(y > 24)
      const descendo = y > ultimo + 4
      const subindo = y < ultimo - 4
      const focoDentro = el.contains(document.activeElement)
      if (descendo && y > 480 && !focoDentro) el.dataset.oculto = 'true'
      else if (subindo || y < 480) el.dataset.oculto = 'false'
      ultimo = y
    })
  }, [])

  return (
    <header ref={ref} className="cabecalho" data-solido="false" data-oculto="false">
      <a className="pular" href="#conteudo">
        {acessibilidade.pularParaConteudo}
      </a>
      <div className="cabecalho__linha">
        <a className="cabecalho__marca" href={naPaginaInicial ? '#topo' : rota()} aria-label={acessibilidade.inicio}>
          <Marca altura={34} />
        </a>
        <nav className="cabecalho__nav" aria-label={acessibilidade.menu}>
          <ul>
            {navegacao.map((item) => (
              <li key={item.ancora}>
                <a className="link-sublinhado" href={ancora(item.ancora, naPaginaInicial)}>
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <BotaoLink
          className="cabecalho__cta"
          href={ancora(chamadaPrincipal.ancora, naPaginaInicial)}
          variante="escuro"
          icone={null}
        >
          {chamadaPrincipal.rotulo}
        </BotaoLink>
      </div>
    </header>
  )
}
