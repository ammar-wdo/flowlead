import { Company, Form } from "@prisma/client";
import { useQuery } from "@tanstack/react-query"
import axios from 'axios'





export const useWidget = (slug:string)=>{

    const fetchWidgetCompany = async()=>{
        const { data } = await axios.get<{success:boolean,data?:Company & {forms:Form[]}}>(`/api/company/${slug}`);
        return data.data;
    }


return useQuery({
    queryKey:['widget'],
    queryFn:fetchWidgetCompany
})

}