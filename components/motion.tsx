'use client'
import {MotionProps,motion} from 'framer-motion'
import { HTMLAttributes, ReactNode } from 'react'

type Props = {
    children:ReactNode
} & MotionProps & HTMLAttributes<HTMLDivElement>

const Motion = ({children,...rest}: Props) => {
  return (
    <motion.div {...rest}>{children}</motion.div>
  )
}

export default Motion