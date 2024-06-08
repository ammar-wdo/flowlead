"use client";

import React from "react";

import { z } from "zod";
import { quotationsSettings } from "@/schemas";
import { useQuotationsSettings } from "@/hooks/quotations-settings-hook";

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
import SettingsFormWrapper from "../settings/settings-form-wrapper";
import { Label } from "../ui/label";
import { replacePlaceholders } from "@/lib/utils";

type Props = {
  quotationsSettings: z.infer<typeof quotationsSettings> | undefined | null;
};

const QuotationsSettingsForm = ({ quotationsSettings }: Props) => {
  const { form, onSubmit } = useQuotationsSettings({
    quotationsSettingsData: quotationsSettings,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[1200px] mt-8"
      >
        <div className="space-y-8  p-4 py-8 bg-white">
          <FormField
            control={form.control}
            name="dueDays"
            render={({ field }) => (
              <FormItem>
                <SettingsFormWrapper>
                  <FormLabel>Valid Period of quotation (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter  number of days"
                      {...field}
                    />
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 h-px w-full bg-gray-200 " />
          <SettingsFormWrapper>
            <Label>Quotation Number Template</Label>
            <div className="sm:col-span-2 gap-1">
              <div className=" flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>prefix</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter prefix"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nextNumber"
                  render={({ field }) => (
                    <FormItem className="flex-[2]">
                      <FormLabel>Next Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Next Number"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 h-full self-stretch">
                  <Label>Next Issue</Label>
                  <p className="mt-4 text-muted-foreground text-sm ">
                    {replacePlaceholders(form.watch("prefix"))}-{form.watch("nextNumber")}
                  </p>
                </div>
              </div>
              <p className="text-sm mt-2">
                Set a default number template here. Available variables:{" "}
                <span onClick={()=>form.setValue('prefix',`${form.getValues('prefix')}-{year}`)} className="text-indigo-600 cursor-pointer">
                  {"{year}"}
                </span>
                ,{" "}
                <span onClick={()=>form.setValue('prefix',`${form.getValues('prefix')}-{month}`)} className="text-indigo-600 cursor-pointer">
                  {"{month}"}
                </span>
                
              </p>
            </div>
          </SettingsFormWrapper>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default QuotationsSettingsForm;
