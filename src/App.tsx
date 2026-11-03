import { Cabecalho } from './components/Cabecalho'
import { Rodape } from './components/Rodape'
import { Cenas } from './sections/Cenas'
import { Chamada } from './sections/Chamada'
import { Construcao } from './sections/Construcao'
import { Ideias } from './sections/Ideias'
import { Inicio } from './sections/Inicio'
import { Manifesto } from './sections/Manifesto'
import { PorVir } from './sections/PorVir'

/** Página inicial: cada seção revela um pouco mais da Mosaicofy. */
export function App() {
  return (
    <>
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Inicio />
        <Manifesto />
        <Ideias />
        <Cenas />
        <PorVir />
        <Construcao />
        <Chamada />
      </main>
      <Rodape />
    </>
  )
}
