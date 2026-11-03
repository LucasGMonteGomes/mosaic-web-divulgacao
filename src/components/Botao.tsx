import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Icone, type NomeDoIcone } from './Icone'

type Base = {
  variante?: 'primario' | 'escuro' | 'contorno' | 'texto'
  icone?: NomeDoIcone | null
  children: ReactNode
}

function Conteudo({ icone, children }: Pick<Base, 'icone' | 'children'>) {
  return (
    <>
      <span className="botao__pastilha" aria-hidden="true" />
      <span className="botao__rotulo">{children}</span>
      {icone && (
        <span className="botao__icone">
          <Icone nome={icone} tamanho={18} />
        </span>
      )}
    </>
  )
}

/** Link com cara de botão (navegação para âncoras, páginas ou sites externos). */
export function BotaoLink({
  variante = 'primario',
  icone = 'seta',
  children,
  className,
  ...resto
}: Base & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`botao botao--${variante} ${className ?? ''}`} {...resto}>
      <Conteudo icone={icone}>{children}</Conteudo>
    </a>
  )
}

/** Botão de ação na própria página. */
export function Botao({
  variante = 'primario',
  icone = null,
  children,
  className,
  type = 'button',
  ...resto
}: Base & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`botao botao--${variante} ${className ?? ''}`} {...resto}>
      <Conteudo icone={icone}>{children}</Conteudo>
    </button>
  )
}
