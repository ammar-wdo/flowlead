import { formSchema, ruleSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "./modal-hook";
import { Form, Rule } from "@prisma/client";
import { addForm, editForm } from "@/actions/form-actions";
import { useSelectedElement } from "./selected-element-hook";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLogo } from "./logo-hook";

export const useFormElements = (fetchedForm: Form | undefined | null) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: fetchedForm?.name || "",
      description: fetchedForm?.description || "",
      isPublished: fetchedForm?.isPublished || false,
      logo:fetchedForm?.logo || "",
      isWidjet: fetchedForm?.isWidjet || false,
      elements: fetchedForm?.elements || [
        { id: uuidv4(), type: "FIELD", field: { type: "name",id:uuidv4(),placeholder:"Naam",label:"Naam", validations:{required:true},options:[]} },
        { id: uuidv4(), type: "FIELD", field: { type: "email",id:uuidv4(),placeholder:"Email Adres",label:"Email Adres", validations:{required:true},options:[]} },

      ],
      rules: fetchedForm?.rules as unknown as z.infer<typeof ruleSchema>[],
    },
  });

  const { setSelectedElementNull } = useSelectedElement();
  const formRef = useRef<HTMLDivElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);
 

 
  const handleClickOutside = (event: MouseEvent) => {
    //check if we click inside select also not to set selected to null
    const isClickInsideCustomSelect = (node: Node | null): boolean => {
      while (node) {
        if (node instanceof HTMLElement && node.classList.contains('custom-select')) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    if (
      formRef.current &&
      !formRef.current.contains(event.target as Node) &&
      optionRef.current &&
      !optionRef.current.contains(event.target as Node) &&
      !isClickInsideCustomSelect(event.target as Node)
    ) {
      setSelectedElementNull();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedElementNull();
  }, []);

  const params = useParams<{ companySlug: string }>();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res;

    try {
      if (!fetchedForm) {
        res = await addForm(values, params.companySlug);
        if (!res.success) return toast.error(res.error);
        router.push(
          `${process.env.NEXT_PUBLIC_BASE_URL!}/${
            params.companySlug
          }/forms/${res.formSlug}`
        );
        toast.success(res.message);
        router.refresh();
      } else {
        res = await editForm(values, params.companySlug, fetchedForm.id);
        if (!res.success) return toast.error(res.error);
        toast.success(res.message);
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSelectedElementNull();
    }
  }

  const {ImagePlaceholder,file,setFile,uploadImage} = useLogo({form })

  return { form, onSubmit,formRef,optionRef,ImagePlaceholder,file,setFile,uploadImage  };
};
