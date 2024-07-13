import { ReactElement, ReactNode } from "react";
import { SinglePricingType } from "./components/pricing-type";
import { ArrowDown, Check, CheckCircle, LucideIcon, ShieldCheck } from "lucide-react";
import { ComparisonOperatorType, FieldTypeMapper, TaxesType, dateComparisonOperator, numberComparisonOperator, phoneComparisonOperator, serviceAndMultipleComparisonOperator, textComparisonOperatorArray } from "./schemas";


export const pricingTypeMap: { [key in SinglePricingType]: { title: string, Icon: ReactNode } } = {
    'CHECKBOX_GROUP': { title: "Checkbox Group", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border bg-second text-second"><Check className="text-white" /></div> },
    'DROPDOWN_GROUP': { title: "Dropdown Group", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border bg-second text-second"><ArrowDown className="text-white"/></div> },
    'RADIO_GROUP': { title: "Radio Group", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border border-second  text-second"><span className="h-5 w-5 rounded-full bg-second" /></div> },
    'SINGLE_PRICE': { title: "Single Price", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border bg-second text-second"><span className=" rounded-full text-white">1</span></div> },
}



export const inputsLabelsMap : {[key in FieldTypeMapper]:string} ={

    text:"Text Input",
    select:"Dropdown Menu",
    checkbox:"Checkbox Group",
    radio:"Radio Button Group",
    breaker:"Page Break",
    number:"Number Input",
    address:"Address",
    sectionBreaker:"Section Break",
    longText:"Long Text",
    phone:"Phone",
    name:"Naam",
    email:"Email Adres",
    date:"Date Picker"
}

export const taxesValuesMapper:{[key in TaxesType]:number} = {
    "0% btw":0,
    "21% btw":21,
    "9% btw":9,
    
}

export const valuesTaxesMapper:{[key:number]:TaxesType} ={
0:'0% btw',
9:'9% btw',
21:'21% btw'
}

 



export const operatorTypeMapp :{[key in FieldTypeMapper]: ComparisonOperatorType[]} ={
    text:textComparisonOperatorArray as unknown as ComparisonOperatorType[],
    longText:textComparisonOperatorArray as unknown as ComparisonOperatorType[],
    number:numberComparisonOperator as unknown as ComparisonOperatorType[],
    address:textComparisonOperatorArray as unknown as ComparisonOperatorType[],
    breaker:textComparisonOperatorArray as unknown as ComparisonOperatorType[],
    sectionBreaker:textComparisonOperatorArray as unknown as ComparisonOperatorType[],
    checkbox:serviceAndMultipleComparisonOperator as unknown as ComparisonOperatorType[],
    phone:phoneComparisonOperator as unknown as ComparisonOperatorType[],
    radio:serviceAndMultipleComparisonOperator as unknown as ComparisonOperatorType[],
    select:serviceAndMultipleComparisonOperator as unknown as ComparisonOperatorType[],
    name:textComparisonOperatorArray as unknown as ComparisonOperatorType[],
    email:textComparisonOperatorArray as unknown as ComparisonOperatorType[],
    date:dateComparisonOperator as unknown as ComparisonOperatorType[]
 


}