type Point = { x: number; y: number }

export const cubicBezier = (t: number, P0: Point, P1: Point, P2: Point, P3: Point): Point => {
  const oneMinusT = 1 - t

  const x = oneMinusT ** 3 * P0.x + 3 * oneMinusT ** 2 * t * P1.x + 3 * oneMinusT * t ** 2 * P2.x + t ** 3 * P3.x

  const y = oneMinusT ** 3 * P0.y + 3 * oneMinusT ** 2 * t * P1.y + 3 * oneMinusT * t ** 2 * P2.y + t ** 3 * P3.y

  return { x, y }
}
