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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import SectionsWrapper from '../sections-wrapper'
import { SingleImageDropzone } from '../single-image-dropeZone';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import Optional from '../optional';

type Props = {}

const CompanyForm = (props: Props) => {

  const { form, onSubmit, file, setFile, uploadImage, ImagePlaceholder ,step,validatingArray,handleNext,handleBack} = useComapany({company:null})
  const isLoading = form.formState.isSubmitting
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

       {step===0 &&  
          <div className='grid md:grid-cols-2  gap-8'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
               <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
              <FormLabel>Country  </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className='cursor-pointer' value="Netherlands">Netherlands</SelectItem>
                  <SelectItem className='cursor-pointer' value="Belguim">Belguim</SelectItem>
                  
                </SelectContent>
              </Select>
         
            
              <FormMessage />
            </FormItem>
          )}
        />
         
          
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    {/* <PhoneInput
                    placeholder=''
                      showDropdown={false}
                      containerClass="phone-input-container"
                      inputClass="phone-input"
                      buttonClass="phone-input-button"
                      dropdownClass="phone-input-dropdown"
                      buttonStyle={{ border: "none", backgroundColor: '#e2e8f0' }}
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
                    /> */}
                    <Input {...field} type='number'/>
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
                  <FormLabel>Website URL <Optional/></FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
         
            {/* <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <SingleImageDropzone
                    className=''
                    
                      height={100}
                      value={file}
                      onChange={(file) => {
                        setFile(file);
                      }}
                    />
                  </FormControl>
                  <Button
                    className={`${(!file || !!form.watch('logo')) && 'hidden'}`}

                    type="button"
                    onClick={uploadImage}
                  >
                    Upload
                  </Button>

                  <ImagePlaceholder />
                  <FormMessage />
                </FormItem>
              )}
            /> */}

          </div>


    }
    {  step===1 &&  
          <div className='grid md:grid-cols-2  gap-3'>
        
            <FormField
              control={form.control}
              name="cocNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chamber of Commerce <Optional/></FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indusry</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="vatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Number <Optional/></FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
        
            <FormField
              control={form.control}
              name="IBAN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN <Optional/></FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="termsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions URL</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

   }
        <div className='flex items-center justify-between'>
         {  <Button type='button' className={cn((step === 0) && '!opacity-0 pointer-events-none')} variant={'secondary'} disabled={step===0} onClick={handleBack}>Back</Button>}
          <div>
            {step===0 && <Button type='button' onClick={handleNext} className='bg-second hover:bg-second/80 text-white hoer;text-white'>Next</Button>}
            {step===1 &&   <Button disabled={isLoading} className='bg-second hover:bg-second/80 text-white hoer;text-white' type="submit">Submit {isLoading && <Loader className='animate-spin ml-3' />}</Button>}
          </div>

        </div>

      
      </form>
    </Form>
  )
}

export default CompanyForm