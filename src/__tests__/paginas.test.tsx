import { describe, expect, it } from 'vitest'
import { navegacao, chamadaPrincipal } from '../content/site'
import { render, type Pagina } from '../entry-server'

const paginas: Pagina[] = ['inicio', 'privacidade', 'termos', '404']

describe('pré-renderização', () => {
  it.each(paginas)('renderiza "%s" com um único h1 e o link de pular para o conteúdo', (pagina) => {
    const html = render(pagina)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain('href="#conteudo"')
    expect(html).toContain('id="conteudo"')
    expect(html).not.toMatch(/undefined|NaN|\[object Object\]/)
  })

  it('tem uma seção para cada item do menu e para a chamada principal', () => {
    const html = render('inicio')
    for (const item of [...navegacao, chamadaPrincipal]) {
      expect(html, `faltou a seção #${item.ancora}`).toContain(`id="${item.ancora}"`)
    }
  })

  it('não tem imagem sem texto alternativo', () => {
    for (const pagina of paginas) {
      const imagens = render(pagina).match(/<img\b[^>]*>/g) ?? []
      for (const img of imagens) expect(img).toMatch(/\balt="/)
    }
  })

  it('abre links externos com segurança', () => {
    for (const pagina of paginas) {
      const externos = render(pagina).match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []
      for (const a of externos) expect(a).toMatch(/rel="[^"]*noopener/)
    }
  })
})
