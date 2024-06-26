"use client";

import React, { useRef, useState, useTransition } from "react";

import { z } from "zod";
import {
  VARIABLES,
  VARIABLES_INVOICES,
  invoicesSettings,
  quotationsSettings,
} from "@/schemas";
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
import { File, FileIcon, Loader, Upload, XIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../loading-button";
import { MultiFileDropzone } from "../MultiFileDropzone";
import { v4 as uuidv4 } from "uuid";
import { useInvoicesSettings } from "@/hooks/invoces-settings-hook";

type Props = {
  invoicesSettings: z.infer<typeof invoicesSettings> | undefined | null;
  companyEmail: string;
  companyName: string;
};

const InvoicesSettingsForm = ({
  invoicesSettings,
  companyEmail,
  companyName,
}: Props) => {
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
    deleting,
    deleteFile,
    setDeleting,
    edgestore,
    progressing,
    handleFootnoteInputChange,
    handleFootnoteInsertText,
    setCaretFootnotePosition,
  } = useInvoicesSettings({
    invoicesSettingsData: invoicesSettings,
    companyEmail,
    companyName,
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
                  <FormLabel>Valid Period of invoice (days)</FormLabel>
                  <FormControl>
                    <Input
                      className="md:col-span-2 max-w-[550px]"
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
            <Label>Invoice Number Template</Label>
            <div className="sm:col-span-2 gap-1">
              <div className=" flex items-center gap-4 flex-col md:flex-row  md:col-span-2 max-w-[550px]">
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
                    {formatWithLeadingZeros(form.watch("nextNumber"), 4)}
                  </p>
                </div>
              </div>
              <p className="text-xs mt-2">
                Set a default number template here. Available variables:{" "}
                {VARIABLES_INVOICES.quotationNumber.map((variable) => (
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
                    <Input
                      placeholder="Sender Name"
                      className="md:col-span-2 max-w-[550px]"
                      {...field}
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
            name="senderEmail"
            render={({ field }) => (
              <FormItem className="flex-[2]">
                <SettingsFormWrapper>
                  <FormLabel>Sender E-mail Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sender E-mail Address"
                      className="md:col-span-2 max-w-[550px]"
                      {...field}
                    />
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
                    className="md:col-span-2 max-w-[550px]"
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
                  <div    className="md:col-span-2 max-w-[550px]">
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
                      {VARIABLES_INVOICES.subject.map((variable) => (
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
                  <div className="md:col-span-2 max-w-[550px]">
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
                      {VARIABLES_INVOICES.body.map((variable) => (
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
                  <div className="flex flex-col gap-1 ">
                    <FormLabel>Attachments</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      Add your attachments here
                    </span>
                  </div>

                  <div className="md:col-span-2 max-w-[550px]">
                    {!!form.watch("attatchments")?.length && (
                      <div className="space-y-3 mb-4">
                        {form.watch("attatchments")?.map((file) => {
                          return (
                            <article
                              key={uuidv4()}
                              className="border p-3 rounded-lg flex items-start gap-3 relative overflow-hidden"
                            >
                              {!!deleting && deleting === file?.url && (
                                <div className=" gap-1 text-xs  w-full h-full absolute top-0 left-0 bg-black/80 text-white z-10 flex items-center justify-center">
                                  Deleteing...{" "}
                                  <Loader
                                    size={16}
                                    className="animate-spin ml-2"
                                  />
                                </div>
                              )}
                              {!deleting && (
                                <XIcon
                                  onClick={async () =>
                                    await deleteFile(file?.url)
                                  }
                                  className="absolute top-0.5 right-0.5 cursor-pointer "
                                  size={14}
                                />
                              )}
                              <span className="w-12 h-12 flex items-center justify-center bg-second/10 rounded-full shrink-0">
                                <FileIcon className="text-second" />
                              </span>
                              <div className="text-xs text-muted-foreground">
                                <p>{file?.name}</p>
                                <p>{file?.type}</p>
                                <p>{file?.size}</p>
                                {file?.url && (
                                  <a
                                    href={file?.url}
                                    target="_blank"
                                    download
                                    className="text-indigo-500 hover:underline"
                                  >
                                    Download
                                  </a>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                    <MultiFileDropzone
                      deleting={deleting}
                      setDeleting={async (url: string) => {
                        await deleteFile(url);
                      }}
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
                                  updateFileProgress(
                                    addedFileState.key,
                                    progress,
                                    ""
                                  );
                                  if (progress === 100) {
                                    // wait 1 second to set it to complete
                                    // so that the user can see the progress bar at 100%
                                    await new Promise((resolve) =>
                                      setTimeout(resolve, 1000)
                                    );
                                    updateFileProgress(
                                      addedFileState.key,
                                      "COMPLETE",
                                      res.url
                                    );
                                  }
                                },
                              });
                              console.log(res);

                              form.setValue("attatchments", [
                                ...(form.watch("attatchments") || []),
                                {
                                  size: formatFileSize(res.size),
                                  url: res.url,
                                  name: addedFileState.file.name,
                                  type: addedFileState.file.type,
                                },
                              ]);
                            } catch (err) {
                              updateFileProgress(
                                addedFileState.key,
                                "ERROR",
                                ""
                              );
                            }
                          })
                        );
                      }}
                    />
                  </div>
                </SettingsFormWrapper>

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
                  <div className="-2 md:col-span-2 max-w-[550px]">
                    <FormControl>
                      <Textarea
                        className="resize-none w-full min-h-[200px] "
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
                    <p className="text-xs mt-2 text-nowrap">
                      Here you set a default footnote for the quote. available
                      variables:
                      {VARIABLES_INVOICES.footnote.map((variable) => (
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

        <LoadingButton
          className="ml-auto  flex bg-second hover:bg-second/90 py-2 px-6 h-fit"
          title={"Save"}
          isLoading={form.formState.isSubmitting}
        />
        {JSON.stringify(form.formState.errors)}
      </form>
    </Form>
  );
};

export default InvoicesSettingsForm;
