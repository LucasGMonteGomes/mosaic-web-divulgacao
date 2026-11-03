import type { TelaDaIdeia } from '../content/site'
import './celular.css'
import { Icone } from './Icone'
import { Simbolo } from './Simbolo'

/**
 * Fragmentos de interface desenhados em HTML/CSS (não são capturas do app).
 * Mostram ideias em construção com pessoas e conversas fictícias.
 * São decorativos: o texto ao lado explica cada ideia.
 */

type Tom = 'campo' | 'sol' | 'noite' | 'mesa' | 'ceu' | 'coral' | 'areia' | 'chuva' | 'arquibancada'

function Foto({ tom, className }: { tom: Tom; className?: string }) {
  return <span className={`foto foto--${tom} ${className ?? ''}`} />
}

function Avatar({ cores, tamanho = 'p' }: { cores: [string, string, string]; tamanho?: 'p' | 'g' }) {
  return (
    <span className={`avatar avatar--${tamanho}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} style={{ background: cores[(i * 7 + (i > 4 ? 1 : 0)) % 3] }} />
      ))}
    </span>
  )
}

function BarraDeStatus() {
  return (
    <div className="tela__status">
      <span>16:47</span>
      <span className="tela__sinais">
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}

function Perfil() {
  const fotos: Tom[] = ['arquibancada', 'sol', 'mesa', 'noite', 'campo', 'chuva', 'coral', 'ceu', 'areia']
  return (
    <>
      <div className="tela__topo">
        <Simbolo tamanho={22} />
        <span className="tela__titulo-app">perfil</span>
        <span className="tela__menu" />
      </div>
      <div className="perfil">
        <Avatar cores={['#FF5B3A', '#F5B544', '#17161B']} tamanho="g" />
        <div>
          <p className="perfil__nome">Lia Moraes</p>
          <p className="perfil__usuario">@lia.moraes</p>
        </div>
      </div>
      <p className="perfil__bio">zagueira da pelada de quarta · foto de tudo</p>
      <div className="abas">
        <span className="abas__ativa">Posts</span>
        <span>Álbuns</span>
        <span>Destaques</span>
      </div>
      <div className="grade-de-fotos">
        {fotos.map((t, i) => (
          <Foto key={i} tom={t} />
        ))}
      </div>
    </>
  )
}

function Sala() {
  return (
    <>
      <div className="tela__topo tela__topo--sala">
        <Icone nome="esquerda" tamanho={16} />
        <div>
          <p className="sala__hashtag">#GolAos47</p>
          <p className="sala__sub">sala da comunidade · 1,2 mil aqui agora</p>
        </div>
      </div>
      <div className="conversa">
        <div className="msg">
          <Avatar cores={['#2F7D4E', '#FFF6EE', '#17161B']} />
          <div>
            <p className="msg__nome">Davi</p>
            <p className="msg__texto">não acredito no que eu acabei de ver</p>
          </div>
        </div>
        <div className="msg">
          <Avatar cores={['#7FA8D9', '#17161B', '#F5B544']} />
          <div>
            <p className="msg__nome">Rafa</p>
            <p className="msg__texto">47 do segundo tempo!!!</p>
          </div>
        </div>
        <div className="msg">
          <Avatar cores={['#FF5B3A', '#F5B544', '#17161B']} />
          <div>
            <p className="msg__nome">Lia</p>
            <Foto tom="arquibancada" className="msg__foto" />
            <p className="msg__texto">daqui de cima foi assim</p>
          </div>
        </div>
        <div className="msg">
          <Avatar cores={['#A8241A', '#F3A6A0', '#FFF6EE']} />
          <div>
            <p className="msg__nome">Caio</p>
            <p className="msg__texto">amanhã eu leio isso com calma</p>
          </div>
        </div>
      </div>
      <p className="aviso-da-sala">
        <Icone nome="cadeado" tamanho={14} />
        Fica aqui na sala. Não vai para o seu perfil.
      </p>
    </>
  )
}

function Trending() {
  const itens = [
    { tag: '#GolAos47', calor: 0.94, nota: 'subindo rápido' },
    { tag: '#PeladaDeQuarta', calor: 0.66, nota: 'nas comunidades' },
    { tag: '#ClássicoDeDomingo', calor: 0.52, nota: 'nas comunidades' },
    { tag: '#ArbitragemDeHoje', calor: 0.37, nota: 'esquentando' },
  ]
  return (
    <>
      <div className="tela__topo">
        <span className="tela__titulo-app tela__titulo-app--grande">Trending</span>
      </div>
      <div className="abas abas--pilula">
        <span className="abas__ativa">Esporte</span>
        <span>Geral</span>
        <span>Mundo</span>
      </div>
      <ol className="trending">
        {itens.map((item, i) => (
          <li key={item.tag} className={i === 0 ? 'trending__item trending__item--quente' : 'trending__item'}>
            <span className="trending__pos">{i + 1}</span>
            <div className="trending__corpo">
              <p className="trending__tag">{item.tag}</p>
              <p className="trending__nota">
                {i === 0 && <Icone nome="subindo" tamanho={13} />}
                {item.nota}
              </p>
              <span className="trending__calor" style={{ ['--calor' as string]: item.calor }} />
            </div>
          </li>
        ))}
      </ol>
      <p className="aviso-da-sala aviso-da-sala--aberto">Aberto: qualquer pessoa pode opinar</p>
    </>
  )
}

function Leitor() {
  return (
    <>
      <div className="tela__topo tela__topo--sala">
        <Icone nome="esquerda" tamanho={16} />
        <div>
          <p className="sala__hashtag">#PeladaDeQuarta</p>
          <p className="sala__sub">comunidade · 318 membros</p>
        </div>
      </div>
      <div className="leitor">
        <div className="post-mini">
          <div className="post-mini__cabeca">
            <Avatar cores={['#2F7D4E', '#FFF6EE', '#17161B']} />
            <span>Davi</span>
          </div>
          <Foto tom="campo" className="post-mini__foto" />
          <p>time de sempre, placar de sempre</p>
        </div>
        <div className="post-mini">
          <div className="post-mini__cabeca">
            <Avatar cores={['#F5B544', '#17161B', '#FF5B3A']} />
            <span>Nina</span>
          </div>
          <p>quem leva a bola na próxima?</p>
        </div>
      </div>
      <div className="leitor__rodape">
        <p>
          <Icone nome="cadeado" tamanho={14} />
          Você está no Modo Leitor
        </p>
        <span className="leitor__botao">Participar da comunidade</span>
      </div>
    </>
  )
}

const TELAS: Record<TelaDaIdeia, () => React.JSX.Element> = {
  perfil: Perfil,
  sala: Sala,
  trending: Trending,
  leitor: Leitor,
}

export function ConteudoDaTela({ tela }: { tela: TelaDaIdeia }) {
  const Componente = TELAS[tela]
  return (
    <div className="tela">
      <BarraDeStatus />
      <Componente />
      {/* As outras telas já têm a própria barra de baixo (campo de mensagem, botões). */}
      {tela === 'perfil' && (
        <div className="tela__doca">
          <i />
          <i className="tela__doca-busca" />
          <b />
          <i className="tela__doca-conversa" />
          <i className="tela__doca-perfil" />
        </div>
      )}
    </div>
  )
}

/** Moldura de celular original (sem imitar aparelho de marca nenhuma). */
export function Celular({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`celular ${className ?? ''}`} aria-hidden="true">
      <div className="celular__vidro">{children}</div>
    </div>
  )
}
