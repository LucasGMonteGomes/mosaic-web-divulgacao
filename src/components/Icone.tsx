/**
 * Ícones da Mosaicofy: traço de 2 px, pontas e cantos arredondados,
 * desenhados numa grade de 24 px. Sempre com rótulo no elemento pai
 * quando estiverem sozinhos num botão.
 */
const DESENHOS = {
  seta: <path d="M5 12h13M13 6l6 6-6 6" />,
  'seta-baixo': <path d="M12 5v13M6 13l6 6 6-6" />,
  esquerda: <path d="M15 5l-7 7 7 7" />,
  direita: <path d="M9 5l7 7-7 7" />,
  compartilhar: (
    <>
      <path d="M12 3v12" />
      <path d="M7.5 7.5L12 3l4.5 4.5" />
      <path d="M5 12.5V18a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5.5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  cadeado: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="3" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  subindo: (
    <>
      <path d="M4 17l6-6 4 4 6-7" />
      <path d="M15 8h5v5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3.5v11a3.5 3.5 0 1 1-3.5-3.5M14 3.5c.4 2.7 2.3 4.6 5 5" />,
  x: <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5z" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  topo: <path d="M12 19V6M6 11l6-6 6 6" />,
} as const

export type NomeDoIcone = keyof typeof DESENHOS

export function Icone({ nome, tamanho = 20, className }: { nome: NomeDoIcone; tamanho?: number; className?: string }) {
  return (
    <svg
      className={`icone ${className ?? ''}`}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {DESENHOS[nome]}
    </svg>
  )
}
