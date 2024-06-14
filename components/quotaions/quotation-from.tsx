"use client";

import { useQuotation } from "@/hooks/quotation-hook";
import { Contact, Quotation } from "@prisma/client";

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsFormWrapper from "../settings/settings-form-wrapper";
import { cn, formatWithLeadingZeros } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Percent,
  PlusIcon,
  Star,
  Trash,
  XIcon,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";

type Props = {
  quotation: Quotation | undefined | null;
  options: {
    serviceName: string;
    serviceId: string;
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    enableQuantity: boolean;
    price: number;
  }[];
  contacts: Contact[];
  quotationSettings: { id: string; nextNumber: number; prefix: string };
};

const QuotationsForm = ({
  quotation,
  contacts,
  options,
  quotationSettings,
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
  } = useQuotation({ quotation, quotationSettings });

  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="md:col-span-2 max-w-[450px] text-start">
                      <SelectValue placeholder="Please Select Contact Or Lead" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        <div className="flex flex-col">
                          <p className="capitalize ">{contact.contactName}</p>
                          <p className="text-xs text-muted-foreground">
                            {contact.emailAddress}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <div className="flex items-center gap-2 md:col-span-2  max-w-[450px]">
                    <span className="border rounded-lg h-full px-4 py-2 min-w-[50px] pointer-events-none select-none text-slate-500 bg-muted">
                      {form.watch("quotationString")}
                    </span>
                    <Input
                      className="flex-[1]"
                      placeholder="Quotation Number"
                      {...field}
                      type="number"
                      {...field}
                      value={
                        field.value
                          ? formatWithLeadingZeros(Number(field.value), 4)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          +formatWithLeadingZeros(Number(e.target.value), 4)
                        )
                      }
                    />
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
                      <TableHead className="w-[200px]">Item</TableHead>
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
                      <TableRow
                        key={lineItem.id}
                        className="w-full border-none border-t-0 relative group !h-6 p-0"
                      >
                        {/* item name */}
                        <TableCell className="font-medium w-fit items-start align-top p-2">
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
            <Button
              type="button"
              variant={"ghost"}
              className="rounded-none hover:rounded-none text-sm border-r"
            >
              <Star size={15} className="mr-2" /> Choose Option
            </Button>
            <Button
              type="button"
              variant={"ghost"}
              className="rounded-none hover:rounded-none text-sm"
            >
              <Percent size={15} className="mr-2" /> Add Discount
            </Button>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default QuotationsForm;
