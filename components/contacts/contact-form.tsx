"use client";

import { useLead } from "@/hooks/lead-form-hook";
import { Contact } from "@prisma/client";

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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import FormItemWrapper from "../forms/form-item-wrapper";
import SettingsFormWrapper from "../settings/settings-form-wrapper";
import { Label } from "../ui/label";
import LoadingButton from "../loading-button";
import { useContact } from "@/hooks/contact-form-hook";

type Props = {
  contact: Contact | null;
};

const ContactForm = ({ contact }: Props) => {
  const { form, onSubmit } = useContact({ contact });
  const isLoading = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="contactType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <SettingsFormWrapper>
                <FormLabel>Lead Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-12"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 ">
                      <FormControl>
                        <RadioGroupItem
                          className="cursor-pointer"
                          value="INDIVIDUAL"
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Individual
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 ">
                      <FormControl>
                        <RadioGroupItem
                          className="cursor-pointer"
                          value="BUSINESS"
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Business
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Lead name</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Lead Name" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("contactType") === "BUSINESS" && (
          <div className="my-1">
            <div className="h-px w-full bg-gray-200 my-1" />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <SettingsFormWrapper>
                    <FormLabel>Company name</FormLabel>
                    <FormControl className="md:col-span-2 max-w-[450px]">
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                  </SettingsFormWrapper>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
        )}
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Email Address</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Email Address" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Phone Number</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel className="text-sm text-muted-foreground">
                  Mobile Number
                </FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Mobile Number" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1 " />
        <SettingsFormWrapper>
          <Label>Address</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:col-span-2 max-w-[450px]">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
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
                  <FormLabel className="text-xs text-muted-foreground">
                    Zipcode
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Zipcode" {...field} />
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
                  <FormLabel className="text-xs text-muted-foreground">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
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
                  <FormLabel className="text-xs text-muted-foreground">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SettingsFormWrapper>

        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="cocNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Chumber of commerce</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Chumber of commerce" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>VAT Number</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="VAT Number" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="IBAN"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>IBAN</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="IBAN" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
        className="ml-auto  flex bg-second hover:bg-second/90"
          isLoading={isLoading}
          title={contact ? "Update" : "Create"}
        />
      </form>
    </Form>
  );
};

export default ContactForm;
