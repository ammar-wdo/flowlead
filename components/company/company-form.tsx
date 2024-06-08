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
import { SingleImageDropzone } from '../single-image-dropeZone';
import { Loader } from 'lucide-react';

type Props = {}

const CompanyForm = (props: Props) => {

  const { form, onSubmit, file, setFile, uploadImage, ImagePlaceholder } = useComapany({company:null})
  const isLoading = form.formState.isSubmitting
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
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Zipcode*</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Zipcode" {...field} />
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
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <SingleImageDropzone
                      width={200}
                      height={200}
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
            />

          </div>


        </SectionsWrapper>
        <SectionsWrapper title='Business Information'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
            <FormField
              control={form.control}
              name="serviceEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Service Email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cocNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chumber of Commerce</FormLabel>
                  <FormControl>
                    <Input placeholder="Chumber of Commerce" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indusry</FormLabel>
                  <FormControl>
                    <Input placeholder="Industry" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="VAT Number" {...field} />
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
                  <FormLabel>Contact Person*</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Person" {...field} />
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
                  <FormLabel>IBAN*</FormLabel>
                  <FormControl>
                    <Input placeholder="IBAN" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="termsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Terms & Conditions URL" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </SectionsWrapper>

        <Button disabled={isLoading} type="submit">Submit {isLoading && <Loader className='animate-spin ml-3' />}</Button>
      </form>
    </Form>
  )
}

export default CompanyForm