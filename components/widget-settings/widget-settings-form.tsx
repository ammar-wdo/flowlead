"use client";

import { useWidgetSettings } from "@/hooks/widget-settings-hook";
import { WidgetSettings } from "@prisma/client";
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
import { Loader } from "lucide-react";

type Props = {
  widgetSettings: WidgetSettings | null | undefined;
};

const WidgetSettingsForm = ({ widgetSettings }: Props) => {
  const { form, onSubmit } = useWidgetSettings({ widgetSettings });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[700px]"
      >
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Widget Color</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thankyouText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thank you Text</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="widgetButtonText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Label</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          className="bg-second hover:bg-second/90 text-white"
          type="submit"
        >
          Submit{" "}
          {form.formState.isSubmitting && (
            <Loader size={15} className="ml-2 animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default WidgetSettingsForm;
