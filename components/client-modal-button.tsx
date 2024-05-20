'use client'
import { ModalInputs, useModal } from '@/hooks/modal-hook'
import React, { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Button } from './ui/button'

type Props = {
    modalInputs:ModalInputs,
    children:ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const ClientModalButton = ({modalInputs,children,...rest}: Props) => {

    const {setOpen} = useModal()
  return (
   <Button onClick={()=>setOpen(modalInputs)} {...rest}>
{children}
   </Button>
  )
}

export default ClientModalButton