import cssModule from './cup.module.css'
import { cx } from '../../utils/style'
import UseContainer from '../../hooks/useContainer'
import ContainerInfos from './containerInfos'
import Liquid from '../liquid/liquid'
import type { LiquidAmount } from '../../constants/liquid'
import { useCallback, useMemo } from 'react'
import { cubicBezier } from '../../utils/bezier'

const DEFAULT_SIZE = 250
const DEFAULT_VOLUME = 500
const FACTOR_SIZE = DEFAULT_SIZE / Math.sqrt(DEFAULT_VOLUME / (4 * Math.PI))

const P0 = { x: 0, y: 0 } // Point de départ
const P1 = { x: 0.1, y: 0.75 } // Premier point de contrôle
const P2 = { x: 0.9, y: 0.25 } // Deuxième point de contrôle
const P3 = { x: 1, y: 1 } // Point final

const Cup = ({
  id,
  setCupPosition,
  setCurrentContent,
  volume = DEFAULT_VOLUME,
  liquids = [],
  className,
  style: styleFromProps,
  ...props
}: {
  id: string
  setCurrentContent: (id: string, liquids: LiquidAmount[]) => void
  setCupPosition: (id: string, neckPosition: [number, number], cupSize: number) => void
  volume?: number
  liquids?: LiquidAmount[]
} & JSX.IntrinsicElements['div']) => {
  const size = Math.sqrt(volume / (4 * Math.PI)) * FACTOR_SIZE

  const setCurrentPosition = useCallback(
    ([x, y]: [number, number]) => {
      setCupPosition(id, [x, y], size * 1.16)
    },
    [setCupPosition, size, id]
  )

  const clearContainer = useCallback(() => {
    setCurrentContent(id, [])
  }, [id, setCurrentContent])

  const {
    className: containerClassname,
    showInfos,
    totalVolume,
    acc,
    velocity,
    listeners,
    draggableProps: { style: draggableStyle, className: draggableClassName, listeners: draggableListeners, isDragging, onDragItemInit }
  } = UseContainer({ setCurrentPosition, liquids })

  const fill = useMemo(() => 100 - 100 * cubicBezier(totalVolume / volume, P0, P1, P2, P3).y, [totalVolume, volume])
  return (
    <div
      className={cx(className, containerClassname, draggableClassName)}
      style={{ ...styleFromProps, ...draggableStyle, '--cup-size': `${size}px`, '--cup-font': `${(16 * size) / DEFAULT_SIZE}px` }}
      {...listeners}
      {...props}
    >
      <div className={cx(cssModule.potion)} {...draggableListeners}>
        <div className={cssModule.potionTop} ref={onDragItemInit} />
        <div className={cssModule.potionBody}>
          {liquids.length ? (
            <Liquid volume={volume} fill={fill} liquids={liquids} acc={isDragging ? acc : 0} velocity={isDragging ? velocity : 0} />
          ) : null}
        </div>
      </div>
      <ContainerInfos volume={volume} liquids={liquids} show={showInfos} type='cup' clearContainer={clearContainer} />
    </div>
  )
}

export default Cup
