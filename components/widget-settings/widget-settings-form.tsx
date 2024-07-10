"use client";

import { useWidgetSettings } from "@/hooks/widget-settings-hook";
import { WidgetSettings } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { ColorPicker,useColor } from "react-color-palette";
import "react-color-palette/css";
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
import SettingsFormWrapper from "../settings/settings-form-wrapper";
import { Textarea } from "../ui/textarea";

type Props = {
  widgetSettings: WidgetSettings | null | undefined;
};

const WidgetSettingsForm = ({ widgetSettings }: Props) => {
  const { form, onSubmit ,color, setColor} = useWidgetSettings({ widgetSettings });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[1000px] flex flex-col"
      >
        <div className="bg-white p-12 space-y-8">
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Widget Color</FormLabel>
                <FormControl>
                  <ColorPicker
                    color={color}
                    onChange={setColor}
                  />
                
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />
          {form.watch('color')}
        <div className="w-full bg-muted h-px my-4"/>
        <FormField
          control={form.control}
          name="thankyouText"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Thank you Text</FormLabel>
                <FormControl>
                  <Textarea placeholder=""  {...field} className="col-span-2 resize-none" />
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />
          <div className="w-full bg-muted h-px my-4"/>
        <FormField
          control={form.control}
          name="widgetButtonText"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Button Label</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field}  className="col-span-2"/>
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />
        </div>
    
        <Button
          disabled={form.formState.isSubmitting}
          className="bg-second hover:bg-second/90 text-white w-fit ml-auto"
          type="submit"
        >
          Save{" "}
          {form.formState.isSubmitting && (
            <Loader size={15} className="ml-2 animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default WidgetSettingsForm;
