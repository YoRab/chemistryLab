import { CONTAINERS, type Containers } from '../../constants/container'
import { LIQUIDS, type LiquidAmount } from '../../constants/liquid'
import { cx } from '../../utils/style'
import cssModule from './containerInfos.module.css'

const ContainerInfos = ({
  className,
  volume,
  liquids,
  show,
  type,
  clearContainer,
  ...props
}: { volume: number; liquids: LiquidAmount[]; show: boolean; type: Containers; clearContainer: () => void } & JSX.IntrinsicElements['div']) => {
  return (
    <div className={cx(className, cssModule.containerHidding)} {...props} data-show={show}>
      <div className={cssModule.container}>
        <div className={cssModule.content}>
          <div className={cssModule.title}>
            {CONTAINERS[type].label} {volume}ml
          </div>
          <div className={cssModule.infos}>
            <div className={cssModule.line} />
            <div className={cssModule.line2} />
            {liquids.map(({ id, volume: liquideVolume }) => {
              const liquid = LIQUIDS[id]
              return (
                <div className={cssModule.infosItem} key={id}>
                  {liquid.label} {Math.round(liquideVolume)}ml ({Math.round((liquideVolume / volume) * 100)}%)
                </div>
              )
            })}
            <button type='button' className={cssModule.clear} onClick={clearContainer}>
              Vider
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContainerInfos
