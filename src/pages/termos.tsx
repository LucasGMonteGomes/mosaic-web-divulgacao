import '../styles/index'
import { termos } from '../content/paginas'
import { montar } from '../lib/montar'
import { PaginaDeTexto } from './PaginaDeTexto'

montar(<PaginaDeTexto pagina={termos} />)
