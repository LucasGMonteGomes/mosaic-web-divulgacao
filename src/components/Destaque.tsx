import { Fragment, type ReactNode } from 'react'

/** Transforma "*palavra*" em destaque tipográfico (itálico serifado). */
export function comDestaque(texto: string, classe = 'destaque'): ReactNode[] {
  return texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith('*') && parte.endsWith('*') ? (
      <em key={i} className={classe}>
        {parte.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{parte}</Fragment>
    ),
  )
}

/** Texto puro, sem a marcação de destaque (para títulos de página, alt etc.). */
export const semMarcacao = (texto: string) => texto.replaceAll('*', '')
