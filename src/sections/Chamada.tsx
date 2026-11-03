import { useState } from 'react'
import { BordaDePastilhas } from '../components/BordaDePastilhas'
import { Botao, BotaoLink } from '../components/Botao'
import { comDestaque } from '../components/Destaque'
import { Icone, type NomeDoIcone } from '../components/Icone'
import { DOMINIO, URL_DO_SITE, emailDeContato, listaDeEspera, redesAtivas } from '../content/links'
import { chamada } from '../content/site'
import { criarAleatorio } from '../lib/aleatorio'
import './chamada.css'

const ICONES: Record<string, NomeDoIcone> = { Instagram: 'instagram', TikTok: 'tiktok', X: 'x', YouTube: 'youtube' }

// Pastilhas soltas no fundo da chamada (posições fixas por semente), à direita
// do texto para não atrapalhar a leitura.
const rnd = criarAleatorio(41)
const PASTILHAS = Array.from({ length: 14 }, (_, i) => ({
  x: Math.round(60 + i * 2.6 + rnd.entre(0, 3)),
  y: Math.round(rnd.entre(4, 88)),
  lado: Math.round(rnd.entre(14, 44)),
  duracao: Math.round(rnd.entre(6, 11) * 10) / 10,
  atraso: Math.round(rnd.entre(0, 8) * 10) / 10,
}))

export function Chamada() {
  const [aviso, setAviso] = useState('')
  const redes = redesAtivas()

  const compartilhar = async () => {
    const dados = { title: 'Mosaicofy', text: chamada.textoDeCompartilhamento, url: URL_DO_SITE }
    try {
      if (navigator.share) {
        await navigator.share(dados)
        return
      }
      await navigator.clipboard.writeText(URL_DO_SITE)
      setAviso(chamada.compartilhado)
    } catch (erro) {
      // Cancelar o compartilhamento não é erro. Sem área de transferência, mostra o endereço.
      if ((erro as DOMException)?.name !== 'AbortError') setAviso(URL_DO_SITE)
    }
    window.setTimeout(() => setAviso(''), 3200)
  }

  return (
    <section id="acompanhar" className="chamada" aria-labelledby="chamada-titulo">
      <BordaDePastilhas cor="var(--coral)" semente={37} />
      <div className="chamada__pastilhas" aria-hidden="true">
        {PASTILHAS.map((p, i) => (
          <span
            key={i}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.lado,
              height: p.lado,
              animationDuration: `${p.duracao}s`,
              animationDelay: `${-p.atraso}s`,
            }}
          />
        ))}
      </div>
      <div className="conteiner chamada__interno">
        <p className="rotulo rotulo--tinta" data-revelar>
          <span className="rotulo__pastilha" aria-hidden="true" />
          {chamada.rotulo}
        </p>
        <h2 id="chamada-titulo" className="chamada__titulo" data-revelar>
          {comDestaque(chamada.titulo)}
        </h2>
        <p className="chamada__texto" data-revelar>
          {chamada.texto}
        </p>

        <div className="chamada__acoes" data-revelar>
          {listaDeEspera.aberta && listaDeEspera.url ? (
            <BotaoLink href={listaDeEspera.url} variante="escuro">
              {listaDeEspera.rotulo}
            </BotaoLink>
          ) : (
            <p className="chamada__situacao">
              <span className="chamada__luz" aria-hidden="true" />
              {chamada.situacao}
            </p>
          )}
          <Botao variante="escuro" icone="compartilhar" onClick={compartilhar}>
            {chamada.compartilhar}
          </Botao>
          <output className="chamada__aviso" aria-live="polite">
            {aviso && (
              <>
                <Icone nome="check" tamanho={16} />
                {aviso}
              </>
            )}
          </output>
        </div>

        <div className="chamada__redes" data-revelar>
          {redes.length > 0 || emailDeContato ? (
            <>
              <p>{chamada.comRedes}</p>
              <ul>
                {redes.map((r) => (
                  <li key={r.nome}>
                    <a className="pilula-link" href={r.url} target="_blank" rel="noopener noreferrer">
                      <Icone nome={ICONES[r.nome] ?? 'seta'} tamanho={18} />
                      {r.nome} <span>{r.usuario}</span>
                    </a>
                  </li>
                ))}
                {emailDeContato && (
                  <li>
                    <a className="pilula-link" href={`mailto:${emailDeContato}`}>
                      <Icone nome="email" tamanho={18} />
                      {emailDeContato}
                    </a>
                  </li>
                )}
              </ul>
            </>
          ) : (
            <p>{chamada.semRedes}</p>
          )}
        </div>

        <p className="chamada__dominio" aria-hidden="true">
          {DOMINIO}
        </p>
      </div>
    </section>
  )
}
