# Site de divulgação da Mosaicofy

Site de pré-lançamento da Mosaicofy, publicado em **https://mosaicofy.com**.

É um site estático em React: o build gera HTML pronto para cada página (o conteúdo aparece antes do JavaScript e é lido por buscadores) e o resultado vai para o GitHub Pages por um workflow do GitHub Actions. Não tem servidor, banco de dados, cadastro, cookies nem ferramentas de análise.

A ideia central do site é a frase da marca: **"De perto, pedaços. De longe, você."** Na abertura, as pastilhas começam espalhadas e, conforme a pessoa rola a página, se juntam no @ da Mosaicofy.

## Sumário

- [O que tem no site](#o-que-tem-no-site)
- [Tecnologias](#tecnologias)
- [Começando](#começando)
- [Onde fica cada coisa](#onde-fica-cada-coisa)
- [Editar os textos](#editar-os-textos)
- [Trocar imagens e vídeos](#trocar-imagens-e-vídeos)
- [Links, redes e lista de espera](#links-redes-e-lista-de-espera)
- [Identidade visual](#identidade-visual)
- [Animações, acessibilidade e desempenho](#animações-acessibilidade-e-desempenho)
- [SEO e compartilhamento](#seo-e-compartilhamento)
- [Publicar no GitHub Pages](#publicar-no-github-pages)
- [Domínio mosaicofy.com e DNS](#domínio-mosaicofycom-e-dns)
- [Qualidade: lint, testes e Lighthouse](#qualidade-lint-testes-e-lighthouse)

## O que tem no site

| Seção | O que faz |
| --- | --- |
| Abertura | Nome, frase, chamada e o campo de pastilhas que forma o @ com a rolagem. Reage ao mouse e ao toque. |
| Manifesto | Por que a Mosaicofy existe. As palavras acendem conforme a leitura avança. |
| O que estamos desenhando | Quatro ideias (perfil, salas por hashtag, Trending, Modo Leitor) em telas de celular de exemplo, todas marcadas como "ideia em construção". |
| Cenas | Carrossel horizontal com momentos do dia a dia em ilustrações de pastilhas. Funciona com mouse (arrastar), teclado (setas, Home, End) e toque. |
| O que está por vir | Os cinco pilares (Expressão, Comunidade, Descoberta, Proximidade, Criatividade) num acordeão com um desenho em pastilhas para cada um. |
| Pastilha por pastilha | O momento de expectativa: uma obra em pastilhas sendo assentada, com o diário de obra do projeto. |
| Chega mais perto | Chamada final honesta: a lista de espera ainda não abriu, então o site diz isso e oferece compartilhar o endereço. |
| Rodapé | Marca, domínio, links, redes (quando existirem), privacidade e termos. |

Também há as páginas **/privacidade/**, **/termos/** e a página de erro **404**.

Nada no site apresenta lives, música, notícias ou outros recursos como se já existissem. Também não há marcas de clubes nem pessoas reais: perfis e conversas nas telas de exemplo são fictícios.

## Tecnologias

- **React 19 + TypeScript**, montado com **Vite 8**.
- **Pré-renderização estática** feita no build (`src/entry-server.tsx` + `scripts/prerender.mjs`). No navegador, o React só "acorda" o HTML que já veio pronto.
- **CSS puro** com variáveis (sem framework), um arquivo por seção.
- **Canvas 2D** para as animações de pastilhas, sem bibliotecas de animação.
- **Fontes servidas pelo próprio site** com `@fontsource` (licença OFL): Plus Jakarta Sans e Instrument Serif.
- **oxlint** para o lint e **Vitest** para os testes.
- **@resvg/resvg-js** (só no desenvolvimento) para gerar os PNGs dos ícones e da imagem de compartilhamento.

## Começando

Precisa de **Node.js 24 LTS** (o arquivo `.nvmrc` indica a versão; qualquer versão a partir da 20.19 funciona).

```bash
git clone git@github.com:txsoft-engineering/mosaic-web-divulgacao.git
cd mosaic-web-divulgacao
npm install
npm run dev        # servidor de desenvolvimento em http://localhost:5173
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarga automática. |
| `npm run build` | Confere os tipos, gera o site em `dist/` e pré-renderiza as páginas. |
| `npm run preview` | Serve o `dist/` em http://localhost:4173 para conferir o build. |
| `npm run lint` | Lint com oxlint (inclui regras de acessibilidade). |
| `npm test` | Testes com Vitest. |
| `npm run check` | Lint, testes e build de uma vez. Rode antes de abrir um PR. |
| `npm run assets` | Regera os PNGs e o `favicon.ico` a partir de `assets-fonte/`. |

Para testar o build como ele fica na URL de projeto do GitHub Pages (com subpasta), use a variável `BASE_PATH`:

```bash
BASE_PATH=/mosaic-web-divulgacao npm run build && BASE_PATH=/mosaic-web-divulgacao npm run preview
# abre em http://localhost:4173/mosaic-web-divulgacao/
```

## Onde fica cada coisa

```
mosaic-web-divulgacao/
├── .github/workflows/deploy.yml   ← lint, testes, build e publicação no GitHub Pages
├── index.html, privacidade/, termos/, 404.html   ← uma página HTML de verdade para cada rota (metatags ficam aqui)
├── public/                     ← copiado como está para o site
│   ├── CNAME                   ← domínio (mosaicofy.com)
│   ├── favicon.ico / favicon.svg / apple-touch-icon.png / icone-*.png
│   ├── og-image.png            ← imagem de compartilhamento (1200 x 630)
│   ├── site.webmanifest, robots.txt, sitemap.xml
│   └── marca/                  ← logo, nome e símbolo em SVG (claro e escuro)
├── assets-fonte/               ← SVGs de origem dos ícones e da imagem de compartilhamento
├── scripts/
│   ├── prerender.mjs           ← coloca o HTML pré-renderizado dentro de cada página
│   └── gerar-imagens.mjs       ← SVG → PNG e favicon.ico (npm run assets)
└── src/
    ├── content/                ← TODOS os textos e links (é aqui que se edita o conteúdo)
    │   ├── site.ts             ← textos da página inicial
    │   ├── paginas.ts          ← privacidade, termos e 404
    │   └── links.ts            ← domínio, redes sociais, e-mail e lista de espera
    ├── sections/               ← uma seção da página inicial por arquivo (.tsx + .css)
    ├── components/             ← cabeçalho, rodapé, botões, marca, ícones, celular de exemplo
    ├── pages/                  ← páginas de texto e 404
    ├── lib/                    ← animações (campo.ts, obra.ts, cenas.ts), desenho do @, utilidades
    ├── styles/                 ← tokens.css (cores, fontes, medidas) e global.css
    └── __tests__/              ← testes
```


## Editar os textos

Todo o texto está em `src/content/`. Não é preciso mexer nos componentes para trocar uma frase.

- **Página inicial:** `src/content/site.ts`. Cada seção tem um bloco com o mesmo nome (`inicio`, `manifesto`, `ideias`, `cenas`, `porVir`, `construcao`, `chamada`, `rodape`).
- **Privacidade, termos e 404:** `src/content/paginas.ts`. Ao mudar privacidade ou termos, atualize também o campo `atualizado` (a data mostrada no topo) e o `lastmod` em `public/sitemap.xml`.
- **Título e descrição para buscadores e redes:** nas tags `<title>`, `description`, `og:*` e `twitter:*` de cada HTML (`index.html`, `privacidade/index.html`, `termos/index.html`).

Palavras entre asteriscos viram destaque (itálico serifado):

```ts
titulo: ['De perto, *pedaços*.', 'De longe, *você*.'],
```

O diário de obra (seção "Pastilha por pastilha") fica em `construcao.diario`. Cada etapa tem uma `situacao`: `'pronto'`, `'em andamento'`, `'em breve'` ou `'depois do teste'`.

Depois de editar, rode `npm test`: os testes avisam se sobrou asterisco sem par, texto provisório ou alguma promessa do tipo "baixe agora".

## Trocar imagens e vídeos

**Cenas do carrossel.** Hoje são ilustrações em pastilhas desenhadas pelo código. Para usar uma foto real numa cena:

1. Coloque a imagem em `public/cenas/` (proporção 4:5, por exemplo 1000 x 1250 px, em WebP ou AVIF, de preferência com menos de 200 KB).
2. Em `src/content/site.ts`, na cena desejada, preencha `imagem: 'cenas/nome-do-arquivo.webp'` e revise o `alt` para descrever a foto.

Use só fotos com autorização de uso e de imagem (veja o termo de imagem em `mosaic-docs/marketing`). Evite escudos e marcas de clubes.

**Telas de celular.** As telas da seção "O que estamos desenhando" são feitas em HTML e CSS em `src/components/TelaDoCelular.tsx`. Os textos delas (nomes fictícios, hashtags) estão no próprio componente.

**Vídeo.** O site não usa vídeo hoje: o momento de expectativa é a animação da obra em pastilhas, que pesa poucos KB. Se um dia entrar um vídeo, use os dois formatos e uma imagem de capa, sem som e respeitando o movimento reduzido:

```tsx
<video autoPlay muted loop playsInline preload="none" poster={rota('videos/teaser.webp')}>
  <source src={rota('videos/teaser.webm')} type="video/webm" />
  <source src={rota('videos/teaser.mp4')} type="video/mp4" />
</video>
```

Coloque os arquivos em `public/videos/`. Para quem tem `prefers-reduced-motion`, mostre só a imagem de capa (veja `useMovimentoReduzido` em `src/lib/movimento.ts`).

**Ícones e imagem de compartilhamento.** Os originais em SVG estão em `assets-fonte/`. Edite o SVG (Figma, Inkscape ou outro editor vetorial) e rode `npm run assets` para gerar de novo os PNGs e o `favicon.ico` em `public/`. O texto da `og-image.svg` já está convertido em curvas; para trocar a frase, edite com as fontes Plus Jakarta Sans e Instrument Serif instaladas e converta o texto em curvas antes de salvar.

## Links, redes e lista de espera

Tudo em `src/content/links.ts`.

- **Redes sociais:** cada rede tem `ativo: false`. Enquanto estiver assim, o link não aparece (o rodapé mostra "Em breve"). Quando o perfil existir, confira o endereço e troque para `ativo: true`.
- **E-mail de contato:** `emailDeContato` está `null`. Preencha quando a caixa existir; ele aparece no rodapé e na chamada final.
- **Lista de espera:** quando houver uma página de cadastro de verdade, preencha `listaDeEspera.url` e troque `aberta` para `true`. O botão aparece na chamada final no lugar do aviso "abre em breve". Lembre de atualizar a página de privacidade antes.

## Identidade visual

O símbolo é o **@ cursivo** escolhido em 03/11/2026: traço único, pontas redondas, inclinado, creme sobre coral. No site ele aparece liso (favicon, cabeçalho) e em mosaico (abertura, ícones do app, imagem de compartilhamento). O desenho do @ está em `src/lib/arroba.ts` e o do nome em `src/lib/marca-caminhos.ts`; os arquivos para uso fora do site estão em `public/marca/`.

**Cores** (em `src/styles/tokens.css`):

| Nome | Cor | Uso |
| --- | --- | --- |
| Tinta | `#17161B` | Texto principal e fundos escuros |
| Papel | `#F6F5F2` | Fundo principal |
| Creme | `#FFF6EE` | Texto sobre escuro, o @ sobre coral |
| Coral | `#FF5B3A` | Cor da marca: fundos, botões, pastilhas |
| Coral para texto | `#C8391B` | Coral escurecido para texto sobre fundo claro (contraste) |
| Âmbar | `#F5B544` | Apoio |
| Vinho | `#A8241A` | Apoio |
| Campo | `#2F7D4E` | Apoio (o verde do futebol) |
| Céu | `#5F8FCB` | Apoio |
| Areia | `#E9DCC8` | Apoio |

**Tipografia:** Plus Jakarta Sans (títulos em 800 com espaçamento apertado, texto em 400 a 600) e Instrument Serif itálica para os destaques. Ambas com licença OFL e servidas pelo próprio site.

**Regras rápidas:**

- O coral puro não é usado para texto pequeno sobre fundo claro: use `--coral-texto`.
- O pingo do "i" do nome é uma pastilha coral levemente girada. Sobre fundo coral, ela fica creme.
- Pastilhas sempre com cantos arredondados (cerca de 24% do lado) e um leve giro aleatório, nunca alinhadas como pixels perfeitos.
- Ícones de interface são traço simples de 2 px, cantos redondos (`src/components/Icone.tsx`).
- Nada de gradientes chamativos ou sombras duras: a textura vem das pastilhas.

## Animações, acessibilidade e desempenho

- As animações usam só `transform` e `opacity` no CSS, e Canvas para as pastilhas. Nenhuma sequestra a rolagem: a página rola sempre do jeito normal.
- Com **movimento reduzido** ativado no sistema, as pastilhas já aparecem no lugar, nada flutua e as transições são cortadas.
- Em **aparelhos modestos** (até 4 núcleos ou 4 GB de memória, ou com economia de dados), a abertura usa menos peças e resolução menor, e o parallax do carrossel é desligado. No celular, a abertura já começa com as peças espalhadas e o quadro só é redesenhado quando algo muda.
- As animações param quando saem da tela ou quando a aba fica em segundo plano.
- HTML semântico, link "Pular para o conteúdo", foco visível, navegação por teclado no carrossel e no acordeão, textos alternativos para todas as ilustrações e contraste conferido (as palavras "apagadas" do manifesto têm pelo menos 3:1).
- Sem JavaScript, o site continua legível: o conteúdo está no HTML pré-renderizado e as revelações ao rolar só existem quando o JavaScript carrega.
- As ilustrações das cenas são carregadas só quando o carrossel chega perto da tela (divisão de código).

## SEO e compartilhamento

Cada página tem título, descrição, URL canônica, Open Graph, Twitter Card, `theme-color` e ícones. A página inicial tem dados estruturados (JSON-LD de `Organization` e `WebSite`). Também há `robots.txt`, `sitemap.xml` e `site.webmanifest`. A 404 tem `noindex`.

Se o site mudar de domínio, troque `https://mosaicofy.com` nos HTMLs, em `public/robots.txt`, em `public/sitemap.xml`, em `public/CNAME` e em `src/content/links.ts`.

Para conferir a imagem de compartilhamento depois de publicar, use o depurador de compartilhamento de cada rede (por exemplo, o do Facebook ou o validador de cards do LinkedIn).

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy.yml` faz tudo sozinho:

- Em pull requests: lint, testes e build (confere se está tudo certo, sem publicar).
- Em push na `main`: lint, testes, build e publicação no GitHub Pages.
- Também pode ser rodado à mão em **Actions → Site de divulgação → Run workflow**.

**Configuração única (feita por quem é admin do repositório):**

1. Em **Settings → Pages**, em **Build and deployment → Source**, escolha **GitHub Actions**.
2. Faça o merge do PR na `main` (ou rode o workflow à mão). O endereço aparece em **Settings → Pages** e no resumo do workflow.

Enquanto o domínio não estiver configurado, o site fica em `https://txsoft-engineering.github.io/mosaic-web-divulgacao/`. O workflow descobre sozinho o caminho base (subpasta ou domínio próprio) e passa para o build em `BASE_PATH`; não precisa mudar nada no código.

Observações:

- Mesmo com o repositório privado, o site publicado é público.
- Com deploy por Actions, quem manda no domínio é a configuração em **Settings → Pages → Custom domain**. O arquivo `public/CNAME` fica como registro do domínio.

## Domínio mosaicofy.com e DNS

Passo a passo para ligar o domínio:

1. **Verificar o domínio na organização** (protege contra outra conta usar o domínio): em **github.com/organizations/txsoft-engineering/settings/pages**, clique em **Add a domain**, digite `mosaicofy.com` e crie no DNS o registro **TXT** que o GitHub mostrar (algo como `_github-pages-challenge-txsoft-engineering.mosaicofy.com`). Depois clique em **Verify**.
2. **Criar os registros no DNS** do domínio:

   | Tipo | Nome | Valor |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `txsoft-engineering.github.io` |

3. Em **Settings → Pages → Custom domain** do repositório, digite `mosaicofy.com` e salve. O GitHub confere o DNS (pode levar de minutos a algumas horas).
4. Quando o certificado sair, marque **Enforce HTTPS**.

**Se o DNS estiver na Cloudflare:** deixe os registros acima como **DNS only** (nuvem cinza) até o GitHub emitir o certificado e o HTTPS funcionar. Se depois quiserem passar pelo proxy da Cloudflare (nuvem laranja), use o modo SSL **Full (strict)** para não criar um loop de redirecionamento.

Confira com `dig mosaicofy.com +short` e `dig www.mosaicofy.com +short` (ou um verificador de DNS online). O `www` passa a redirecionar para `mosaicofy.com` automaticamente.

## Qualidade: lint, testes e Lighthouse

- `npm run lint`: oxlint com regras de React, hooks, TypeScript e acessibilidade (`jsx-a11y`). O projeto usa oxlint porque o TypeScript 7 ainda não é suportado pelo typescript-eslint.
- `npm test`: confere o conteúdo (sem texto provisório, sem promessas falsas, destaques bem fechados, descrições das imagens), as bibliotecas de desenho (o @ sem pastilhas sobrepostas, sorteios repetíveis) e a pré-renderização de todas as páginas (um único `h1`, link de pular conteúdo, uma seção para cada item do menu, imagens com `alt`, links externos seguros).
- **Lighthouse:** com o build servido por `npm run preview`, abra o Chrome em http://localhost:4173, DevTools → Lighthouse, e rode nos modos celular e computador. Na última medição (03/11/2026) a página inicial ficou em 98 / 100 / 100 / 100 no celular e 100 / 100 / 100 / 100 no computador (desempenho, acessibilidade, boas práticas e SEO).
