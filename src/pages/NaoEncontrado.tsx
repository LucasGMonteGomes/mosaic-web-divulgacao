import { BotaoLink } from '../components/Botao'
import { Simbolo } from '../components/Simbolo'
import { Cabecalho } from '../components/Cabecalho'
import { naoEncontrado } from '../content/paginas'
import { rota } from '../lib/caminhos'
import './paginas.css'

export function NaoEncontrado() {
  return (
    <>
      <Cabecalho naPaginaInicial={false} />
      <main id="conteudo" tabIndex={-1} className="pagina pagina--404">
        <div className="pagina-404 conteiner-estreito">
          <div className="pagina-404__arte" aria-hidden="true">
            <span />
            <span />
            <Simbolo tamanho={96} />
            <span />
          </div>
          <h1 className="pagina__titulo">{naoEncontrado.titulo}</h1>
          <p className="pagina__intro">{naoEncontrado.texto}</p>
          <BotaoLink href={rota()}>{naoEncontrado.voltar}</BotaoLink>
        </div>
      </main>
    </>
  )
}
