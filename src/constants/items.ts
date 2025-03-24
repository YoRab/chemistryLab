import type { LIQUIDS } from './liquid'

type liquid = { id: keyof typeof LIQUIDS; volume: number }

export const ITEMS = {
  hoses: [{ type: 'water' }, { type: 'poison' }, { type: 'wine' }],
  cups: [
    {
      volume: 125,
      liquids: [
        {
          id: 'wine',
          volume: 75
        }
      ] as liquid[]
    },
    {
      volume: 250,
      liquids: [{ id: 'poison', volume: 125 }] as liquid[]
    },
    {
      volume: 500,
      liquids: [
        { id: 'wine', volume: 125 },
        { id: 'poison', volume: 250 }
      ] as liquid[]
    }
  ],
  tubes: [
    {
      volume: 15,
      liquids: [
        {
          id: 'water',
          volume: 10
        }
      ] as liquid[]
    },
    {
      volume: 25,
      liquids: [{ id: 'poison', volume: 12 }] as liquid[]
    },
    {
      volume: 50,
      liquids: [
        { id: 'wine', volume: 10 },
        { id: 'poison', volume: 25 },
        { id: 'water', volume: 5 }
      ] as liquid[]
    }
  ]
} as const
