import { useCallback } from 'react'
import { LIQUIDS } from '../../constants/liquid'
import useDraggable from '../../hooks/useDraggable'
import useRotation from '../../hooks/useRotation'
import { cx } from '../../utils/style'
import Flow from '../liquid/flow'
import cssModule from './hose.module.css'

const Hose = ({
  id,
  type,
  maxHeight,
  setHosePosition
}: {
  id: string
  maxHeight: number | undefined
  setHosePosition: (id: string, pouringPosition: [number, number], openRatio: number) => void
  type: keyof typeof LIQUIDS
}) => {
  const {
    ref,
    currentRotation,
    style: rotationStyle,
    listeners: rotationListeners,
    className: rotationClassname,
    originRotationStyle
  } = useRotation({ min: 25, max: 90, origin: [50, 90], defaultVal: 25 })

  const liquid = LIQUIDS[type]
  const openRatio = ((currentRotation - 25) / 90) * 100

  const setCurrentPosition = useCallback(
    ([x, y]: [number, number]) => {
      setHosePosition(id, [x, y + 300], openRatio)
    },
    [setHosePosition, id, openRatio]
  )
  const { style, listeners, className, onDragItemInit } = useDraggable({ setCurrentPosition, vertical: false })
  return (
    <>
      <div className={cx(cssModule.hose)} style={style} ref={onDragItemInit}>
        <Flow className={cssModule.liquid} speed={openRatio} color={liquid.color} maxHeight={maxHeight} />
        <div className={cx(rotationClassname, cssModule.vanne)} style={{ ...rotationStyle }} {...rotationListeners}>
          <div style={originRotationStyle} ref={ref} />
        </div>
        <div className={cx(className, cssModule.container)} {...listeners}>
          <div className={cssModule.title}>{liquid.label}</div>
        </div>
      </div>
    </>
  )
}

export default Hose
