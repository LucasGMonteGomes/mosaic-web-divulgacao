# Política de segurança

## Escopo

Este repositório é o site de pré-lançamento da Mosaicofy ([mosaicofy.com](https://mosaicofy.com)): um site estático, gerado no build e publicado no GitHub Pages. Ele **não tem back-end, banco de dados, cadastro, login, formulários, cookies nem ferramentas de análise**, e não carrega scripts de terceiros: fontes, imagens e código saem do próprio domínio.

Entram no escopo desta política:

- O código do site (`src/`, `scripts/` e as páginas HTML) e o que ele publica.
- Os workflows do GitHub Actions (`.github/workflows/`).
- As dependências declaradas em `package.json` e `package-lock.json`.
- Links, metatags e conteúdos que possam levar alguém a um endereço malicioso.

Ficam fora: a infraestrutura do GitHub e do GitHub Pages, o provedor de DNS do domínio e o app e a API da Mosaicofy, que têm repositórios próprios.

## Versões suportadas

Só a versão publicada a partir da `main` recebe correções. Versões antigas não são corrigidas: a correção sai numa versão nova.

| Versão | Suporte |
| --- | --- |
| Última da `main` (1.x) | ✅ |
| Anteriores | ❌ |

## Como relatar uma vulnerabilidade

**Não abra issue, pull request ou discussão pública sobre uma vulnerabilidade.**

1. Fale em particular com um dos mantenedores, pelo contato do perfil no GitHub ou pelos canais internos da equipe:
   - Lucas: [@LucasGMonteGomes](https://github.com/LucasGMonteGomes)
   - Gabriel S. Machado: [@GabrielDS02](https://github.com/GabrielDS02)
2. Conte o que é o problema, onde está (arquivo, página ou workflow), como reproduzir e qual impacto você imagina.
3. Não faça testes que afetem outras pessoas nem acesse dados que não são seus.

O repositório é privado, então o "Private vulnerability reporting" do GitHub não está disponível aqui. Quando a Mosaicofy tiver um e-mail oficial, ele passa a ser o canal de relato e entra nesta página.

## O que acontece depois

1. Os mantenedores confirmam o recebimento e avaliam o impacto.
2. A correção é feita numa branch própria e entra por pull request. O site é publicado de novo no merge na `main`.
3. A correção fica registrada no [CHANGELOG](CHANGELOG.md), sem detalhes que ajudem a explorar versões antigas.
4. Quem relatou recebe o crédito, se quiser.

## Como o projeto se protege

- **Dependabot:** alertas e pull requests semanais de atualização para as dependências npm e para as GitHub Actions (`.github/dependabot.yml`).
- **CI em todo pull request:** lint, testes e build (`deploy.yml`), além de varredura de segredos (gitleaks), de dependências vulneráveis (Trivy) e análise estática de segurança (Semgrep) (`ci.yml`).
- **Varredura semanal:** toda segunda-feira, gitleaks em todo o histórico, Trivy e Semgrep (`security-weekly.yml`).
- **Sem segredos no repositório:** o deploy usa o token do próprio GitHub Actions, com permissões mínimas (`pages: write` e `id-token: write` só no job de publicação).
- **Links externos seguros:** os testes conferem que todo link que abre em outra aba usa `rel="noopener"`.
