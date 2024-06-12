"use client";

import { useLead } from "@/hooks/lead-form";
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

type Props = {
  lead: Contact | null;
};

const LeadForm = ({ lead }: Props) => {
  const { form, onSubmit } = useLead({ lead });
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
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="INDIVIDUAL" />
                      </FormControl>
                      <FormLabel className="font-normal">Individual</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="BUSINESS" />
                      </FormControl>
                      <FormLabel className="font-normal">Business</FormLabel>
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
                <FormControl>
                  <Input placeholder="Lead Name" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
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
                <FormControl>
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
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="Mobile Number" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LeadForm;
