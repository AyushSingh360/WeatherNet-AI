import type { CSSProperties, FC } from "react"

export interface IridescenceProps {
  color?: string | number[]
  speed?: number
  amplitude?: number
  mouseReact?: boolean
  scale?: number
  detail?: number
  rotation?: number
  warp?: number
  hueShift?: number
  saturation?: number
  brightness?: number
  contrast?: number
  stir?: number
  sheen?: number
  clickSwirl?: boolean
  grain?: number
  fade?: number
  opacity?: number
  resolution?: number
  paused?: boolean
  className?: string
  style?: CSSProperties
}

declare const Iridescence: FC<IridescenceProps>
export default Iridescence
