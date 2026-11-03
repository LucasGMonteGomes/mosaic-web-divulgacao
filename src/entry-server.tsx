import { StrictMode, type ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { privacidade, termos } from './content/paginas'
import { NaoEncontrado } from './pages/NaoEncontrado'
import { PaginaDeTexto } from './pages/PaginaDeTexto'

/**
 * Pré-renderização (feita no build, não em servidor): gera o HTML de cada página
 * para que o conteúdo apareça antes do JavaScript e seja lido por buscadores.
 */
export type Pagina = 'inicio' | 'privacidade' | 'termos' | '404'

const PAGINAS: Record<Pagina, () => ReactNode> = {
  inicio: () => <App />,
  privacidade: () => <PaginaDeTexto pagina={privacidade} />,
  termos: () => <PaginaDeTexto pagina={termos} />,
  '404': () => <NaoEncontrado />,
}

export function render(pagina: Pagina) {
  return renderToString(<StrictMode>{PAGINAS[pagina]()}</StrictMode>)
}
