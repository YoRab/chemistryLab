import { useCallback, useState } from 'react'
type Coordinate = { x: number; y: number; t: number }

function calculateVelocity(coord1: Coordinate, coord2: Coordinate): { vx: number; vy: number } {
  const dt = coord2.t - coord1.t
  if (dt === 0) throw new Error('Time difference cannot be zero')

  return {
    vx: (coord2.x - coord1.x) / dt,
    vy: (coord2.y - coord1.y) / dt
  }
}

function calculateAcceleration(
  velocity1: { vx: number; vy: number },
  velocity2: { vx: number; vy: number },
  dt: number
): { ax: number; ay: number; ad: number } {
  if (dt === 0) throw new Error('Time difference cannot be zero')
  const ax = (velocity2.vx - velocity1.vx) / dt
  const ay = (velocity2.vy - velocity1.vy) / dt
  return {
    ax,
    ay,
    ad: Math.sqrt(ax ** 2 + ay ** 2)
  }
}

const UseAcceleration = () => {
  const [data, setData] = useState<{
    coordinates: Coordinate[]
    velocities: { vx: number; vy: number }[]
    acc: { ax: number; ay: number; ad: number }[]
  }>({
    coordinates: [],
    velocities: [],
    acc: []
  })

  const addCursorPosition = useCallback((position: Coordinate) => {
    setData(prev => {
      try {
        const { coordinates, velocities, acc } = prev
        const lastCoordinates = coordinates[coordinates.length - 1]

        const newCoordinates = [...coordinates, position]

        const newVelocities = lastCoordinates ? [...velocities, calculateVelocity(lastCoordinates, position)] : velocities

        const newAcc =
          newVelocities.length > 1
            ? [
                ...acc,
                calculateAcceleration(
                  newVelocities[newVelocities.length - 2],
                  newVelocities[newVelocities.length - 1],
                  newCoordinates[newCoordinates.length - 2].t - newCoordinates[newCoordinates.length - 1].t
                )
              ]
            : acc
        return {
          ...prev,
          velocities: newVelocities,
          coordinates: newCoordinates,
          acc: newAcc
        }
      } catch (e) {
        return prev
      }
    })
  }, [])

  return {
    addCursorPosition,
    acc: data.acc.length ? data.acc[data.acc.length - 1].ad : 0,
    velocity: data.velocities.length ? data.velocities[data.velocities.length - 1].vx : 0
  }
}

export default UseAcceleration
