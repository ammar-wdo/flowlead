"use client";

import { useComapany } from "@/hooks/company-hook";
import { Company } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SettingsFormWrapper from "./settings-form-wrapper";
import { SingleImageDropzone } from "../single-image-dropeZone";
import { Label } from "../ui/label";
import PhoneInput from "react-phone-input-2";
import LoadingButton from "../loading-button";
import OptionalBadge from "../optional-badge";

type Props = { company: Company | null };

const CompanySettingsForm = ({ company }: Props) => {
  const { form, onSubmit, setFile, file, ImagePlaceholder, uploadImage } =
    useComapany({ company });
  return (
    <div className="mt-8 ">
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[1200px]">
            <div className="space-y-8  p-4 py-8 bg-white">

         
        <h3 className="font-normal">General Information</h3>
      <div className="mt-4 h-px w-full bg-gray-200 " />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <SettingsFormWrapper className="">
                  <FormLabel>Logo</FormLabel>
                  <div className="sm:col-span-2">
                    <div className="flex gap-3">
                      <div className="col-span-1 sm:col-span-2">
                        <FormControl>
                          {!form.watch("logo") && (
                            <SingleImageDropzone
                              width={200}
                              height={200}
                              value={file}
                              onChange={(file) => {
                                setFile(file);
                              }}
                            />
                          )}
                        </FormControl>
                      </div>
                      <Button
                        className={`${
                          (!file || !!form.watch("logo")) && "hidden"
                        }`}
                        type="button"
                        onClick={uploadImage}
                      >
                        Upload
                      </Button>

                      <ImagePlaceholder />
                    </div>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <SettingsFormWrapper className="">
                  <FormLabel>Company Name</FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* Company Address */}
          <div className="mt-4 h-px w-full bg-gray-200" />
          <SettingsFormWrapper>
            <Label>Company Address</Label>
            <div className="space-y-3 sm:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-xs text-muted-foreground ">
                      Company Address
                    </FormLabel>

                    <FormControl className="spacy-y-0">
                      <Input
                        className="max-w-[450px]"
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-xs text-muted-foreground ">
                      Company Country
                    </FormLabel>

                    <FormControl className="spacy-y-0">
                      <Input
                        className="max-w-[450px]"
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-xs text-muted-foreground ">
                      Company City
                    </FormLabel>

                    <FormControl className="spacy-y-0">
                      <Input
                        className="max-w-[450px]"
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-xs text-muted-foreground ">
                      Company Zipcode
                    </FormLabel>

                    <FormControl className="spacy-y-0">
                      <Input
                        className="max-w-[450px]"
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsFormWrapper>
          <div className="mt-4 h-px w-full bg-gray-200" />
          <FormField
            control={form.control}
            name="companyEmail"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>Company Email</FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <SettingsFormWrapper>
                  <FormLabel>Phone Number</FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <PhoneInput
                        enableSearch={true}
                        buttonStyle={{
                          border: "none",
                          backgroundColor: "#e2e8f0",
                        }}
                        containerStyle={{
                          borderRadius: "7px",
                          paddingBlock: 3,
                          maxWidth: "450px",
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
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>
                    Web URL{" "}
                    <OptionalBadge/>
                  </FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Web URL"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* Business Information */}
          <div className="mt-4 h-px w-full bg-gray-200" />
          <h3>Business Information</h3>
          <div className="mt-4 h-px w-full bg-gray-200" />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>Contact Person</FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Contact Person"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceEmail"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>Service Email</FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Service Email"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>
                    Industry{" "}
                    <OptionalBadge/>
                  </FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Industry"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 h-px w-full bg-gray-200" />
          <FormField
            control={form.control}
            name="cocNumber"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>
                    Chumber of commerce{" "}
                    <OptionalBadge/>
                  </FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Chumber of cummerce"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>Vat Number</FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Vat Number"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="IBAN"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>IBAN</FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="IBAN"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
           <div className="mt-4 h-px w-full bg-gray-200" />
           <FormField
            control={form.control}
            name="termsUrl"
            render={({ field }) => (
              <FormItem className="mt-8">
                <SettingsFormWrapper>
                  <FormLabel>
                    Terms & Conditions URL{" "}
                   <OptionalBadge/>
                  </FormLabel>
                  <div className="col-span-1 sm:col-span-2">
                    <FormControl>
                      <Input
                        className="max-w-[450px]"
                        placeholder="Terms & Conditions URL"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
             </div>
        <LoadingButton className="bg-second text-white hover:bg-second/80 w-fit ml-auto flex mt-4 rounded-lg py-2 h-fit px-6" title="Save" isLoading={form.formState.isSubmitting}/>
   
        </form>
      </Form>
    </div>
  );
};

export default CompanySettingsForm;
