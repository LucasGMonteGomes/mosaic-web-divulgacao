import { Cabecalho } from '../components/Cabecalho'
import { Icone } from '../components/Icone'
import { Rodape } from '../components/Rodape'
import type { PaginaDeTexto as Pagina } from '../content/paginas'
import { rota } from '../lib/caminhos'
import './paginas.css'

/** Modelo das páginas simples (Privacidade e Termos). */
export function PaginaDeTexto({ pagina }: { pagina: Pagina }) {
  return (
    <>
      <Cabecalho naPaginaInicial={false} />
      <main id="conteudo" tabIndex={-1} className="pagina">
        <article className="pagina__artigo conteiner-estreito">
          <a className="pagina__voltar link-sublinhado" href={rota()}>
            <Icone nome="esquerda" tamanho={16} />
            mosaicofy.com
          </a>
          <h1 className="pagina__titulo">{pagina.titulo}</h1>
          <p className="pagina__data">{pagina.atualizado}</p>
          <p className="pagina__intro">{pagina.introducao}</p>
          {pagina.secoes.map((secao) => (
            <section key={secao.titulo} className="pagina__secao">
              <h2>{secao.titulo}</h2>
              {secao.paragrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {secao.link && (
                <p>
                  <a className="link-sublinhado link-externo" href={secao.link.url} target="_blank" rel="noopener noreferrer">
                    {secao.link.rotulo}
                    <Icone nome="seta" tamanho={16} />
                  </a>
                </p>
              )}
            </section>
          ))}
        </article>
      </main>
      <Rodape naPaginaInicial={false} />
    </>
  )
}
