/**
 * Todos os textos do site ficam aqui.
 *
 * Marcação simples dentro dos textos:
 *   *assim*  → destaque em itálico (Instrument Serif), usado nas palavras-chave.
 * Não use HTML. Veja o README, seção "Como editar os textos".
 */

export const marca = {
  nome: 'Mosaicofy',
  frase: 'De perto, pedaços. De longe, você.',
  direitos: '© 2026 Mosaicofy',
  assinatura: 'Feito no Brasil, pastilha por pastilha.',
}

export const navegacao = [
  { rotulo: 'Manifesto', ancora: 'manifesto' },
  { rotulo: 'Ideias', ancora: 'ideias' },
  { rotulo: 'Cenas', ancora: 'cenas' },
  { rotulo: 'Por vir', ancora: 'por-vir' },
] as const

export const chamadaPrincipal = { rotulo: 'Quero ver de perto', ancora: 'acompanhar' }

export const inicio = {
  selo: 'Em construção',
  // O título é dividido em duas linhas; cada linha pode ter uma palavra em destaque.
  titulo: ['De perto, *pedaços*.', 'De longe, *você*.'],
  texto:
    'Mosaicofy é uma rede nova para as fotos e os vídeos da sua vida, e para tudo o que está acontecendo agora. A gente está montando tudo com calma, e quer você por perto desde o começo.',
  secundario: { rotulo: 'Por que estamos fazendo isso', ancora: 'manifesto' },
  dica: 'Role a página e veja os pedaços se juntarem',
  descricaoDaAnimacao:
    'Pastilhas coloridas espalhadas pela tela que, conforme a página rola, se juntam e formam o símbolo da Mosaicofy, um @ em letra cursiva.',
}

export const manifesto = {
  rotulo: 'Manifesto',
  paragrafos: [
    'Em algum momento, postar virou *prova*.',
    'Perfil arrumado feito vitrine. Foto que fica na galeria porque “não combina com o feed”. Opinião guardada para não virar print.',
    'Só que a vida não vem em ordem. Tem a foto tremida que foi a melhor da noite, o almoço de domingo que ninguém posta, o grito no gol aos 47 do segundo tempo.',
    'A Mosaicofy está sendo feita para caber tudo isso. *Seu perfil não é placar.* E o calor do momento tem um lugar para acontecer, sem ficar grudado em você.',
    'Cada momento é uma pastilha. De perto, parecem pedaços soltos. *De longe, é você.*',
  ],
  assinatura: 'que estão construindo a Mosaicofy',
}

// Quem está por trás do projeto. As fotos vêm direto do GitHub sem precisar
// da API: https://github.com/<usuario>.png resolve para o avatar do perfil.
// Se você trocar de foto no GitHub, é só atualizar a query string (?v=2) aqui.
export type Desenvolvedor = {
  nome: string
  usuarioGitHub: string
}

export const desenvolvedores: Desenvolvedor[] = [
  { nome: 'Lucas G. Monte Gomes', usuarioGitHub: 'lucas' }, // TODO: colocar o username real do Lucas
  { nome: 'Gabriel', usuarioGitHub: 'gabriel' }, // TODO: colocar o username real do Gabriel
]

export type TelaDaIdeia = 'perfil' | 'sala' | 'trending' | 'leitor'

export const ideias = {
  rotulo: 'O que estamos desenhando',
  titulo: 'Fotos e vídeos no *centro*. O resto, em volta.',
  texto:
    'Estas são ideias em que a gente está trabalhando agora. São rascunhos: podem mudar até o lançamento, e tudo vai aparecer primeiro por aqui.',
  selo: 'Ideia em construção',
  passos: [
    {
      tela: 'perfil' as TelaDaIdeia,
      chapeu: 'Perfil',
      titulo: 'Seu perfil mostra a sua vida, não um placar.',
      texto:
        'A ideia é um perfil limpo, com as suas fotos, os seus vídeos e o que você quiser guardar. Sem selo de nível e sem ranking de gente.',
    },
    {
      tela: 'sala' as TelaDaIdeia,
      chapeu: 'Comunidades',
      titulo: 'O calor do jogo tem lugar.',
      texto:
        'Comunidades com salas por hashtag, para falar do assunto na hora em que ele acontece. O que você posta ali fica ali, e não no seu perfil.',
    },
    {
      tela: 'trending' as TelaDaIdeia,
      chapeu: 'Trending',
      titulo: 'Quando todo mundo está falando disso.',
      texto:
        'Se uma hashtag sobe rápido, ela pode ir para o Trending. Aí a conversa abre e qualquer pessoa entra para opinar.',
    },
    {
      tela: 'leitor' as TelaDaIdeia,
      chapeu: 'Modo Leitor',
      titulo: 'Chegou agora? Pode ler à vontade.',
      texto:
        'Dá para acompanhar uma comunidade antes de entrar nela. Quando quiser falar, é só participar.',
    },
  ],
}

export type NomeDaCena =
  | 'arquibancada'
  | 'almoco'
  | 'por-do-sol'
  | 'noite'
  | 'pelada'
  | 'chuva'
  | 'hashtag'
  | 'voce'

export type Cena = {
  cena: NomeDaCena
  quando: string
  texto: string
  /** Descrição da imagem para leitores de tela. */
  alt: string
  /**
   * Foto real para trocar a ilustração em pastilhas (opcional).
   * Caminho relativo à pasta public/, por exemplo 'cenas/arquibancada.webp'.
   * Use proporção 4:5 (por exemplo 1000 x 1250 px) em WebP ou AVIF.
   */
  imagem?: string
}

export const cenas = {
  rotulo: 'Cenas',
  titulo: 'A vida, do jeito que ela *acontece*.',
  texto: 'Momentos que a gente imagina por aqui. Arraste para o lado, use as setas ou o teclado.',
  itens: [
    {
      cena: 'arquibancada',
      quando: 'sáb · 16:47',
      texto: 'O grito do gol, visto lá de cima da arquibancada.',
      alt: 'Ilustração em pastilhas de uma arquibancada cheia, com o gramado listrado embaixo.',
    },
    {
      cena: 'almoco',
      quando: 'dom · 13:10',
      texto: 'Almoço de domingo também é história.',
      alt: 'Ilustração em pastilhas de uma mesa vista de cima, com toalha xadrez e pratos servidos.',
    },
    {
      cena: 'por-do-sol',
      quando: 'ter · 18:22',
      texto: 'O pôr do sol que dispensa filtro.',
      alt: 'Ilustração em pastilhas de um pôr do sol sobre o mar, com o reflexo do sol na água.',
    },
    {
      cena: 'noite',
      quando: 'sex · 23:58',
      texto: 'A foto tremida que foi a melhor da noite.',
      alt: 'Ilustração em pastilhas de luzes desfocadas e coloridas numa noite escura.',
    },
    {
      cena: 'pelada',
      quando: 'qua · 20:05',
      texto: 'A pelada de quarta, com o time de sempre.',
      alt: 'Ilustração em pastilhas de uma quadra de futebol vista de cima, com jogadores dos dois times.',
    },
    {
      cena: 'chuva',
      quando: 'seg · 07:40',
      texto: 'Um dia comum. Também conta.',
      alt: 'Ilustração em pastilhas de uma janela com gotas de chuva e uma luz quente acesa ao fundo.',
    },
    {
      cena: 'hashtag',
      quando: 'dom · 18:51',
      texto: 'A hashtag que subiu antes do apito final.',
      alt: 'Ilustração em pastilhas de um grande símbolo de hashtag claro sobre fundo coral.',
    },
    {
      cena: 'voce',
      quando: 'agora',
      texto: 'Junta tudo, e dá você.',
      alt: 'O símbolo da Mosaicofy, um @ cursivo, montado em pastilhas coral sobre fundo creme.',
    },
  ] satisfies Cena[],
}

export type Glifo = 'aspas' | 'cerquilha' | 'seta' | 'perto' | 'faisca'

export const porVir = {
  rotulo: 'O que está por vir',
  titulo: 'Cinco ideias que guiam tudo o que a gente *constrói*.',
  pilares: [
    {
      nome: 'Expressão',
      glifo: 'aspas' as Glifo,
      cor: 'coral',
      texto: 'Postar o que aconteceu, não o que rende. Foto, vídeo, texto, do jeito que foi.',
    },
    {
      nome: 'Comunidade',
      glifo: 'cerquilha' as Glifo,
      cor: 'campo',
      texto: 'Gente que vive o mesmo assunto, no mesmo lugar. E conversa que fica onde começou.',
    },
    {
      nome: 'Descoberta',
      glifo: 'seta' as Glifo,
      cor: 'ambar',
      texto: 'Ver o que está acontecendo agora, entrar quando quiser e sair sem precisar se explicar.',
    },
    {
      nome: 'Proximidade',
      glifo: 'perto' as Glifo,
      cor: 'ceu',
      texto: 'Ficar perto de quem importa. Uma rede para conhecer gente, não para colecionar números.',
    },
    {
      nome: 'Criatividade',
      glifo: 'faisca' as Glifo,
      cor: 'vinho',
      texto: 'Montar o seu canto pedaço por pedaço, com álbuns, destaques e o que fizer sentido para você.',
    },
  ],
}

export const construcao = {
  rotulo: 'Em obra',
  titulo: 'Pastilha por pastilha.',
  texto:
    'A Mosaicofy ainda não está pronta, e a gente prefere assim: dá tempo de ouvir quem vai usar antes de abrir as portas. O primeiro teste vai ser fechado, com 100 vagas para quem tem de 18 a 30 anos e vive o futebol.',
  diarioTitulo: 'Diário de obra',
  diario: [
    { etapa: 'Nome e marca', situacao: 'pronto' },
    { etapa: 'Desenho das telas', situacao: 'em andamento' },
    { etapa: 'Construção do app', situacao: 'em andamento' },
    { etapa: 'Teste fechado com 100 vagas', situacao: 'em breve' },
    { etapa: 'Lançamento', situacao: 'depois do teste' },
  ] as { etapa: string; situacao: 'pronto' | 'em andamento' | 'em breve' | 'depois do teste' }[],
  descricaoDaAnimacao:
    'Animação de pastilhas sendo assentadas uma a uma, como numa parede em obra, até formar um desenho. Depois o desenho se desfaz e outro começa.',
}

export const chamada = {
  rotulo: 'Acompanhe',
  titulo: 'Chega mais *perto*.',
  texto:
    'A lista de espera para o teste fechado vai abrir aqui mesmo, em breve. Ainda não tem cadastro, e a gente não vai fingir que tem. Por enquanto, guarda este endereço e chama quem precisa estar junto.',
  situacao: 'Lista de espera: abre em breve',
  compartilhar: 'Mandar para alguém',
  compartilhado: 'Link copiado',
  textoDeCompartilhamento: 'Olha o que está sendo construído: Mosaicofy. De perto, pedaços. De longe, você.',
  semRedes: 'Os perfis oficiais aparecem aqui assim que estiverem no ar.',
  comRedes: 'Enquanto isso, acompanhe por aqui:',
}

export const rodape = {
  colunas: {
    site: 'No site',
    mosaicofy: 'Mosaicofy',
    redes: 'Redes',
  },
  privacidade: 'Privacidade',
  termos: 'Termos de uso',
  redesEmBreve: 'Em breve',
  voltarAoTopo: 'Voltar ao topo',
}

export const acessibilidade = {
  pularParaConteudo: 'Pular para o conteúdo',
  inicio: 'Mosaicofy, página inicial',
  menu: 'Navegação principal',
  anterior: 'Cena anterior',
  proxima: 'Próxima cena',
  carrossel: 'Cenas da vida na Mosaicofy',
  slide: (n: number, total: number) => `${n} de ${total}`,
}
