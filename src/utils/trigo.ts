type Coordinate = { x: number; y: number }

type Vector = readonly [Coordinate, Coordinate]

export const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI

const sanitizeRadAngle = (angle: number) => (angle + 2 * Math.PI) % (2 * Math.PI)

export const getAngleFromVector = ({
  targetVector: [point1, point2],
  radian = true,
  originVector
}: {
  targetVector: Vector
  radian?: boolean
  originVector?: Vector
}): number => {
  const targetAngle = sanitizeRadAngle(Math.atan2(point2.y - point1.y, point2.x - point1.x))

  if (originVector) {
    const [origin1, origin2] = originVector

    const originAngle = Math.atan2(origin2.y - origin1.y, origin2.x - origin1.x)
    const diffAngle = sanitizeRadAngle(targetAngle - originAngle)
    return radian ? diffAngle : radiansToDegrees(diffAngle)
  }
  return radian ? targetAngle : radiansToDegrees(targetAngle)
}
