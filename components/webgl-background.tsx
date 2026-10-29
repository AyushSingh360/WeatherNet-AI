"use client"

import Iridescence from "./Iridescence"

interface WebglBackgroundProps {
  className?: string
  style?: React.CSSProperties
}

export function WebglBackground({ className, style }: WebglBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={className || "fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"}
      style={style}
    >
      <Iridescence
        color={[1, 1, 1]}
        hueShift={0}
        saturation={0}
        brightness={0.55}
        contrast={2.2}
        speed={0.75}
        scale={1.1}
        detail={12}
        warp={0.8}
        rotation={0}
        mouseReact={false}
        amplitude={0.1}
        stir={0.5}
        sheen={0.3}
        clickSwirl={false}
        grain={0}
        fade={0}
      />
    </div>
  )
}

export { WebglBackground as IridescenceBackground }
export default WebglBackground
