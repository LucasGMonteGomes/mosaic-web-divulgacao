import type { Glifo as NomeDoGlifo } from '../content/site'
import './glifo.css'
import { LADO_DO_GLIFO, glifoAceso } from '../lib/glifos'

type Props = {
  glifo: NomeDoGlifo
  cor: string
  className?: string
  /** Versão parada, desenhada num SVG só (bem mais leve para a página). */
  estatico?: boolean
}

/** Quadrado arredondado como trecho de caminho SVG. */
function quadrado(x: number, y: number, lado: number, raio: number) {
  const reta = lado - 2 * raio
  return `M${x + raio} ${y}h${reta}a${raio} ${raio} 0 0 1 ${raio} ${raio}v${reta}a${raio} ${raio} 0 0 1 ${-raio} ${raio}h${-reta}a${raio} ${raio} 0 0 1 ${-raio} ${-raio}v${-reta}a${raio} ${raio} 0 0 1 ${raio} ${-raio}z`
}

/** Grade de pastilhas que troca de desenho com uma onda a partir do centro. */
export function Glifo({ glifo, cor, className, estatico = false }: Props) {
  const aceso = glifoAceso(glifo)
  const meio = (LADO_DO_GLIFO - 1) / 2

  if (estatico) {
    const lado = 0.84
    const folga = (1 - lado) / 2
    let acesas = ''
    let apagadas = ''
    aceso.forEach((ligada, i) => {
      const d = quadrado((i % LADO_DO_GLIFO) + folga, Math.floor(i / LADO_DO_GLIFO) + folga, lado, 0.2)
      if (ligada) acesas += d
      else apagadas += d
    })
    return (
      <svg
        className={`glifo glifo--estatico ${className ?? ''}`}
        viewBox={`0 0 ${LADO_DO_GLIFO} ${LADO_DO_GLIFO}`}
        style={{ ['--cor' as string]: `var(--${cor})` }}
        aria-hidden="true"
        focusable="false"
      >
        <path className="glifo__apagadas" d={apagadas} />
        <path className="glifo__acesas" d={acesas} />
      </svg>
    )
  }

  return (
    <div className={`glifo ${className ?? ''}`} style={{ ['--cor' as string]: `var(--${cor})` }} aria-hidden="true">
      {aceso.map((ligada, i) => {
        const x = i % LADO_DO_GLIFO
        const y = Math.floor(i / LADO_DO_GLIFO)
        const atraso = Math.round(Math.hypot(x - meio, y - meio) * 38)
        return <span key={i} className={ligada ? 'ligada' : undefined} style={{ ['--atraso' as string]: `${atraso}ms` }} />
      })}
    </div>
  )
}
