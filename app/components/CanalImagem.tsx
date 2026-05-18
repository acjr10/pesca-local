'use client'

import { useState } from 'react'

interface Props {
  src?: string
  alt: string
  imgClass: string
  fallbackClass: string
  fallbackContent?: string
}

export default function CanalImagem({ src, alt, imgClass, fallbackClass, fallbackContent = '▶' }: Props) {
  const [broken, setBroken] = useState(false)

  if (!src || broken) {
    return <div className={fallbackClass}>{fallbackContent}</div>
  }

  return (
    <img
      src={src}
      alt={alt}
      className={imgClass}
      onError={() => setBroken(true)}
    />
  )
}
