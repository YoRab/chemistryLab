import { useEffect, useState } from 'react'
import cssModule from './liquid.module.css'
import { LIQUIDS, type LiquidAmount } from '../../constants/liquid'
import mix from 'mix-css-color'

const Liquid = ({
  acc,
  velocity,
  liquids,
  volume,
  fill,
  style,
  ...props
}: { acc: number; fill: number; velocity: number; volume: number; liquids: LiquidAmount[] } & JSX.IntrinsicElements['div']) => {
  const [factor, setFactor] = useState(0)
  const { color: liquidColor, volume: totalVolume } =
    liquids.length > 1
      ? liquids.slice(1).reduce(
          (mixx, liquid) => ({
            color: mix(LIQUIDS[liquid.id].color, mixx.color, (liquid.volume / (mixx.volume + liquid.volume)) * 100).hexa,
            volume: mixx.volume + liquid.volume
          }),
          {
            color: LIQUIDS[liquids[0].id].color as string,
            volume: liquids[0].volume
          }
        )
      : {
          color: LIQUIDS[liquids[0].id].color as string,
          volume: liquids[0].volume
        }

  useEffect(() => {
    setFactor(prev => Math.min(5, prev + Math.abs((acc * (6 - prev)) / 3)))
  }, [acc])

  const shouldDecelarate = factor > 0

  useEffect(() => {
    if (!shouldDecelarate) return
    const intervalId = setInterval(() => {
      setFactor(prev => Math.max(0, prev - 0.075 - Math.min(4.9, prev) * 0.015))
    }, 50)

    return () => {
      clearInterval(intervalId)
    }
  }, [shouldDecelarate])

  return (
    <>
      <svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px' style={{ display: 'none' }}>
        <title>Wave</title>
        <symbol id='wave'>
          <path d='M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z' />
          <path d='M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z' />
          <path d='M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z' />
          <path d='M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z' />
        </symbol>
      </svg>
      <div className={cssModule.potionContent} {...props}>
        <div
          id='water'
          className={cssModule.water}
          style={{
            '--liquid-color': liquidColor,
            '--wave-rotation': `${velocity * 10}deg`,
            '--wave-scaleY': factor,
            '--wave-width': `${200 + factor * 50}%`,
            '--wave-fill': `${fill}%`
          }}
        >
          <svg viewBox='0 0 560 20' className={cssModule.water_wave_back}>
            <title>Wave</title>
            <use xlinkHref='#wave' />
          </svg>
          <div className={cssModule.liquid} />
          <svg viewBox='0 0 560 20' className={cssModule.water_wave_front}>
            <title>Wave</title>
            <use xlinkHref='#wave' />
          </svg>
        </div>
      </div>
    </>
  )
}

export default Liquid
