/**
 * Textos das páginas de Privacidade, Termos e "não encontrado".
 * Versão inicial, escrita para o site de pré-lançamento (sem revisão jurídica).
 * Antes de abrir a lista de espera ou lançar o app, estes textos precisam ser
 * revistos (LGPD e regras das lojas). Veja o README.
 */

export type Secao = { titulo: string; paragrafos: string[]; link?: { rotulo: string; url: string } }

export type PaginaDeTexto = {
  titulo: string
  descricao: string
  atualizado: string
  introducao: string
  secoes: Secao[]
}

export const privacidade: PaginaDeTexto = {
  titulo: 'Privacidade',
  descricao: 'Como o site de pré-lançamento da Mosaicofy trata os seus dados: sem cadastro, sem cookies e sem rastreamento.',
  atualizado: 'Atualizado em 3 de novembro de 2026',
  introducao:
    'Esta página fala só deste site de pré-lançamento. A política de privacidade do aplicativo Mosaicofy vai ser publicada aqui antes do lançamento.',
  secoes: [
    {
      titulo: 'O que este site coleta',
      paragrafos: [
        'Nada que identifique você. O site não tem cadastro, formulário, cookies, nem ferramentas de análise ou de publicidade.',
        'As fontes, as imagens e as animações são servidas pelo próprio site, sem chamar serviços de terceiros enquanto você navega.',
      ],
    },
    {
      titulo: 'Hospedagem',
      paragrafos: [
        'O site é hospedado no GitHub Pages. Como qualquer servidor, o GitHub pode registrar dados técnicos de acesso, como o endereço IP, para manter o serviço seguro e funcionando. Esse tratamento segue a declaração de privacidade do GitHub.',
      ],
      link: {
        rotulo: 'Declaração de privacidade do GitHub',
        url: 'https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement',
      },
    },
    {
      titulo: 'O botão de compartilhar',
      paragrafos: [
        'Quando você usa “Mandar para alguém”, o endereço do site vai para o compartilhamento do seu próprio aparelho ou é copiado para a sua área de transferência. Nada disso é enviado para a gente.',
      ],
    },
    {
      titulo: 'Seus direitos',
      paragrafos: [
        'Como o site não guarda dados pessoais, não há o que consultar, corrigir ou apagar.',
        'Quando a lista de espera abrir, esta página vai explicar quais dados serão pedidos, para quê, por quanto tempo e como exercer os seus direitos, como manda a Lei Geral de Proteção de Dados (Lei 13.709/2018).',
      ],
    },
  ],
}

export const termos: PaginaDeTexto = {
  titulo: 'Termos de uso do site',
  descricao: 'Regras de uso do site de pré-lançamento da Mosaicofy.',
  atualizado: 'Atualizado em 3 de novembro de 2026',
  introducao:
    'Estes termos valem para o site mosaicofy.com durante o pré-lançamento. Os termos de uso do aplicativo vão ser publicados aqui antes do lançamento.',
  secoes: [
    {
      titulo: 'Sobre este site',
      paragrafos: [
        'O site apresenta a Mosaicofy, uma rede social em construção. Ele é informativo: ainda não existe conta, cadastro ou serviço disponível.',
      ],
    },
    {
      titulo: 'Ideias em construção',
      paragrafos: [
        'Tudo o que aparece aqui sobre o aplicativo descreve ideias e planos. Recursos, nomes, telas e datas podem mudar, ou não acontecer, até o lançamento.',
        'As pessoas, os perfis e as conversas mostrados nas telas de exemplo são fictícios.',
      ],
    },
    {
      titulo: 'Marca e conteúdo',
      paragrafos: [
        'O nome Mosaicofy, o símbolo do @, os textos, as ilustrações e o visual deste site pertencem aos criadores da Mosaicofy.',
        'Você pode compartilhar o link e citar o site. Não pode usar a marca para se passar pela Mosaicofy nem para vender produtos ou serviços.',
      ],
    },
    {
      titulo: 'Links externos',
      paragrafos: [
        'Se o site apontar para outros serviços, como redes sociais, o uso deles segue as regras de cada um.',
      ],
    },
    {
      titulo: 'Mudanças',
      paragrafos: [
        'Estes termos podem ser atualizados. A data no topo mostra a versão em vigor.',
      ],
    },
  ],
}

export const naoEncontrado = {
  titulo: 'Essa pastilha não está aqui.',
  texto: 'O endereço pode ter mudado, ou a página ainda não existe.',
  voltar: 'Voltar para o começo',
}
