'use client'

import React, { useEffect, useRef, useState } from 'react'

type Props = {
    variable: string | number,
    previousVar:React.MutableRefObject<number>
}

const Scroller = ({ variable,previousVar }: Props) => {

    const varRef = useRef<HTMLDivElement | null>(null)
   
    const [mount, setMount] = useState(false)

    useEffect(() => {

        
        console.log(variable, previousVar.current)
       


        if (mount && +variable > previousVar.current) {

            
            varRef.current?.scrollIntoView({ behavior: 'smooth' })
            previousVar.current = +variable
        }
        else {
            setMount(true)
        }

    }, [variable])
    return (
        <div ref={varRef} />
    )
}

export default Scroller