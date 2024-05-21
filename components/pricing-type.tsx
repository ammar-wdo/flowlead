'use client'

import { cn } from '@/lib/utils'
import { pricingTypeMap } from '@/mapping'
import { pricingTypeEnum } from '@/schemas'
import React from 'react'
export type SinglePricingType = (typeof pricingTypeEnum)[number]
type Props = {
    pricingType: SinglePricingType,
    isChoosen: boolean
    onChange: (value: SinglePricingType) => void
}

const PricingTypeComponent = ({ pricingType, onChange, isChoosen }: Props) => {
    return (
        <div onClick={() => onChange(pricingType)} className={cn('rounded-md border px-12 py-8 flex items-center gap-3 transition cursor-pointer hover:border-second hover:text-second', isChoosen && '   border-second text-second')}>
            {pricingTypeMap[pricingType].Icon} 
            {pricingTypeMap[pricingType].title}
            </div>
    )
}

export default PricingTypeComponent