"use client";

import React, { useRef, useState } from "react";

import { z } from "zod";
import { VARIABLES, quotationsSettings } from "@/schemas";
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
import {
  formatFileSize,
  formatWithLeadingZeros,
  replacePlaceholders,
} from "@/lib/utils";
import QuillEditor from "../quill-editor";
import { File, Loader, Upload, XIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../loading-button";
import { MultiFileDropzone } from "../MultiFileDropzone";

type Props = {
  quotationsSettings: z.infer<typeof quotationsSettings> | undefined | null;
};

const QuotationsSettingsForm = ({ quotationsSettings }: Props) => {
  const {
    form,
    onSubmit,
    handleSubjectInputChange,
    handleSubjectInsertText,
    setCaretSubjectPosition,
    quillRef,
   fileStates,
   setFileStates,
   updateFileProgress,

    handleBodyInsertText,
    setCaretBodyPosition,
   
 edgestore,
    progressing,
    handleFootnoteInputChange,
    handleFootnoteInsertText,
    setCaretFootnotePosition
  } = useQuotationsSettings({
    quotationsSettingsData: quotationsSettings,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[1200px] mt-8 space-y-4"
      >
        <div className="space-y-8  p-4  bg-white py-12">
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
              <div className=" flex items-center gap-4 flex-col md:flex-row w-full">
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
                          value={
                            field.value
                              ? formatWithLeadingZeros(Number(field.value), 4)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              formatWithLeadingZeros(Number(e.target.value), 4)
                            )
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 h-full self-stretch">
                  <Label>Next Issue</Label>
                  <p className="mt-4 text-muted-foreground text-sm ">
                    {replacePlaceholders(form.watch("prefix"))}
                    {formatWithLeadingZeros(form.watch("nextNumber"),4)}
                  </p>
                </div>
              </div>
              <p className="text-xs mt-2">
                Set a default number template here. Available variables:{" "}
                {VARIABLES.quotationNumber.map((variable) => (
                  <span
                    key={variable}
                    onClick={() =>
                      form.setValue(
                        "prefix",
                        `${form.getValues("prefix")}${variable}`
                      )
                    }
                    className="text-indigo-600 cursor-pointer mr-1  text-nowrap"
                  >
                    {variable}
                  </span>
                ))}
              </p>
            </div>
          </SettingsFormWrapper>
          <div className="mt-4 h-px w-full bg-gray-200 " />
          <FormField
            control={form.control}
            name="senderName"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <FormLabel>Sender Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sender Name" {...field} />
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 h-px w-full bg-gray-200 " />
          <FormField
            control={form.control}
            name="senderEmail"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <FormLabel>Sender E-mail Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Sender E-mail Address" {...field} />
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bcc"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <FormLabel>BCC</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BCC"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 h-px w-full bg-gray-200 " />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <FormLabel>Subject</FormLabel>
                  <div>
                    <FormControl>
                      <Input
                        placeholder="Subject"
                        {...field}
                        onChange={(e) => handleSubjectInputChange(e, field)}
                        onClick={(e) =>
                          setCaretSubjectPosition(
                            (e.target as HTMLInputElement).selectionStart || 0
                          )
                        }
                        onKeyUp={(e) =>
                          setCaretSubjectPosition(
                            (e.target as HTMLInputElement).selectionStart || 0
                          )
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <p className="text-xs mt-1">
                      Set a default subject here. Available Variables:
                      {VARIABLES.subject.map((variable) => (
                        <span
                          key={variable}
                          onClick={() => handleSubjectInsertText(variable)}
                          className="text-indigo-600 cursor-pointer mr-1  text-nowrap"
                        >
                          {variable}
                        </span>
                      ))}
                    </p>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 h-px w-full bg-gray-200 " />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <FormLabel>Email Content</FormLabel>
                  <div className="md:col-span-2">
                    <FormControl>
                      <QuillEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        onFocus={(range) => setCaretBodyPosition(range)}
                        ref={quillRef}
                      />
                    </FormControl>
                    <p className="text-xs mt-2">
                      Set a default message for the quotation emails here.
                      Available variables:
                      {VARIABLES.body.map((variable) => (
                        <span
                          key={`${variable}-Body`}
                          onClick={() => handleBodyInsertText(field, variable)}
                          className="text-indigo-600 cursor-pointer mr-1  text-nowrap"
                        >
                          {variable}
                        </span>
                      ))}{" "}
                    </p>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 h-px w-full bg-gray-200 " />
          <FormField
            control={form.control}
            name="attatchments"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <div className="flex flex-col gap-1">
                    <FormLabel>Attachments</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      Add your attachments here
                    </span>
                  </div>
                
                </SettingsFormWrapper>

<div>
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, 'COMPLETE');
                    }
                  },
                });
                console.log(res);
                form.setValue('attatchments',[...form.watch('attatchments'),res.url])
              } catch (err) {
                updateFileProgress(addedFileState.key, 'ERROR');
              }
            }),
          );
        }}
      />

</div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 h-px w-full bg-gray-200 " />
          <FormField
            control={form.control}
            name="footNote"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <FormLabel>Footnote</FormLabel>
                  <div className="md:col-span-2">
                    <FormControl>
                      <Textarea
                        className="resize-none w-full min-h-[200px]"
                        placeholder="Footnote"
                        {...field}
                        onChange={(e) => handleFootnoteInputChange(e, field)}
                        onClick={(e) =>
                          setCaretFootnotePosition(
                            (e.target as HTMLInputElement).selectionStart || 0
                          )
                        }
                        onKeyUp={(e) =>
                          setCaretFootnotePosition(
                            (e.target as HTMLInputElement).selectionStart || 0
                          )
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <p className="text-xs mt-2">
                      Here you set a default footnote for the quote. available
                      variables:
                      {VARIABLES.footnote.map((variable) => (
                        <span
                          key={`${variable}-footnote`}
                          onClick={() => handleFootnoteInsertText(variable)}
                          className="text-indigo-600 cursor-pointer mr-1 "
                        >
                          {variable}
                        </span>
                      ))}
                    </p>
                  </div>
                </SettingsFormWrapper>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton className='ml-auto  flex bg-second hover:bg-second/90 py-2 px-6 h-fit' title={"Save"} isLoading={form.formState.isSubmitting} />
        {JSON.stringify(form.formState.errors)}
      </form>
    </Form>
  );
};

export default QuotationsSettingsForm;
