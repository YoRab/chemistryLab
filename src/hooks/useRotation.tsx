import { useEffect, useRef, useState } from 'react'
import { getCursorPosition } from '../utils/cursor'
import cssModule from './useRotation.module.css'
import { getAngleFromVector } from '../utils/trigo'
type Coordinate = { x: number; y: number }

const useRotation = ({
  addCursorPosition,
  disabled = false,
  min,
  max,
  origin = [50, 50],
  defaultVal
}: {
  addCursorPosition?: (position: Coordinate) => void
  disabled?: boolean
  min: number
  max: number
  origin?: [number, number]
  defaultVal: number
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [dragState, setDragState] = useState<{
    isDragging: boolean
    cursorInit?: Coordinate
    cursor?: Coordinate
    rotation: number
    rotationInit: number
  }>({
    isDragging: false,
    rotation: defaultVal,
    rotationInit: defaultVal
  })

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    const cursorPosition = getCursorPosition(e)
    setDragState(prev => ({ ...prev, isDragging: true, cursorInit: cursorPosition, cursor: cursorPosition, rotationInit: prev.rotation }))
  }

  useEffect(() => {
    if (disabled) {
      setDragState(prev => ({ ...prev, isDragging: false }))
    }
  }, [disabled])

  useEffect(() => {
    if (disabled || !dragState.isDragging) return

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const cursorPosition = getCursorPosition(e)

      const originCoordinates = ref.current?.getBoundingClientRect()
      if (!originCoordinates) return

      setDragState(prev => {
        const originVector = [
          { x: originCoordinates.x, y: originCoordinates.y },
          { x: prev.cursorInit!.x, y: prev.cursorInit!.y }
        ] as const
        const targetVector = [
          { x: originCoordinates.x, y: originCoordinates.y },
          { x: cursorPosition.x, y: cursorPosition.y }
        ] as const

        const calculatedRotation = ((prev.rotationInit + getAngleFromVector({ targetVector, radian: false, originVector }) + 180) % 360) - 180
        const rotation = Math.min(max, Math.max(min, calculatedRotation))

        return {
          ...prev,
          cursor: cursorPosition,
          rotation
        }
      })
      addCursorPosition?.(cursorPosition)
    }

    const handleMouseEnd = (_e: MouseEvent | TouchEvent) => {
      setDragState(prev => ({ ...prev, isDragging: false }))
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseEnd)
    document.addEventListener('touchend', handleMouseEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseMove)
      document.removeEventListener('touchend', handleMouseMove)
    }
  }, [dragState.isDragging, disabled, addCursorPosition, max, min])

  const listeners = {
    onMouseDown: handleMouseDown,
    onTouchStart: handleMouseDown
  }

  const style = {
    transformOrigin: `${origin[0]}% ${origin[1]}%`,
    transform: `rotate(${dragState.rotation}deg)`
  }

  const originRotationStyle = {
    position: 'absolute',
    left: `${origin[0]}%`,
    top: `${origin[1]}%`
  } as const

  return {
    ref,
    currentRotation: dragState.rotation,
    style,
    className: cssModule.draggable,
    originRotationStyle,
    listeners,
    isDragging: dragState.isDragging
  }
}

export default useRotation
