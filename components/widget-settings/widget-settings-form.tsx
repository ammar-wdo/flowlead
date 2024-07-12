"use client";

import { useWidgetSettings } from "@/hooks/widget-settings-hook";
import { WidgetSettings } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { ColorPicker, useColor } from "react-color-palette";
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
import { Check, Copy, Loader } from "lucide-react";
import SettingsFormWrapper from "../settings/settings-form-wrapper";
import { Textarea } from "../ui/textarea";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  widgetSettings: WidgetSettings | null | undefined;
};

const WidgetSettingsForm = ({ widgetSettings }: Props) => {
  const { form, onSubmit, color, setColor, handleCopy, copied } =
    useWidgetSettings({
      widgetSettings,
    });

  const { companySlug } = useParams<{ companySlug: string }>();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[1000px] flex flex-col "
      >
        <Button
        type="button"
          style={{ backgroundColor: form.watch("color"),...(form.watch('widgetPostion')==='LEFT' ?{left:20} :{right:20}) }}
          className="fixed bottom-3 z-[9999999999]"
        >
          {form.watch("widgetButtonText")}
        </Button>
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
                      hideAlpha={true}
                      color={color}
                      onChange={setColor}
                    />
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full bg-muted h-px my-4" />
          <FormField
            control={form.control}
            name="thankyouText"
            render={({ field }) => (
              <FormItem>
                <SettingsFormWrapper>
                  <FormLabel>Thank you Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      {...field}
                      className="col-span-2 resize-none"
                    />
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full bg-muted h-px my-4" />
          <FormField
            control={form.control}
            name="widgetButtonText"
            render={({ field }) => (
              <FormItem>
                <SettingsFormWrapper>
                  <FormLabel>Button Label</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} className="col-span-2" />
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full bg-muted h-px my-4" />
          <FormField
            control={form.control}
            name="widgetPostion"
            render={({ field }) => (
              <FormItem>
                <SettingsFormWrapper>
                  <FormLabel>Widget Position</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4 col-span-2">
                      <span
                        onClick={() => field.onChange("LEFT")}
                        className={cn(
                          "text-xs px-8 py-2 flex  text-muted-foreground items-center justify-center border cursor-pointer hover:border-second hover:text-second transition rounded-lg",
                          field.value === "LEFT" &&
                            "bg-second border-second text-white hover:bg-second hover:text-white"
                        )}
                      >
                        Left
                      </span>
                      <span
                        onClick={() => field.onChange("RIGHT")}
                        className={cn(
                          "text-xs px-8 py-2 flex text-muted-foreground items-center justify-center border cursor-pointer hover:border-second hover:text-second transition rounded-lg",
                          field.value === "RIGHT" &&
                            "bg-second text-white border-second hover:bg-second hover:text-white"
                        )}
                      >
                        Right
                      </span>
                    </div>
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full bg-muted h-px my-4" />
          <SettingsFormWrapper>
            <FormLabel>Paste this HTML into your website</FormLabel>
            <div className="col-span-2 p-10 rounded-lg bg-slate-800 relative">
              <button
                onClick={handleCopy}
                type="button"
                className="absolute top-2 right-2 p-1 bg-white rounded-sm"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
              <pre>
                <code
                  id="code-snippet"
                  className="text-xs text-white text-wrap"
                >
                  {`<script src="https://flowlead-widget.vercel.app/widget.js" data-id="${companySlug}"></script>`}
                </code>
              </pre>
            </div>
          </SettingsFormWrapper>
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
