/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Caminho base do site.
// - Com o domínio mosaicofy.com (ou qualquer domínio próprio): "/" (padrão).
// - Na URL de projeto do GitHub Pages (https://<org>.github.io/<repositorio>/):
//   "/<repositorio>/". O workflow de deploy preenche BASE_PATH sozinho.
const caminho = process.env.BASE_PATH?.trim() || '/'
const base = caminho.endsWith('/') ? caminho : `${caminho}/`

const pagina = (arquivo: string) => resolve(import.meta.dirname, arquivo)

// Pede ao navegador as duas fontes da primeira tela logo no começo, para o
// texto não "pular" quando elas chegam.
const FONTES_DA_PRIMEIRA_TELA = /(plus-jakarta-sans-latin-wght-normal|instrument-serif-latin-400-italic)-[\w-]+\.woff2$/

function precarregarFontes(): Plugin {
  return {
    name: 'mosaicofy:precarregar-fontes',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, contexto) {
        if (!contexto.bundle) return
        return Object.keys(contexto.bundle)
          .filter((arquivo) => FONTES_DA_PRIMEIRA_TELA.test(arquivo))
          .map((arquivo) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${arquivo}`, crossorigin: true },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  base,
  plugins: [react(), precarregarFontes()],
  build: isSsrBuild
    ? { emptyOutDir: true }
    : {
        target: 'es2022',
        cssCodeSplit: true,
        rolldownOptions: {
          // Cada página estática vira um HTML de verdade: sem roteamento no
          // navegador e sem truques de 404 no GitHub Pages.
          input: {
            inicio: pagina('index.html'),
            privacidade: pagina('privacidade/index.html'),
            termos: pagina('termos/index.html'),
            naoEncontrado: pagina('404.html'),
          },
        },
      },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
}))
