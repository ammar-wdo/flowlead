'use client'

import { useComapany } from '@/hooks/company-hook'
import { Button } from "@/components/ui/button"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import SectionsWrapper from '../sections-wrapper'

type Props = {}

const CompanyForm = (props: Props) => {

    const {form,onSubmit} = useComapany()
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <SectionsWrapper title='General Information'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
            <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name*</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address*</FormLabel>
              <FormControl>
                <Input placeholder="Company Address" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Country*</FormLabel>
              <FormControl>
                <Input placeholder="Company Country" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company City*</FormLabel>
              <FormControl>
                <Input placeholder="Company City" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number*</FormLabel>
              <FormControl>
              <PhoneInput
                  enableSearch={true}
                  buttonStyle={{ border: "none",backgroundColor:'#e2e8f0' }}
                  containerStyle={{
                    borderRadius: "7px",
                    paddingBlock: 3,
                    width: "100%",
                    border: "  1px #E2E8F0 solid",
                  }}
                  inputStyle={{
                    border: "none",
                    width: "100%",
                    backgroundColor: "transparent",
                  }}
                  value={form.getValues("phone")}
                  onChange={(phone) => form.setValue("phone", phone)}
                />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="Website URL" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

            </div>
       
        </SectionsWrapper>
       
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default CompanyForm