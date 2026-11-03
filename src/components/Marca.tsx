import { NOME_CAMINHO, NOME_LARGURA, PINGO } from '../lib/marca-caminhos'
import { Simbolo } from './Simbolo'

type Props = {
  /** Altura do símbolo, em px. O nome acompanha. */
  altura?: number
  tom?: 'escuro' | 'claro'
  comNome?: boolean
  className?: string
}

/** Logo da Mosaicofy: símbolo + nome. O nome usa currentColor; o pingo do i é sempre coral. */
export function Marca({ altura = 36, tom = 'escuro', comNome = true, className }: Props) {
  const lado = PINGO.lado / 2
  return (
    <span className={`marca marca--${tom} ${className ?? ''}`} style={{ ['--altura' as string]: `${altura}px` }}>
      <Simbolo tamanho={altura} />
      {comNome && (
        <svg
          className="marca__nome"
          viewBox={`0 -800 ${NOME_LARGURA + 10} 1040`}
          height={altura * 0.86}
          aria-hidden="true"
          focusable="false"
        >
          <path d={NOME_CAMINHO} fill="currentColor" />
          <rect
            className="marca__pingo"
            x={PINGO.cx - lado}
            y={PINGO.cy - lado}
            width={PINGO.lado}
            height={PINGO.lado}
            rx={PINGO.raio}
            transform={`rotate(${PINGO.rot} ${PINGO.cx} ${PINGO.cy})`}
            fill="var(--coral)"
          />
        </svg>
      )}
    </span>
  )
}
