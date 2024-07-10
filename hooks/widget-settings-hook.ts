import { WidgetSettings } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { widgetSchema } from "@/schemas";
import { toast } from "sonner";
import { updateWidgetSettings } from "@/actions/widget-settings-actions";
import { useParams, useRouter } from "next/navigation";
import { useColor } from "react-color-palette";
import { useEffect, useState } from "react";

type Props = {
  widgetSettings: WidgetSettings | null | undefined;
};

export const useWidgetSettings = ({ widgetSettings }: Props) => {


  const form = useForm<z.infer<typeof widgetSchema>>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      color: widgetSettings?.color || "",
      thankyouText: widgetSettings?.thankyouText || "",
      widgetButtonText: widgetSettings?.widgetButtonText || "",
    },
  });
  const [color, setColor] = useColor(widgetSettings?.color || "")

  useEffect(()=>{
    form.setValue('color',color.hex)
  },[color])
  const { companySlug } = useParams<{ companySlug: string }>();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof widgetSchema>) {
    try {
      const res = await updateWidgetSettings({ companySlug, values });

      if (!res.success) return toast.error(res.error);

      toast.success(res.message);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  const [copied, setCopied] = useState(false)
  const handleCopy = ()=>{
    setCopied(true)
    navigator.clipboard.writeText(`<script src="https://flowlead-widget.vercel.app/widget.js" data-id="${companySlug}"></script>`)
toast.info("Script Copied")
    setTimeout(()=>{
        setCopied(false)
    },1000)
  }

  return { form, onSubmit,color,setColor,handleCopy,copied };
};
