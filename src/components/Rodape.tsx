import { emailDeContato, redesAtivas, DOMINIO } from '../content/links'
import './rodape.css'
import { acessibilidade, marca, navegacao, rodape } from '../content/site'
import { ancora, rota } from '../lib/caminhos'
import { BordaDePastilhas } from './BordaDePastilhas'
import { Icone, type NomeDoIcone } from './Icone'
import { Marca } from './Marca'

const ICONES: Record<string, NomeDoIcone> = {
  Instagram: 'instagram',
  TikTok: 'tiktok',
  X: 'x',
  YouTube: 'youtube',
}

export function Rodape({ naPaginaInicial = true }: { naPaginaInicial?: boolean }) {
  const redes = redesAtivas()
  return (
    <footer className="rodape">
      <BordaDePastilhas cor="var(--tinta)" semente={43} />
      <div className="rodape__interno">
        <div className="rodape__marca">
          <a href={naPaginaInicial ? '#topo' : rota()} aria-label={acessibilidade.inicio}>
            <Marca altura={44} tom="claro" />
          </a>
          <p className="rodape__frase">{marca.frase}</p>
          <p className="rodape__dominio">{DOMINIO}</p>
        </div>

        <nav className="rodape__colunas" aria-label="Rodapé">
          <div>
            <h2 className="rodape__titulo">{rodape.colunas.site}</h2>
            <ul>
              {navegacao.map((item) => (
                <li key={item.ancora}>
                  <a className="link-sublinhado" href={ancora(item.ancora, naPaginaInicial)}>
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="rodape__titulo">{rodape.colunas.mosaicofy}</h2>
            <ul>
              <li>
                <a className="link-sublinhado" href={rota('privacidade/')}>
                  {rodape.privacidade}
                </a>
              </li>
              <li>
                <a className="link-sublinhado" href={rota('termos/')}>
                  {rodape.termos}
                </a>
              </li>
              {emailDeContato && (
                <li>
                  <a className="link-sublinhado" href={`mailto:${emailDeContato}`}>
                    {emailDeContato}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="rodape__titulo">{rodape.colunas.redes}</h2>
            {redes.length > 0 ? (
              <ul>
                {redes.map((r) => (
                  <li key={r.nome}>
                    <a className="link-sublinhado rodape__rede" href={r.url} target="_blank" rel="noopener noreferrer">
                      <Icone nome={ICONES[r.nome] ?? 'seta'} tamanho={18} />
                      {r.nome}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rodape__embreve">{rodape.redesEmBreve}</p>
            )}
          </div>
        </nav>
      </div>

      <div className="rodape__base">
        <p>{marca.direitos}</p>
        <p>{marca.assinatura}</p>
        <a className="rodape__topo" href={naPaginaInicial ? '#topo' : '#conteudo'}>
          <Icone nome="topo" tamanho={18} />
          {rodape.voltarAoTopo}
        </a>
      </div>
    </footer>
  )
}
