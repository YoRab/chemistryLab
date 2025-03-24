import { useCallback, useEffect, useState } from 'react'
import { getCursorPosition } from '../utils/cursor'
import cssModule from './useDraggable.module.css'
type Coordinate = { x: number; y: number; t: number }

const UseDraggable = ({
  addCursorPosition,
  disabled = false,
  horizontal = true,
  vertical = true,
  setCurrentPosition
}: {
  setCurrentPosition?: (position: [number, number]) => void
  addCursorPosition?: (position: Coordinate) => void
  disabled?: boolean
  horizontal?: boolean
  vertical?: boolean
}) => {
  const [dragState, setDragState] = useState<{
    isDragging: boolean
    cursorInit?: Coordinate
    oldValues: Coordinate
    dragX: number
    dragY: number
    clientRectLeft: number | undefined
    clientRectTop: number | undefined
  }>({
    isDragging: false,
    oldValues: { x: 0, y: 0, t: Date.now() },
    dragX: 0,
    dragY: 0,
    clientRectLeft: undefined,
    clientRectTop: undefined
  })

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    const cursorPosition = getCursorPosition(e)
    setDragState(prev => {
      return { ...prev, isDragging: true, cursorInit: cursorPosition, oldValues: { x: prev.dragX, y: prev.dragY, t: Date.now() } }
    })
  }

  const onDragItemInit = useCallback((ref: HTMLDivElement) => {
    const { top, left, width } = ref.getBoundingClientRect()
    setDragState(prev => ({ ...prev, clientRectTop: top, clientRectLeft: left + width / 2 }))
  }, [])

  useEffect(() => {
    if (disabled) {
      setDragState(prev => ({ ...prev, isDragging: false }))
    }
  }, [disabled])

  useEffect(() => {
    setCurrentPosition?.([(dragState.clientRectLeft ?? 0) + dragState.dragX, (dragState.clientRectTop ?? 0) + dragState.dragY])
  }, [dragState, setCurrentPosition])

  useEffect(() => {
    if (disabled || !dragState.isDragging) return

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const cursorPosition = getCursorPosition(e)
      setDragState(prev => {
        return {
          ...prev,
          dragX: horizontal ? prev.oldValues.x + cursorPosition.x - prev.cursorInit!.x : prev.dragX,
          dragY: vertical ? prev.oldValues.y + cursorPosition.y - prev.cursorInit!.y : prev.dragY
        }
      })
      addCursorPosition?.(cursorPosition)
    }

    const handleMouseEnd = (e: MouseEvent | TouchEvent) => {
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
  }, [dragState.isDragging, disabled, addCursorPosition, horizontal, vertical])

  const listeners = {
    onMouseDown: handleMouseDown,
    onTouchStart: handleMouseDown
  }
  const style = {
    transform: `translate(${dragState.dragX}px, ${dragState.dragY}px)`
  }
  return { style, className: cssModule.draggable, listeners, isDragging: dragState.isDragging, onDragItemInit }
}

export default UseDraggable
