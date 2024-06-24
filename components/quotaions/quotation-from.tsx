"use client";

import { useQuotation } from "@/hooks/quotation-hook";
import { Contact, DiscountType, Quotation } from "@prisma/client";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SettingsFormWrapper from "../settings/settings-form-wrapper";
import {
  cn,
  formatFileSize,
  formatWithLeadingZeros,
  replacePlaceholders,
} from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import {
  Building,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Euro,
  FileIcon,
  Loader,
  MagnetIcon,
  Percent,
  PercentCircle,
  PlusIcon,
  Star,
  Trash,
  User,
  XIcon,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { VARIABLES } from "@/schemas";
import { MultiFileDropzone } from "../MultiFileDropzone";

import { v4 as uuidv4 } from "uuid";
import LoadingButton from "../loading-button";
import { RefactoredContacts } from "@/app/(dashboard)/dashboard/[companySlug]/quotations/[quotationId]/page";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { CommandList } from "cmdk";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";

type Props = {
  quotation: Quotation | undefined | null;
  options: {
    id: string;
    name: string;
    taxPercentage: number
    options: {
      id: string;
      name: string;
      description: string | null;
      image: string | null;
      enableQuantity: boolean;
      price: number;
    }[];
  }[];
  contacts: Contact[];
  quotationSettings: { id: string; nextNumber: number; prefix: string };
  refactoredContacts: RefactoredContacts;
};

const QuotationsForm = ({
  quotation,
  contacts,
  options,
  quotationSettings,
  refactoredContacts,
}: Props) => {
  const {
    form,
    onSubmit,
    openQuotDate,
    setOpenQuotDate,
    openExpiryQuotDate,
    setOpenExpiryQuotDate,
    calculate,
    addLineItem,
    deleteLineItem,
    handleFootnoteInsertText,
    handleFootnoteInputChange,
    setCaretFootnotePosition,
    deleteFile,
    deleting,
    edgestore,
    file,
    fileStates,
    progressing,
    setDeleting,
    setFile,
    setFileStates,
    updateFileProgress,
    contactOpen,
    setContactOpen,
    handleDeleteDiscount,
    handleSetDiscount,
    discountValue,
    subTotalWithDiscount,
    total,
  } = useQuotation({ quotation, quotationSettings });

  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  console.log(refactoredContacts);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[1100px] bg-white p-8"
      >
        <FormField
          control={form.control}
          name="contactId"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Contact</FormLabel>
                <Popover open={contactOpen} onOpenChange={setContactOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between capitalize",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {form.watch("contactPersonId")
                          ? `${
                              refactoredContacts.find((contact) => {
                                if (!("contactPerson" in contact)) return;
                                else {
                                  return (
                                    contact.companyId === field.value &&
                                    contact.contactPersonId ===
                                      form.watch("contactPersonId")
                                  );
                                }
                              })?.contactName
                            } - ${
                              (refactoredContacts.find((contact) => {
                                if (!("contactPerson" in contact)) return;
                                else {
                                  return (
                                    contact.companyId === field.value &&
                                    contact.contactPersonId ===
                                      form.watch("contactPersonId")
                                  );
                                }
                              }) as {
                                contactPersonId: string;
                                companyId: string;
                                contactName: string;
                                emailAddress: string;
                                phoneNumber: string | null;
                                companyName: string;
                                contactPerson: boolean;
                              })?.companyName
                            }`
                          : field.value
                          ? refactoredContacts.find(
                              (contact) => contact.companyId === field.value
                            )?.contactName
                          : "Select Contact"}
                        {}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search Contact..." />
                      <CommandEmpty>No result found</CommandEmpty>
                      <ScrollArea className="h-[300px] w-full">
                        <CommandGroup>
                          <CommandList>
                            {refactoredContacts.map((contact, index) => (
                              <CommandItem
                                className=" cursor-pointer"
                                value={
                                  "contactPerson" in contact
                                    ? contact.contactName +
                                      contact.emailAddress +
                                      contact.companyName
                                    : contact.contactName + contact.emailAddress
                                }
                                key={contact.companyId}
                                onSelect={() => {
                                  form.setValue("contactId", contact.companyId);
                                  setContactOpen(false);
                                  if ("contactPerson" in contact) {
                                    form.setValue(
                                      "contactPersonId",
                                      contact.contactPersonId
                                    );
                                  } else {
                                    form.setValue("contactPersonId", '');
                                  }
                                }}
                              >
                                {/* render check only besides contact person id if we had any ,or besides company id  */}
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    (!form.watch("contactPersonId") &&
                                      contact.companyId === field.value &&
                                      !("contactPerson" in contact)) ||
                                      ("contactPerson" in contact &&
                                        form.watch("contactPersonId") ===
                                          contact.contactPersonId)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />

                                <div className="p-3">
                                  {"contactPerson" in contact ? (
                                    <div className="flex items-center gap-5 ">
                                      <span>
                                        <User />
                                      </span>
                                      <div>
                                        <p className="capitalize">
                                          {contact.companyName} -{" "}
                                          {contact.contactName}
                                        </p>
                                        <p className="text-muted-foreground text-xs ">
                                          {contact.emailAddress}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-5 ">
                                      <span>
                                        {contact.contactType ===
                                        "INDIVIDUAL" ? (
                                          <MagnetIcon />
                                        ) : (
                                          <Building />
                                        )}
                                      </span>
                                      <div>
                                        <p className="capitalize">
                                          {contact.contactName}
                                        </p>
                                        <p className="text-muted-foreground text-xs ">
                                          {contact.emailAddress}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px bg-gray-200" />
        <FormField
          control={form.control}
          name="quotationNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Quotation Number</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4 md:col-span-2  max-w-[450px]">
                    <span className="border rounded-lg h-full px-4 py-2 min-w-[50px] pointer-events-none select-none text-slate-500 bg-muted text-sm">
                      {replacePlaceholders(form.watch("quotationString"))}
                    </span>
                    <Input
                      className="flex-[1]"
                      placeholder="Quotation Number"
                      {...field}
                      type="number"
                      value={
                        field.value
                          ? formatWithLeadingZeros(Number(field.value), 4)
                          : formatWithLeadingZeros(1, 4)
                      }
                      onChange={(e) =>
                        field.onChange(
                          +formatWithLeadingZeros(
                            Number(
                              !!(+e.target.value === 0) ? 1 : +e.target.value
                            ),
                            4
                          )
                        )
                      }
                    />
                    <span className="text-gray-500 text-sm">
                      {replacePlaceholders(form.watch("quotationString"))}
                      {formatWithLeadingZeros(Number(field.value || 1), 4)}
                    </span>
                  </div>
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-px bg-gray-200" />
        <FormField
          control={form.control}
          name="quotationDate"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Quotation Date</FormLabel>
                <FormControl>
                  <Popover open={openQuotDate} onOpenChange={setOpenQuotDate}>
                    <PopoverTrigger
                      asChild
                      className="md:col-span-2 max-w-[450px]"
                    >
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenQuotDate(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-px bg-gray-200" />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Popover
                    open={openExpiryQuotDate}
                    onOpenChange={setOpenExpiryQuotDate}
                  >
                    <PopoverTrigger
                      asChild
                      className="md:col-span-2 max-w-[450px]"
                    >
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenExpiryQuotDate(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px bg-gray-200" />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    className="md:col-span-2 max-w-[450px]"
                    placeholder="Subject"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* line items */}
        <div className="h-px bg-gray-200" />
        <FormField
          control={form.control}
          name="lineItems"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Tax Percentage</TableHead>
                      <TableHead className="">Total Price</TableHead>
                      {!!(form.watch("lineItems").length > 1) && (
                        <TableHead className="">Delete</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* body-content */}
                    {form.watch("lineItems").map((lineItem, index) => (
                      <OptionTableRow
                        key={lineItem.id}
                        calculate={calculate}
                        deleteLineItem={deleteLineItem}
                        form={form}
                        index={index}
                        lineItem={lineItem}
                      />
                    ))}
                  </TableBody>
                </Table>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end ">
          <div className="rounded-lg overflow-hidden flex items-center border">
            <Button
              type="button"
              onClick={addLineItem}
              variant={"ghost"}
              className="rounded-none hover:rounded-none text-sm border-r"
            >
              <PlusIcon size={15} className="mr-2" /> Add Item
            </Button>
            <OptionsModal  options={options} selectOptions={(options)=>{

              const lineItems = form.watch('lineItems')
              form.setValue('lineItems',[...lineItems,...options])
            }}/>
            <DiscountDropdownMenue
              className="rounded-none hover:rounded-none text-sm"
              discountType={form.watch("discount.type")}
              setDiscountType={(value) =>
                handleSetDiscount(value as DiscountType)
              }
            />
          </div>
        </div>

        {!!form.watch("discount") && (
          <div className="mt-12 flex items-start gap-3 w-full group">
            {form.watch("discount.type") === "PERCENTAGE" ? (
              <FormField
                control={form.control}
                name="discount.percentageValue"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className={cn("flex  ")}>
                        <Input
                          type="number"
                          className=" rounded-r-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                          placeholder="Percent value discount"
                          {...field}
                          value={form.watch("discount.percentageValue")}
                          onChange={(e) =>
                            form.setValue(
                              "discount.percentageValue",
                              +e.target.value
                            )
                          }
                        />
                        <span className="flex items-center bg-muted text-sm px-2 rounded-r-lg border-r border-y">
                          <Percent size={14} className="mr-3" /> Discount
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="discount.fixedValue"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className={cn("flex  ")}>
                        <Input
                          type="number"
                          className=" rounded-r-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                          placeholder="Fixed value discount"
                          {...field}
                          value={form.watch("discount.fixedValue")}
                          onChange={(e) =>
                            form.setValue(
                              "discount.fixedValue",
                              +e.target.value
                            )
                          }
                        />
                        <span className="flex items-center bg-muted text-sm px-2 rounded-r-lg border-r border-y">
                          <Euro size={14} className="mr-3" /> Discount
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="discount.description"
              render={({ field }) => (
                <FormItem className="flex-[2]">
                  <FormControl>
                    <Input
                      className=""
                      placeholder="Description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onClick={handleDeleteDiscount}
              type="button"
              variant={"ghost"}
              className="text-gray-400 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash size={17} />
            </Button>
          </div>
        )}
        <div className="h-px bg-gray-200" />
        {/* Show discount section  */}
        <div className="flex ml-auto max-w-[300px] flex-col space-y-2">
          {/* discount */}
          {!!form.watch("discount") && (
            <ShowValueElement
              title="Discount"
              value={discountValue}
              minus={true}
            />
          )}
          {/* subtotal */}
          <ShowValueElement title="Subtotal" value={subTotalWithDiscount} />

          {/* lineitemes vat */}
          {form.watch("lineItems").map((el, index) => (
            <ShowValueElement
              key={`vat - ${index}`}
              title={`${el.taxPercentage}% VAT`}
              value={(el.taxPercentage * el.price * el.quantity) / 100}
            />
          ))}
          {/* total amount */}
          <ShowValueElement title={"Total"} value={total} />
        </div>

        <div className="h-px bg-gray-200" />
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
                            updateFileProgress(addedFileState.key, "ERROR", "");
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
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Footnote</FormLabel>
                <FormControl>
                  <div className="md:col-span-2  max-w-[450px]">
                    <div className="flex items-center gap-4 ">
                      <Textarea
                        className="flex-[1] min-h-[200px] resize-none"
                        placeholder="Footenote"
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
                    </div>
                    <p className="text-xs mt-2 text-nowrap">
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
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          className="ml-auto  flex bg-second hover:bg-second/90"
          title={!quotation ? "Submit" : "Update"}
          isLoading={form.formState.isSubmitting}
        />
        {JSON.stringify(form.formState.errors)}
      </form>
    </Form>
  );
};

export default QuotationsForm;

const OptionTableRow = ({
  lineItem,
  form,
  index,
  calculate,
  deleteLineItem,
}: {
  lineItem: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    taxPercentage: number;
    totalPrice: number;
    taxAmount: number;
    description?: string | null | undefined;
  };
  form: any;
  index: number;
  calculate: (index: number) => void;
  deleteLineItem: (id: string) => void;
}) => {
  const [shwoDescription, setShowDescription] = useState(
    !!form.watch(`lineItems.${index}.description`) ? true : false
  );
  return (
    <TableRow
      key={lineItem.id}
      className="w-full border-none border-t-0 relative group !h-6 p-0"
    >
      {/* item name */}
      <TableCell className="font-medium w-fit items-start align-top p-2 ">
        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name={`lineItems.${index}.name`}
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Input
                    className=""
                    placeholder="Item"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {shwoDescription && (
            <FormField
              control={form.control}
              name={`lineItems.${index}.description`}
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Item description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            type="button"
            className={cn(
              "text-xs px-0 w-fit py-1 self-end h-fit hover:no-underline ",
              shwoDescription ? "text-rose-600" : "text-indigo-600"
            )}
            onClick={() => {
              form.setValue(`lineItems.${index}.description`, "");
              setShowDescription((prev) => !prev);
            }}
            variant={"link"}
          >
            {shwoDescription ? "- Delete description" : "+ Add description"}
          </Button>
        </div>
      </TableCell>
      {/* item quantity */}
      <TableCell className="font-medium w-fit align-top p-2">
        <FormField
          control={form.control}
          name={`lineItems.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  className=""
                  placeholder="price"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    calculate(index);
                  }}
                  min={0}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      {/* itam price */}
      <TableCell className="font-medium w-fit align-top p-2">
        <FormField
          control={form.control}
          name={`lineItems.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center relative">
                  <span className="absolute left-4 text-gray-400 text-xs">
                    €
                  </span>
                  <Input
                    type="number"
                    className="pl-8"
                    placeholder="price"
                    {...field}
                    min={0}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      calculate(index);
                    }}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      {/* tax percentage */}
      <TableCell className="font-medium w-fit align-top p-2">
        <FormField
          control={form.control}
          name={`lineItems.${index}.taxPercentage`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  className=""
                  placeholder="taxPercentage"
                  {...field}
                  min={0}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    calculate(index);
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      {/* total price */}
      <TableCell className="font-medium w-fit align-top p-2">
        <FormField
          control={form.control}
          name={`lineItems.${index}.totalPrice`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center relative">
                  <span className="absolute left-4 text-gray-400 text-xs">
                    €
                  </span>
                  <Input
                    readOnly
                    type="number"
                    className="pl-8 pointer-events-none"
                    placeholder="price"
                    {...field}
                  />
                </div>
              </FormControl>
              <div> </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      {/* delete button */}
      {!!(form.watch("lineItems").length > 1) && (
        <TableCell className="font-medium w-fit align-top p-2">
          <Button
            type="button"
            onClick={() => deleteLineItem(lineItem.id)}
            variant={"ghost"}
            size={"icon"}
            className=""
          >
            <Trash size={14} />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

const DiscountDropdownMenue = ({
  discountType,
  setDiscountType,
  className,
}: {
  discountType: "FIXED" | "PERCENTAGE";
  setDiscountType: (value: string) => void;
  className: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className={className}>
          <Percent size={15} className="mr-2" /> Add Discount
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={discountType}
          onValueChange={setDiscountType}
        >
          <DropdownMenuRadioItem className="cursor-pointer" value="FIXED">
            <Euro size={15} className="mr-2" /> Fixed Amount
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="cursor-pointer" value="PERCENTAGE">
            <Percent size={15} className="mr-2" /> Percentage
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ShowValueElement = ({
  title,
  value,
  minus,
}: {
  title: string;
  value: number;
  minus?: boolean;
}) => {
  return (
    <article className="flex items-center justify-between text-sm ">
      <span className="flex items-center gap-3 font-semibold">{title}</span>
      <span>
        {minus && "- "}€ {value}
      </span>
    </article>
  );
};


type LineItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  taxPercentage: number;
  totalPrice: number;
  taxAmount: number;
  description?: string | null | undefined;
}
const OptionsModal = ({
  options,
  selectOptions
}: {
  options: {
    id: string;
    name: string;
    taxPercentage: number
    options: {
      id: string;
      name: string;
      description: string | null;
      image: string | null;
      enableQuantity: boolean;
      price: number;
    }[];
  }[]
  ,
  selectOptions:(options:LineItem[])=>void
}) => {

  const [optionsItems, setOptionsItems] = useState<LineItem[]>([])
 
  return (
    <Dialog >
      <DialogTrigger>
        {" "}
        <Button
          type="button"
          variant={"ghost"}
          className="rounded-none hover:rounded-none text-sm border-r"
        >
          <Star size={15} className="mr-2" /> Choose Option
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>Choose Options</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div>
{options.map(service=><article key={service.id}>

  <h4 className="font-semibold">{service.name}</h4>
  <div className="mt-2 space-y-1">
    
    
    <div className="grid grid-cols-4 gap-3 font-semibold">

    <span>Name</span>
    <span>Price</span>
    <span className="flex-shrink-0 text-nowrap">Tax Percentage</span>
    </div>

    {service.options.map(option=><div key={option.id} className="grid grid-cols-4 gap-3 text-slate-600 items-center">
      <div className="flex items-center gap-1">
      <Checkbox id={option.id}  checked={optionsItems.some(item=>item.id===option.id)} onCheckedChange={()=>{
if(optionsItems.some(item=>item.id===option.id)) return setOptionsItems(prev=>prev.filter(el=>el.id !==option.id))
  else return setOptionsItems(prev=>[...prev,{name:option.name,price:option.price,quantity:1,taxPercentage:service.taxPercentage,description:option.description,totalPrice:option.price,taxAmount:option.price * service.taxPercentage /100,id:option.id}])

      }}/>
      <label
        htmlFor={option.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
       {option.name}
      </label>
      </div>
  
      <span>€ {option.price}</span>
      <span>{service.taxPercentage}</span>

    </div>)}
  </div>
</article>)}
        </div>
        <DialogClose>

       
        <Button className="bg-second hover:bg-second/80 text-white"
        onClick={()=>{
const modifiedLineItmes = optionsItems.map(item=>({...item,id:uuidv4()}))
selectOptions(modifiedLineItmes)
setOptionsItems([])

        }}
        >Save</Button>
         </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
