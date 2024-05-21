import { ReactElement, ReactNode } from "react";
import { SinglePricingType } from "./components/pricing-type";
import { ArrowDown, Check, CheckCircle, LucideIcon, ShieldCheck } from "lucide-react";


export const pricingTypeMap: { [key in SinglePricingType]: { title: string, Icon: ReactNode } } = {
    'CHECKBOX_GROUP': { title: "Checkbox Group", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border bg-second text-second"><Check className="text-white" /></div> },
    'DROPDOWN_GROUP': { title: "DropdownGroup", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border bg-second text-second"><ArrowDown className="text-white"/></div> },
    'RADIO_GROUP': { title: "Radio Group", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border border-second  text-second"><span className="h-5 w-5 rounded-full bg-second" /></div> },
    'SINGLE_PRICE': { title: "Single Price", Icon: <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full border bg-second text-second"><span className=" rounded-full text-white">1</span></div> },
}