"use client";

import { Form, Service } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import FieldsComponent from "./fields-component";
import RulesComponent from "./rules-compoent";
import { useFormElements } from "@/hooks/form-elements-hook";
import { useSelectedElement } from "@/hooks/selected-element-hook";
import { z } from "zod";
import { formSchema } from "@/schemas";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";

type Props = {
  fetchedForm: Form | null | undefined;
  services: Service[];
};

const FormRuleWrapper = ({ fetchedForm, services }: Props) => {
  const [activeComponent, setActiveComponent] = useState<"fields" | "rules">(
    "fields"
  );
  const { form, onSubmit,formRef,optionRef,ImagePlaceholder,file,setFile,uploadImage} = useFormElements(fetchedForm);

  const router = useRouter();
  const params = useParams<{ companySlug: string; formSlug: string }>();
  const [pending, startTransition] = useTransition();

  return (
    <div>
    { params.formSlug !== "new" &&  <div className="flex items-center justify-between ">
        <div className="flex items-center">
          <Button
            onClick={() => setActiveComponent("fields")}
            className={cn(
              "hover:bg-transparent rounded-none border-b-2 text-muted-foreground text-sm   border-transparent",
              activeComponent === "fields" && " border-black text-black"
            )}
            variant={"ghost"}
          >
            Fields
          </Button>
        
            <Button
              onClick={() => setActiveComponent("rules")}
              className={cn(
                "hover:bg-transparent rounded-none border-b-2  text-muted-foreground text-sm  border-transparent",
                activeComponent === "rules" && " border-black text-black"
              )}
              variant={"ghost"}
            >
              Rules
            </Button>
         
        </div>
     
          <Button
            onClick={() =>
              startTransition(() =>
                router.push(
                  `/${params.companySlug}/preview/${params.formSlug}`
                )
              )
            }
            disabled={pending}
            variant={"ghost"}
            className="bg-white text-second  border-second border rounded-md hover:bg-white h-[34px] hover:text-second "
          >
            View Form{" "}
            {pending && <Loader className="ml-3 animate-spin w-3 h-3" />}
          </Button>
     
      </div>}

      {/* form rules components */}
      <div className="mt-8">
        {activeComponent === "fields" ? (
          <FieldsComponent
          ImagePlaceholder={ImagePlaceholder}
          file={file}
          setFile={setFile}
          uploadImage={uploadImage}
          
            fetchedForm={fetchedForm}
            services={services}
            onSubmit={onSubmit}
            form={form}
            formRef={formRef}
            optionRef={optionRef}
          
          />
        ) : (
          <RulesComponent
            onSubmit={(values: z.infer<typeof formSchema>) => onSubmit(values)}
            form={form}
            fetchedForm={fetchedForm}
          />
        )}
      </div>
    </div>
  );
};

export default FormRuleWrapper;
