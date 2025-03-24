import useDraggable from './useDraggable'
import useAcceleration from './useAcceleration'
import cssModule from './useContainer.module.css'
import { useState } from 'react'
import type { LiquidAmount } from '../constants/liquid'

const UseContainer = ({ liquids, setCurrentPosition }: { liquids: LiquidAmount[]; setCurrentPosition: (position: [number, number]) => void }) => {
  const [showInfos, setShowInfos] = useState(false)
  const { addCursorPosition, acc, velocity } = useAcceleration()
  const draggableProps = useDraggable({ addCursorPosition, setCurrentPosition })
  const totalVolume = liquids.reduce((sum, { volume }) => sum + volume, 0)

  const listeners = {
    onMouseEnter: () => setShowInfos(true),
    onMouseLeave: () => setShowInfos(false)
  }
  return {
    className: cssModule.container,
    showInfos: showInfos || draggableProps.isDragging,
    setShowInfos,
    listeners,
    acc,
    velocity,
    totalVolume,
    draggableProps
  }
}

export default UseContainer
