import React from 'react'

export function RaizIcon({ className, ...props }: React.ComponentPropsWithoutRef<'img'>) {
  return (
    <img
      src="/images/logo-raiz-transp.png"
      alt="Raíz·Red"
      className={className}
      {...props}
    />
  )
}
