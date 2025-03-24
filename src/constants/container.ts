export const CONTAINERS = {
  cup: {
    label: 'Fiole'
  },
  beaker: {
    label: 'Bécher'
  },
  tube: {
    label: 'Tube à essai'
  }
} as const

export type Containers = keyof typeof CONTAINERS
