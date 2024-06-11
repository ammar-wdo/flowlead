import { companySchema, invoicesSettings, quotationsSettings } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLogo } from "./logo-hook";
import { addCompany, editCompany } from "@/actions/company-actions";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "./modal-hook";
import { Company } from "@prisma/client";
import React, { useRef, useState } from "react";
import Quill from "quill";
import { useEdgeStore } from "@/lib/edgestore";

import { FileState } from "@/components/MultiFileDropzone";
import { saveInvoicesSettings } from "@/actions/invoicesSettings-actions";

export const useInvoicesSettings = ({
  invoicesSettingsData,
}: {
  invoicesSettingsData: z.infer<typeof invoicesSettings> | undefined | null;
}) => {
  const form = useForm<z.infer<typeof invoicesSettings>>({
    resolver: zodResolver(invoicesSettings),
    defaultValues: {
      attatchments: invoicesSettingsData?.attatchments || [],
      bcc: invoicesSettingsData?.bcc || "",
      body: invoicesSettingsData?.body || "",
      dueDays: invoicesSettingsData?.dueDays || 14,
      footNote: invoicesSettingsData?.footNote || "",
      nextNumber: invoicesSettingsData?.nextNumber || 1,
      prefix: invoicesSettingsData?.prefix || "",
      senderEmail: invoicesSettingsData?.senderEmail || "",
      senderName: invoicesSettingsData?.senderName || "",
      subject: invoicesSettingsData?.subject || "",
    },
  });
  //subject variables
  const [caretSubjectPosition, setCaretSubjectPosition] = useState(0);
  const handleSubjectInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    setCaretSubjectPosition(e.target.selectionStart || 0);
    field.onChange(e.target.value);
  };

  const handleSubjectInsertText = (text: string) => {
    const currentValue = form.getValues("subject") || "";
    const newValue = insertTextAtPosition(
      currentValue,
      text,
      caretSubjectPosition
    );
    form.setValue("subject", newValue);
  };

  //footnote variables
  const [caretFootnotePosition, setCaretFootnotePosition] = useState(0);
  const handleFootnoteInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: any
  ) => {
    setCaretFootnotePosition(e.target.selectionStart || 0);
    field.onChange(e.target.value);
  };

  const handleFootnoteInsertText = (text: string) => {
    const currentValue = form.getValues("footNote") || "";
    const newValue = insertTextAtPosition(
      currentValue,
      text,
      caretFootnotePosition
    );
    form.setValue("footNote", newValue);
  };

  const insertTextAtPosition = (
    input: string,
    text: string,
    position: number
  ) => {
    return input.slice(0, position) + text + input.slice(position);
  };

  //body variables
  const [caretBodyPosition, setCaretBodyPosition] = useState<{
    index: number;
    length: number;
  } | null>(null);
  const handleBodyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    setCaretBodyPosition({
      index: e.target.selectionStart || 0,
      length: e.target.selectionEnd || 0,
    });
    field.onChange(e.target.value);
  };

  const quillRef = useRef<Quill | null>(null);

  const handleBodyInsertText = (field: any, text: string) => {
    const quill = quillRef.current;
    if (quill) {
      quill.focus();
      const range = quill.getSelection();

      if (range) {
        quill.insertText(range.index, text);
        quill.setSelection(range.index + text.length);
        field.onChange(quill.root.innerHTML); // Update the form value
      }
    }
  };

  //file upload
  const [file, setFile] = React.useState<File>();
  const [progressing, setProgressing] = useState(false);
  const [deleting, setDeleting] = useState("");
  const { edgestore } = useEdgeStore();



  const [fileStates, setFileStates] = useState<FileState[]>([]);

  function updateFileProgress(key: string, progress: FileState['progress'],url:string) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
        fileState.url =url
      }
      return newFileStates;
    });
  }


  const deleteFile = async (url: string | undefined | null) => {
    if(!url )return
    try {
      setDeleting(url);
      await edgestore.publicFiles.delete({
        url,
      });
      setFileStates(prev=>prev.filter(el=>el.url !==url))
    } catch (error) {
      console.log(error);
    
    } finally {
      setFile(undefined);
      form.setValue("attatchments", form.watch('attatchments')?.filter(el=>el?.url !== url));
      setDeleting("");
    }
  };
  // const deleteFile = async (url: string) => {
  //   try {
  //     setDeleting(url);
  //     await edgestore.publicFiles.delete({
  //       url,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setFile(undefined);
  //     form.setValue("attatchments", []);
  //     setDeleting("");
  //   }
  // };



  const router = useRouter();
  const params = useParams<{companySlug:string}>()
  const { setClose } = useModal();
  async function onSubmit(values: z.infer<typeof invoicesSettings>) {
    try {
       
  
       const  res = await saveInvoicesSettings(values,params.companySlug)
    
        if (!res.success) return toast.error(res.error)
        toast.success(res.message)
      router.refresh()
    
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return {
    form,
    onSubmit,
    handleSubjectInputChange,
    handleSubjectInsertText,
    setCaretSubjectPosition,
    setCaretBodyPosition,
    handleBodyInputChange,
    handleBodyInsertText,
    quillRef,
    setFile,
    file,
    setDeleting,
    progressing,
   fileStates,
   setFileStates,
   updateFileProgress,
   edgestore,
    deleting,
    deleteFile,
    handleFootnoteInputChange,
    handleFootnoteInsertText,
    setCaretFootnotePosition
  };
};
