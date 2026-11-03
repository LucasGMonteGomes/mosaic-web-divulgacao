import { describe, expect, it } from 'vitest'
import { semMarcacao } from '../components/Destaque'
import { criarAleatorio } from '../lib/aleatorio'
import { ARROBA_TRACO, criarMedidorDoTraco, pastilhasDoArroba } from '../lib/arroba'
import { ancora, rota } from '../lib/caminhos'
import { LADO_DO_GLIFO, glifoAceso } from '../lib/glifos'

describe('sorteio com semente', () => {
  it('repete a mesma sequência para a mesma semente', () => {
    const a = criarAleatorio(42)
    const b = criarAleatorio(42)
    const sa = Array.from({ length: 20 }, () => a.proximo())
    const sb = Array.from({ length: 20 }, () => b.proximo())
    expect(sa).toEqual(sb)
    expect(sa.every((n) => n >= 0 && n < 1)).toBe(true)
  })

  it('muda com outra semente', () => {
    expect(criarAleatorio(1).proximo()).not.toBe(criarAleatorio(2).proximo())
  })
})

describe('pastilhas do @', () => {
  const pastilhas = pastilhasDoArroba(3)

  it('cobre o traço com centenas de peças', () => {
    expect(pastilhas.length).toBeGreaterThan(200)
  })

  it('não deixa peças sobrepostas', () => {
    const lado = ARROBA_TRACO / 3
    for (let i = 0; i < pastilhas.length; i++) {
      for (let j = i + 1; j < pastilhas.length; j++) {
        const d = Math.hypot(pastilhas[i].x - pastilhas[j].x, pastilhas[i].y - pastilhas[j].y)
        expect(d).toBeGreaterThanOrEqual(lado * 0.9 - 1e-6)
      }
    }
  })

  it('mantém as peças em cima do traço', () => {
    const medir = criarMedidorDoTraco()
    for (const p of pastilhas) expect(medir(p.x, p.y)).toBeLessThan(ARROBA_TRACO * 0.6)
  })
})

describe('glifos dos pilares', () => {
  it('têm 9 x 9 pastilhas e alguma acesa', () => {
    for (const g of ['aspas', 'cerquilha', 'seta', 'perto', 'faisca'] as const) {
      const mapa = glifoAceso(g)
      expect(mapa).toHaveLength(LADO_DO_GLIFO * LADO_DO_GLIFO)
      expect(mapa.some(Boolean)).toBe(true)
    }
  })
})

describe('caminhos', () => {
  it('monta rotas a partir da base do site', () => {
    expect(rota('privacidade/')).toBe(`${import.meta.env.BASE_URL}privacidade/`)
    expect(ancora('manifesto', true)).toBe('#manifesto')
    expect(ancora('manifesto', false)).toBe(`${import.meta.env.BASE_URL}#manifesto`)
  })

  it('tira os asteriscos de destaque', () => {
    expect(semMarcacao('De perto, *pedaços*.')).toBe('De perto, pedaços.')
  })
})
