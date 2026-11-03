import { useEffect, useRef, type ReactNode } from 'react'
import { BordaDePastilhas } from '../components/BordaDePastilhas'
import { manifesto } from '../content/site'
import { aoRolarOuRedimensionar, limitar } from '../lib/movimento'
import './manifesto.css'

/**
 * Divide os parágrafos em palavras numeradas. Cada palavra "acende" quando a
 * leitura chega nela (variável --p controlada pela rolagem).
 */
function montarPalavras(paragrafos: string[]) {
  let i = 0
  const blocos = paragrafos.map((texto, pi) => {
    const partes = texto.split(/(\*[^*]+\*)/g).filter(Boolean)
    const nos: ReactNode[] = []
    partes.forEach((parte, ki) => {
      const destaque = parte.startsWith('*') && parte.endsWith('*')
      const limpo = destaque ? parte.slice(1, -1) : parte
      const palavras = limpo.split(/(\s+)/).filter((w) => w.length > 0)
      const spans = palavras.map((w, wi) =>
        /^\s+$/.test(w) ? (
          ' '
        ) : (
          <span key={`${ki}-${wi}`} className="palavra" style={{ ['--i' as string]: i++ }}>
            {w}
          </span>
        ),
      )
      if (destaque) {
        nos.push(
          <em key={ki} className="destaque manifesto__destaque" style={{ ['--i' as string]: i - 1 }}>
            {spans}
          </em>,
        )
      } else nos.push(...spans)
    })
    return <p key={pi}>{nos}</p>
  })
  return { blocos, total: i }
}

export function Manifesto() {
  const textoRef = useRef<HTMLDivElement>(null)
  const { blocos, total } = montarPalavras(manifesto.paragrafos)

  useEffect(() => {
    const el = textoRef.current
    if (!el) return
    return aoRolarOuRedimensionar(() => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // A "linha de leitura" fica a ~62% da altura da tela.
      const p = limitar((vh * 0.62 - r.top) / (r.height + vh * 0.05))
      el.style.setProperty('--p', p.toFixed(4))
    })
  }, [])

  return (
    <section id="manifesto" className="manifesto" aria-labelledby="manifesto-titulo">
      <BordaDePastilhas cor="var(--tinta)" semente={11} />
      <div className="manifesto__interno conteiner">
        <h2 id="manifesto-titulo" className="rotulo rotulo--claro" data-revelar>
          <span className="rotulo__pastilha" aria-hidden="true" />
          {manifesto.rotulo}
        </h2>
        <div ref={textoRef} className="manifesto__texto" style={{ ['--n' as string]: total }}>
          {blocos}
        </div>
        <p className="manifesto__assinatura" data-revelar>
          <span aria-hidden="true">— </span>
          {manifesto.assinatura}
        </p>
      </div>
    </section>
  )
}
