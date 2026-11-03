/**
 * Revelação progressiva: elementos com [data-revelar] entram com fade e
 * deslocamento quando chegam na tela. O conteúdo vem pré-renderizado e visível;
 * a classe "js" só é adicionada aqui, então sem JavaScript nada fica escondido.
 */
export function iniciarRevelacao(raiz: HTMLElement = document.body) {
  const doc = document.documentElement
  if (typeof IntersectionObserver === 'undefined') return
  doc.classList.add('js')

  const io = new IntersectionObserver(
    (entradas) => {
      let ordem = 0
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.style.setProperty('--atraso-revelar', `${Math.min(ordem, 5) * 90}ms`)
        el.classList.add('revelado')
        io.unobserve(el)
        ordem++
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  )

  const observar = (no: ParentNode) =>
    no.querySelectorAll<HTMLElement>('[data-revelar]:not(.revelado)').forEach((el) => io.observe(el))

  observar(raiz)
  // Em desenvolvimento (sem pré-renderização) os elementos chegam depois.
  new MutationObserver((mudancas) => {
    for (const m of mudancas) m.addedNodes.forEach((n) => n instanceof HTMLElement && observar(n))
  }).observe(raiz, { childList: true, subtree: true })
}
