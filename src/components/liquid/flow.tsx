import { useState } from 'react'
import { cx } from '../../utils/style'
import cssModule from './flow.module.css'

const DROPS_NUMBER_MAX = 50
const DROPS_ID = [
  25, 13, 38, 7, 44, 19, 31, 4, 47, 10, 40, 16, 34, 1, 49, 22, 28, 6, 46, 12, 36, 18, 32, 9, 41, 15, 35, 2, 50, 24, 26, 5, 45, 11, 39, 17, 33, 8, 42,
  14, 37, 3, 48, 21, 29, 20, 30, 23, 27, 43
]

const Drop = ({ index }: { index: number }) => {
  const [delay] = useState(`${((1300 / DROPS_NUMBER_MAX) * DROPS_ID[index] - (Date.now() % 1300) + 2600) % 2600}ms`)
  return <div className={cssModule.drop2} style={{ '--drop-delay': delay }} />
}

const Flow = ({ className, speed, color, maxHeight = 644 }: { className: string; speed: number; color: string; maxHeight?: number | undefined }) => {
  const drops = Math.min(DROPS_NUMBER_MAX, Math.round((speed / 50) * DROPS_NUMBER_MAX))
  const dropScale = 0.4 + (Math.max(0, speed - 50) / 50) * 0.4

  return (
    <>
      <div
        className={cx(cssModule.flow, className)}
        style={{ '--drop-scalex': `${dropScale}`, '--flow-height': `${maxHeight}px`, '--flow-color': color }}
      >
        <div className={cssModule.drops}>
          <div className={cssModule.drop1} />
          {DROPS_ID.slice(0, drops).map((val, index) => {
            return <Drop key={val} index={index} />
          })}
        </div>
        <svg xmlns='http://www.w3.org/2000/svg' version='1.1'>
          <title>Drop</title>
          <defs>
            <filter id='liquid'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='10' result='blur' />
              <feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7' result='liquid' />
            </filter>
          </defs>
        </svg>
      </div>
    </>
  )
}

export default Flow
