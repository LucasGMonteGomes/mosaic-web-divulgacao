/**
 * Endereços internos sempre a partir do caminho base do site,
 * para funcionar tanto em mosaicofy.com quanto em <org>.github.io/<repositorio>/.
 */
const BASE = import.meta.env.BASE_URL

export const rota = (caminho = '') => `${BASE}${caminho.replace(/^\//, '')}`

export const ancora = (id: string, naPaginaInicial: boolean) => (naPaginaInicial ? `#${id}` : `${rota()}#${id}`)
