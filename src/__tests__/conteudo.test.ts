import { describe, expect, it } from 'vitest'
import { DOMINIO, URL_DO_SITE, listaDeEspera, redes, redesAtivas } from '../content/links'
import { privacidade, termos } from '../content/paginas'
import * as site from '../content/site'

/** Junta todo o texto de um objeto de conteúdo, para checagens de texto. */
function textos(valor: unknown): string[] {
  if (typeof valor === 'string') return [valor]
  if (Array.isArray(valor)) return valor.flatMap(textos)
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos)
  return []
}

const todoOTexto = [...textos(site), ...textos(privacidade), ...textos(termos)].join('\n')

describe('conteúdo do site', () => {
  it('não tem texto provisório', () => {
    expect(todoOTexto).not.toMatch(/lorem|ipsum|placeholder/i)
    expect(todoOTexto).not.toMatch(/\bTODO\b|\bFIXME\b|\bXXX\b/)
  })

  it('não promete o que ainda não existe', () => {
    // O app está em construção: nada de "baixe agora" ou "disponível na loja".
    expect(todoOTexto).not.toMatch(/baixe (já|agora)|dispon[ií]vel na (app store|play store|loja)|cadastre-se agora/i)
  })

  it('marca destaques com pares de asteriscos fechados', () => {
    for (const t of textos(site)) {
      const asteriscos = (t.match(/\*/g) ?? []).length
      expect(asteriscos % 2, `asterisco sem par em: "${t}"`).toBe(0)
    }
  })

  it('tem 4 ideias, 5 pilares e cenas com texto alternativo', () => {
    expect(site.ideias.passos).toHaveLength(4)
    expect(site.porVir.pilares).toHaveLength(5)
    expect(site.cenas.itens.length).toBeGreaterThanOrEqual(6)
    for (const cena of site.cenas.itens) {
      expect(cena.alt.length, `cena ${cena.cena} sem descrição`).toBeGreaterThan(20)
    }
  })

  it('usa o domínio oficial', () => {
    expect(DOMINIO).toBe('mosaicofy.com')
    expect(URL_DO_SITE).toBe('https://mosaicofy.com/')
  })
})

describe('links', () => {
  it('só mostra redes marcadas como ativas', () => {
    expect(redesAtivas().every((r) => r.ativo)).toBe(true)
    for (const r of redes) expect(r.url).toMatch(/^https:\/\//)
  })

  it('não mostra lista de espera aberta sem endereço', () => {
    if (listaDeEspera.aberta) expect(listaDeEspera.url).toMatch(/^https:\/\//)
    else expect(listaDeEspera.aberta).toBe(false)
  })
})
