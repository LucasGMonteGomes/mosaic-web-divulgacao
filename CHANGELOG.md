# Changelog

Todas as mudanças relevantes deste projeto ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não publicado]

## [1.0.0] - 2026-11-03

Primeira versão do site de pré-lançamento da Mosaicofy.

### Adicionado

- Página inicial com as seções abertura (as pastilhas se juntam no @ cursivo conforme a página rola), manifesto, "O que estamos desenhando" (4 ideias em telas de exemplo), carrossel de cenas (mouse, teclado e toque), "O que está por vir" (os 5 pilares), "Pastilha por pastilha" (obra animada e diário do projeto) e chamada final.
- Páginas de privacidade (`/privacidade/`), termos (`/termos/`) e erro 404.
- Pré-renderização estática de todas as páginas no build.
- Identidade visual: @ cursivo liso e em mosaico, nome "mosaicofy" com o pingo em pastilha, paleta e as fontes Plus Jakarta Sans e Instrument Serif servidas pelo próprio site.
- SEO e compartilhamento: title, description, canonical, Open Graph, Twitter Card, JSON-LD, `site.webmanifest`, `robots.txt`, `sitemap.xml`, favicons, ícones e imagem de compartilhamento de 1200 x 630.
- Versão mais leve das animações para celulares e aparelhos modestos, e respeito ao movimento reduzido.
- Testes de conteúdo, das bibliotecas de desenho e da pré-renderização.
- Workflow do GitHub Actions com lint, testes e build em todo pull request e publicação no GitHub Pages a cada push na `main`.
- CI com conferência do título do PR, varredura de segredos (gitleaks), de dependências (Trivy) e análise estática (Semgrep), além da varredura semanal.
- Dependabot para as dependências npm e as GitHub Actions.
- README com banner, guias de uso, publicação, domínio e DNS.
- Licença MIT, Código de Conduta, guia de contribuição, política de segurança e este changelog.
- Modelos de issue e de pull request, CODEOWNERS, `.editorconfig` e `.gitattributes`.

[Não publicado]: https://github.com/txsoft-engineering/mosaic-web-divulgacao/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/txsoft-engineering/mosaic-web-divulgacao/releases/tag/v1.0.0
