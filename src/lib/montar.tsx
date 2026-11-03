import { StrictMode, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { iniciarRevelacao } from './revelar'

/** Liga o React na página: hidrata o HTML pré-renderizado ou renderiza do zero (em desenvolvimento). */
export function montar(no: ReactNode) {
  const raiz = document.getElementById('root')
  if (!raiz) return
  const app = <StrictMode>{no}</StrictMode>
  if (raiz.firstElementChild) hydrateRoot(raiz, app)
  else createRoot(raiz).render(app)
  iniciarRevelacao(raiz)
}
