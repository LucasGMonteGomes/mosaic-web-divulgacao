import type { Glifo } from '../content/site'

/**
 * Pictogramas em pastilhas (grade 9 × 9) dos pilares da Mosaicofy.
 * "X" = pastilha acesa. Para mudar um desenho, edite as linhas abaixo.
 */
const DESENHOS: Record<Glifo, string[]> = {
  aspas: [
    '.........',
    '.XXX.XXX.',
    '.XXX.XXX.',
    '.XXX.XXX.',
    '...X...X.',
    '..X...X..',
    '.X...X...',
    '.........',
    '.........',
  ],
  cerquilha: [
    '.........',
    '..X...X..',
    '.XXXXXXX.',
    '..X...X..',
    '..X...X..',
    '..X...X..',
    '.XXXXXXX.',
    '..X...X..',
    '.........',
  ],
  seta: [
    '.........',
    '...XXXXX.',
    '....XXXX.',
    '.....XXX.',
    '....XX.X.',
    '...XX....',
    '..XX.....',
    '.XX......',
    '.........',
  ],
  perto: [
    '.........',
    '.........',
    '..XXXX...',
    '..X..X...',
    '..X.XXXX.',
    '..XXX..X.',
    '....X..X.',
    '....XXXX.',
    '.........',
  ],
  faisca: [
    '.........',
    '....X....',
    '....X....',
    '...XXX...',
    '.XXXXXXX.',
    '...XXX...',
    '....X....',
    '....X....',
    '.........',
  ],
}

export const LADO_DO_GLIFO = 9

export function glifoAceso(glifo: Glifo): boolean[] {
  return DESENHOS[glifo].join('').split('').map((c) => c === 'X')
}
