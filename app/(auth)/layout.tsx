import React, { ReactNode } from 'react'

type Props = {children:ReactNode}

const layout = ({children}: Props) => {
  return (
    <div className='min-h-screen flex items-center justify-center'>{children}</div>
  )
}

export default layout