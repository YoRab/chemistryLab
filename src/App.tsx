import cssModule from './App.module.css'
import Cup from './components/container/cup'
import Tube from './components/container/tube'
import Hose from './components/container/hose'
import useItems from './hooks/useItems'

function App() {
  const { hosesContraints, containerLiquids, hoses, cups, tubes, setTubePosition, setCupPosition, setHosePosition, setCupContent, setTubeContent } =
    useItems()
  return (
    <div className={cssModule.container}>
      <div className={cssModule.left}>
        {cups.map(cup => {
          return (
            <Cup
              key={cup.id}
              id={cup.id}
              volume={cup.volume}
              liquids={containerLiquids[cup.id]}
              setCupPosition={setCupPosition}
              setCurrentContent={setCupContent}
            />
          )
        })}
      </div>
      <div className={cssModule.center}>
        {hoses.map(hose => {
          return (
            <Hose key={hose.id} id={hose.id} setHosePosition={setHosePosition} maxHeight={hosesContraints[hose.id]?.maxHeight} type={hose.type} />
          )
        })}
      </div>
      <div className={cssModule.right}>
        {tubes.map(tube => {
          return (
            <Tube
              key={tube.id}
              id={tube.id}
              volume={tube.volume}
              liquids={containerLiquids[tube.id]}
              setTubePosition={setTubePosition}
              setCurrentContent={setTubeContent}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
