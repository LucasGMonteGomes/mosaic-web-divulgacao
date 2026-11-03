/**
 * Pré-renderização estática: depois do `vite build`, coloca o HTML gerado pelo
 * React dentro de cada página em dist/. Assim o conteúdo aparece antes do
 * JavaScript carregar e buscadores e prévias de link conseguem ler o texto.
 */
import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const raiz = resolve(import.meta.dirname, '..')
const pasta = resolve(raiz, '.prerender')
const { render } = await import(pathToFileURL(resolve(pasta, 'entry-server.js')).href)

const paginas = [
  ['index.html', 'inicio'],
  ['privacidade/index.html', 'privacidade'],
  ['termos/index.html', 'termos'],
  ['404.html', '404'],
]

for (const [arquivo, pagina] of paginas) {
  const caminho = resolve(raiz, 'dist', arquivo)
  const html = await readFile(caminho, 'utf8')
  if (!html.includes('<!--app-->')) throw new Error(`Marcador <!--app--> não encontrado em ${arquivo}`)
  await writeFile(caminho, html.replace('<!--app-->', render(pagina)))
  console.log(`pré-renderizado: ${arquivo}`)
}

await rm(pasta, { recursive: true, force: true })
