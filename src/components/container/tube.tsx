import cssModule from './tube.module.css'
import { cx } from '../../utils/style'
import UseContainer from '../../hooks/useContainer'
import ContainerInfos from './containerInfos'
import Liquid from '../liquid/liquid'
import type { LiquidAmount } from '../../constants/liquid'
import { useCallback } from 'react'

const DEFAULT_HEIGHT = 350
const DEFAULT_VOLUME = 50

const Tube = ({
  id,
  setTubePosition,
  setCurrentContent,
  volume = DEFAULT_VOLUME,
  liquids = [],
  className,
  style,
  ...props
}: {
  id: string
  setCurrentContent: (id: string, liquids: LiquidAmount[]) => void
  setTubePosition: (id: string, neckPosition: [number, number], tubeHeight: number) => void
  volume?: number
  liquids?: LiquidAmount[]
} & JSX.IntrinsicElements['div']) => {
  const height = (volume / DEFAULT_VOLUME) * DEFAULT_HEIGHT

  const setCurrentPosition = useCallback(
    ([x, y]: [number, number]) => {
      setTubePosition(id, [x, y], height - 3)
    },
    [setTubePosition, id, height]
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
  } = UseContainer({ liquids, setCurrentPosition })
  const width = 20

  const fill = 100 - (100 * totalVolume) / volume
  return (
    <div
      className={cx(className, containerClassname, draggableClassName)}
      style={{
        ...style,
        ...draggableStyle,
        '--tube-width': `${width}px`,
        '--tube-height': `${height}px`,
        '--tube-font': `${(16 * height) / DEFAULT_HEIGHT}px`
      }}
      {...listeners}
      {...props}
    >
      <div className={cx(cssModule.potion)} {...draggableListeners}>
        <div className={cssModule.potionBody} ref={onDragItemInit}>
          {liquids.length ? (
            <Liquid volume={volume} fill={fill} liquids={liquids} acc={isDragging ? acc : 0} velocity={isDragging ? velocity : 0} />
          ) : null}
        </div>
      </div>
      <ContainerInfos clearContainer={clearContainer} volume={volume} liquids={liquids} show={showInfos} type='tube' />
    </div>
  )
}

export default Tube
