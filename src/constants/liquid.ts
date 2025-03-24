export const LIQUIDS = {
  wine: {
    label: 'Ethanol',
    color: '#9f0288'
  },
  water: {
    label: 'Eau',
    color: '#8BCCF1'
  },
  poison: {
    label: 'Poison',
    color: '#143f14'
  }
} as const

export type LiquidAmount = {
  id: keyof typeof LIQUIDS
  volume: number
}
