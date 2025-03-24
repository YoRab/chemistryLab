declare module '*.module.css'

namespace React {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
