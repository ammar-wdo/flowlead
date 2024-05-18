'use client'

import { useModal } from '@/hooks/modal-hook'
import React, { useEffect } from 'react'

type Props = {}

const DashboardPrepare = (props: Props) => {

    const { open,modalInputs,setOpen}
        = useModal()


    useEffect(() => { 
        if(!open)
            {
                setOpen({type:'company-modal'})
            }
    }, [open])

    return null


}


export default DashboardPrepare