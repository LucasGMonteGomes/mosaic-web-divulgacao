import { ARROBA_CAMINHO } from '../lib/arroba'

type Props = {
  tamanho?: number | string
  variante?: 'coral' | 'tinta' | 'creme' | 'traco'
  titulo?: string
  className?: string
}

const CORES = {
  coral: { fundo: 'var(--coral)', traco: 'var(--creme)' },
  tinta: { fundo: 'var(--tinta)', traco: 'var(--creme)' },
  creme: { fundo: 'var(--creme)', traco: 'var(--coral)' },
  traco: { fundo: 'none', traco: 'currentColor' },
}

/** O símbolo da Mosaicofy: o @ cursivo dentro da pastilha de cantos arredondados. */
export function Simbolo({ tamanho = 40, variante = 'coral', titulo, className }: Props) {
  const cor = CORES[variante]
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      width={tamanho}
      height={tamanho}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      {cor.fundo !== 'none' && <rect width="512" height="512" rx="116" fill={cor.fundo} />}
      <path
        d={ARROBA_CAMINHO}
        fill="none"
        stroke={cor.traco}
        strokeWidth={variante === 'traco' ? 40 : 44}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
