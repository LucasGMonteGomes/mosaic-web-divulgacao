# Como contribuir

Obrigado por ajudar a construir a Mosaicofy. Este guia explica como trabalhamos neste repositório. Ao participar, você concorda com o [Código de Conduta](CODE_OF_CONDUCT.md).

## Sumário

- [Antes de começar](#antes-de-começar)
- [Ambiente](#ambiente)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Commits](#commits)
- [Pull requests e revisão](#pull-requests-e-revisão)
- [Regras de conteúdo](#regras-de-conteúdo)
- [Código](#código)
- [Versões e releases](#versões-e-releases)

## Antes de começar

- Leia o [README](README.md), principalmente [Editar os textos](README.md#editar-os-textos) e [Identidade visual](README.md#identidade-visual).
- **Mudança grande** (seção nova, troca de visual, dependência nova): abra antes uma issue com o modelo "Ideia ou melhoria" e combine com a equipe.
- **Problema no site:** abra uma issue com o modelo "Problema no site".
- **Vulnerabilidade:** nunca em issue pública. Siga a [Política de segurança](SECURITY.md).

## Ambiente

Precisa de **Node.js 24 LTS** (indicado no `.nvmrc`; funciona a partir da 20.19).

```bash
git clone git@github.com:txsoft-engineering/mosaic-web-divulgacao.git
cd mosaic-web-divulgacao
npm ci
npm run dev        # http://localhost:5173
```

Use um editor que respeite o `.editorconfig` (UTF-8, fim de linha LF, 2 espaços). O `.gitattributes` mantém LF no repositório mesmo quando o trabalho é feito no Windows.

## Fluxo de trabalho

1. **Nada vai direto para a `main`.** Todo trabalho sai de uma branch nova a partir da `main` atualizada:

   ```bash
   git switch main && git pull
   git switch -c <tipo>/<descricao-curta>
   ```

   O nome da branch é em inglês, minúsculas e com hífens: `feat/waitlist-page`, `fix/footer-links`, `docs/dns-steps`.

2. Faça commits pequenos, no formato de [Commits](#commits).
3. Antes de abrir o PR, rode **`npm run check`** (lint, testes e build). Se mudou algum SVG em `assets-fonte/`, rode também `npm run assets` e inclua os PNGs gerados.
4. Acrescente o que mudou na seção "Não publicado" do [CHANGELOG](CHANGELOG.md).
5. Abra o PR como rascunho e siga [Pull requests e revisão](#pull-requests-e-revisão).

## Commits

[Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), em **inglês** e no imperativo:

```
<tipo>(<escopo opcional>): <o que muda>
```

| Tipo | Quando usar |
| --- | --- |
| `feat` | Seção, página ou recurso novo no site |
| `fix` | Correção de texto, visual, link ou comportamento |
| `refactor` | Mudança de código sem mudar o que o site faz |
| `test` | Testes novos ou ajustados |
| `docs` | README, guias e documentação |
| `chore` | Manutenção: configuração, metadados, arquivos de apoio |
| `ci` | Workflows do GitHub Actions |
| `style`, `perf`, `build` | Formatação, desempenho e build/dependências |

Exemplos:

```
feat(cenas): add photo support to carousel scenes
fix(rodape): hide social links until profiles exist
docs: explain DNS setup for www subdomain
```

### Identidade, assinatura e coautoria

- Cada pessoa faz commits, PRs e revisões com a **própria conta do GitHub**, com `user.email` igual a um e-mail verificado da conta ou ao e-mail `noreply` dela.
- **Commits assinados** (SSH ou GPG), com a chave cadastrada no GitHub como *Signing key*. Não use `--no-gpg-sign`.
- `Co-authored-by` só entre pessoas que trabalharam juntas no commit, com o e-mail `noreply` do GitHub de cada uma. Exemplo:

  ```
  feat: add waitlist page

  Co-authored-by: LucasGMonteGomes <218098777+LucasGMonteGomes@users.noreply.github.com>
  ```

- **Nenhuma linha de autoria de IA** em commit ou PR: nada de "Generated with", `Co-authored-by` de assistente de IA ou parecido.

## Pull requests e revisão

1. Abra como **rascunho** (`gh pr create --draft`) e marque como pronto quando o CI passar.
2. **Título igual ao commit principal**, em Conventional Commits. O CI confere o formato.
3. **Descrição em português**, seguindo o modelo: o que muda, por que, como testar e o checklist. Se mudou algo visual, anexe prints de celular e computador. Cite a issue (`Closes #12`).
4. **Quem abriu o PR não aprova o próprio.** A revisão é do outro dev, e o merge pede 1 aprovação.
5. Com o CI verde e a aprovação, qualquer um dos dois faz o merge por **squash**, apagando a branch. Confira se as linhas `Co-authored-by` continuam na mensagem final do squash.

## Regras de conteúdo

O site fala em nome da Mosaicofy antes de o app existir. Por isso:

- **Textos ficam em `src/content/`.** Não escreva texto direto nos componentes. O site é em português do Brasil.
- **Nada aparece como se já existisse.** Lives, música, notícias, lista de espera e app só aparecem como "em construção" ou "em breve" até existirem de verdade. Os testes barram promessas como "baixe agora".
- **Sem marcas de clubes**: nada de escudos, nomes ou uniformes oficiais.
- **Sem pessoas reais sem autorização.** Perfis, nomes e conversas das telas de exemplo são fictícios. Foto de pessoa só com autorização de uso de imagem por escrito (termo de imagem em `mosaic-docs/marketing`).
- **Privacidade e termos:** ao mudar o texto, atualize a data `atualizado` em `src/content/paginas.ts` e o `lastmod` em `public/sitemap.xml`.
- **Redes, e-mail e lista de espera** só são ligados em `src/content/links.ts` quando existirem e o endereço tiver sido conferido.

## Código

- **TypeScript** em todo o código; o `npm run build` confere os tipos.
- **CSS puro**, um arquivo por seção, com cores, fontes e medidas só pelos tokens de `src/styles/tokens.css`.
- **Acessibilidade:** HTML semântico, foco visível, navegação por teclado, textos alternativos e contraste conferido. O lint inclui as regras de `jsx-a11y`.
- **Movimento reduzido:** toda animação nova respeita `prefers-reduced-motion` (veja `useMovimentoReduzido` em `src/lib/movimento.ts`).
- **Desempenho:** animações só com `transform`, `opacity` e Canvas. Nada de bibliotecas de animação ou de interface sem conversar antes.
- **Dependência nova:** explique no PR por que ela é necessária. As atualizações ficam com o Dependabot.
- **Testes:** comportamento novo ganha teste em `src/__tests__/`.

## Versões e releases

O projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-BR/) e registra tudo no [CHANGELOG](CHANGELOG.md), no formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

| Parte | Quando sobe | Exemplo |
| --- | --- | --- |
| MAJOR (`2.0.0`) | Reformulação do site ou mudança que quebra endereços já divulgados | Trocar a estrutura de páginas |
| MINOR (`1.1.0`) | Seção, página ou recurso novo | Abrir a lista de espera |
| PATCH (`1.0.1`) | Correção de texto, visual, link ou dependência | Ajustar um link do rodapé |

Como sai uma versão:

1. Os PRs vão acumulando linhas em "Não publicado" no CHANGELOG.
2. Um PR de versão troca "Não publicado" pelo número e pela data, e atualiza o `version` do `package.json` e do `package-lock.json`.
3. Depois do merge, o Lucas cria a tag `vX.Y.Z` na `main` e publica a release no GitHub com as notas do CHANGELOG.

O site é publicado a cada merge na `main`. A tag e a release registram a versão; não são elas que publicam.
