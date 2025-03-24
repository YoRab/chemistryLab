export const getCursorPosition = (
  e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  canvas?: HTMLCanvasElement | null
): { x: number; y: number; t: number } => {
  const { clientX = 0, clientY = 0 } =
    'touches' in e && e.touches[0] ? e.touches[0] : 'changedTouches' in e && e.changedTouches[0] ? e.changedTouches[0] : 'clientX' in e ? e : {}

  const canvasBoundingRect = canvas?.getBoundingClientRect() ?? {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }
  return {
    x: (clientX - canvasBoundingRect.left) * (window.innerWidth / canvasBoundingRect.width),
    y: (clientY - canvasBoundingRect.top) * (window.innerHeight / canvasBoundingRect.height),
    t: Date.now()
  }
}
