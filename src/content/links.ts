/**
 * Links oficiais da Mosaicofy.
 *
 * Para ligar uma rede: troque `ativo` para true e confira o endereço.
 * Enquanto `ativo` for false, o link NÃO aparece no site (nada de link quebrado
 * nem de perfil que ainda não existe). Veja o README, seção "Links e redes".
 */
export type RedeSocial = {
  nome: string
  usuario: string
  url: string
  ativo: boolean
}

export const DOMINIO = 'mosaicofy.com'
export const URL_DO_SITE = 'https://mosaicofy.com/'

export const redes: RedeSocial[] = [
  { nome: 'Instagram', usuario: '@mosaicofy', url: 'https://www.instagram.com/mosaicofy/', ativo: false },
  { nome: 'TikTok', usuario: '@mosaicofy', url: 'https://www.tiktok.com/@mosaicofy', ativo: false },
  { nome: 'X', usuario: '@mosaicofy', url: 'https://x.com/mosaicofy', ativo: false },
  { nome: 'YouTube', usuario: '@mosaicofy', url: 'https://www.youtube.com/@mosaicofy', ativo: false },
]

/** E-mail de contato. Deixe null até a caixa existir de verdade. */
export const emailDeContato: string | null = null

/**
 * Lista de espera. Quando existir uma página de cadastro de verdade,
 * preencha `url` e troque `aberta` para true: o botão aparece na chamada final.
 */
export const listaDeEspera = {
  aberta: false,
  url: '',
  rotulo: 'Entrar na lista de espera',
}

export const redesAtivas = () => redes.filter((r) => r.ativo)
