import { useCallback, useEffect, useMemo, useState } from 'react'
import type { LiquidAmount, LIQUIDS } from '../constants/liquid'
import { nanoid } from 'nanoid'
import { ITEMS } from '../constants/items'
type liquid = { id: keyof typeof LIQUIDS; volume: number }

const CUPS: { id: string; volume: number; liquids: liquid[] }[] = ITEMS.cups.map(cup => ({
  id: nanoid(),
  ...cup
}))

const TUBES: { id: string; volume: number; liquids: liquid[] }[] = ITEMS.tubes.map(tube => ({
  id: nanoid(),
  ...tube
}))

const useItems = () => {
  const [hoses, setHoses] = useState<
    {
      id: string
      type: keyof typeof LIQUIDS
      openRatio: number
      pouringPosition: [number, number] | undefined
    }[]
  >(
    ITEMS.hoses.map(hose => ({
      id: nanoid(),
      ...hose,
      openRatio: 0,
      pouringPosition: undefined
    }))
  )

  const [cups, setCups] = useState<
    {
      id: string
      volume: number
      neckPosition: [number, number] | undefined
      height: number | undefined
    }[]
  >(
    CUPS.map(cup => ({
      id: cup.id,
      volume: cup.volume,
      neckPosition: undefined,
      height: undefined
    }))
  )

  const [tubes, setTubes] = useState<
    {
      id: string
      volume: number
      neckPosition: [number, number] | undefined
      height: number | undefined
    }[]
  >(
    TUBES.map(tube => ({
      id: tube.id,
      volume: tube.volume,
      neckPosition: undefined,
      height: undefined
    }))
  )

  const [containerLiquids, setContainerLiquids] = useState<{
    [k: string]: liquid[]
  }>(
    Object.fromEntries(
      [...CUPS, ...TUBES].map(container => {
        return [container.id, container.liquids]
      })
    )
  )

  const hosesContraints = useMemo(() => {
    return Object.fromEntries(
      hoses
        .filter(hose => hose.openRatio > 0 && hose.pouringPosition)
        .map(hose => {
          const minXBound = hose.pouringPosition![0] - 8
          const maxXBound = hose.pouringPosition![0] + 8
          const minYBound = hose.pouringPosition![1]
          const maxYBound = hose.pouringPosition![1] + 540

          const higherContainer = [...cups, ...tubes]
            .map(container => {
              if (!container.neckPosition) return undefined
              if (
                container.neckPosition[0] > minXBound &&
                container.neckPosition[0] < maxXBound &&
                container.neckPosition[1] > minYBound &&
                container.neckPosition[1] < maxYBound
              ) {
                return container
              }
              return undefined
            })
            .filter(container => container !== undefined)
            .sort((a, b) => a.neckPosition![1] - b.neckPosition![1])?.[0]

          if (!higherContainer) return undefined

          const higherNeckbottle = higherContainer?.neckPosition?.[1]

          return [
            hose.id,
            {
              openRatio: hose.openRatio,
              liquidType: hose.type,
              containerId: higherContainer.id,
              containerVolume: higherContainer.volume,
              maxHeight: higherNeckbottle ? higherNeckbottle - 300 + 18 + (higherContainer.height ?? 0) : undefined
            }
          ]
        })
        .filter(coll => coll !== undefined)
    )
  }, [hoses, cups, tubes]) as {
    [k: string]: {
      openRatio: number
      liquidType: 'water' | 'poison' | 'wine'
      containerId: string
      containerVolume: number
      maxHeight: number | undefined
    }
  }

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    for (const hoseId in hosesContraints) {
      const constraint = hosesContraints[hoseId]
      intervals.push(
        setInterval(
          () => {
            setContainerLiquids(prev => {
              const remainingVolume = constraint.containerVolume - prev[constraint.containerId].reduce((acc, current) => acc + current.volume, 0)
              const currentLiquidAmount = prev[constraint.containerId].find(liquid => liquid.id === constraint.liquidType)?.volume

              const newLiquids =
                currentLiquidAmount === undefined
                  ? [
                      ...prev[constraint.containerId],
                      {
                        id: constraint.liquidType,
                        volume: Math.min(remainingVolume, 0.1)
                      }
                    ]
                  : prev[constraint.containerId].map(liquid =>
                      liquid.id === constraint.liquidType
                        ? {
                            ...liquid,
                            volume: liquid.volume + Math.min(remainingVolume, 0.1)
                          }
                        : liquid
                    )

              return {
                ...prev,
                [constraint.containerId]: newLiquids
              }
            })
          },
          (100 - constraint.openRatio) ** 2 / 100
        )
      )
    }

    return () => {
      for (const interval of intervals) {
        clearInterval(interval)
      }
    }
  }, [hosesContraints])

  const setHosePosition = useCallback((id: string, pouringPosition: [number, number], openRatio: number) => {
    setHoses(prev => prev.map(hose => (hose.id === id ? { ...hose, pouringPosition, openRatio } : hose)))
  }, [])

  const setCupPosition = useCallback((id: string, neckPosition: [number, number], height: number) => {
    setCups(prev => prev.map(cup => (cup.id === id ? { ...cup, neckPosition, height } : cup)))
  }, [])

  const setTubePosition = useCallback((id: string, neckPosition: [number, number], height: number) => {
    setTubes(prev => prev.map(tube => (tube.id === id ? { ...tube, neckPosition, height } : tube)))
  }, [])

  const setTubeContent = useCallback((id: string, liquids: LiquidAmount[]) => {
    setContainerLiquids(prev => ({ ...prev, [id]: liquids }))
  }, [])

  const setCupContent = useCallback((id: string, liquids: LiquidAmount[]) => {
    setContainerLiquids(prev => ({ ...prev, [id]: liquids }))
  }, [])

  return {
    containerLiquids,
    hosesContraints,
    hoses,
    cups,
    tubes,
    setCupPosition,
    setTubePosition,
    setHosePosition,
    setTubeContent,
    setCupContent
  }
}

export default useItems
