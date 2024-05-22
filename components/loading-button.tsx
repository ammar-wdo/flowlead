
import React, { ButtonHTMLAttributes } from 'react'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'

type Props = {
    isLoading:boolean,
    title:string,
}  & ButtonHTMLAttributes<HTMLButtonElement>

const LoadingButton = ({isLoading,title,...rest}: Props) => {
  return (
    <Button {...rest} className={rest.className} disabled={isLoading} type="submit">    {title} { isLoading && <Loader size={20} className='animate-spin ml-3' />}

    </Button>
  )
}

export default LoadingButton