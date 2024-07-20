"use client";

import { useLead } from "@/hooks/lead-form-hook";
import { Contact, ContactPerson } from "@prisma/client";

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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import FormItemWrapper from "../forms/form-item-wrapper";
import SettingsFormWrapper from "../settings/settings-form-wrapper";
import { Label } from "../ui/label";
import LoadingButton from "../loading-button";
import { useContact } from "@/hooks/contact-form-hook";

import { v4 as uuidv4 } from "uuid";
import SectionsWrapper from "../sections-wrapper";

type Props = {
  contact: (Contact & { contactPersons: ContactPerson[] }) | null;
};

const ContactForm = ({ contact }: Props) => {
  const { form, onSubmit, handleAddContactPerson, handleDeleteContactPerson } =
    useContact({ contact });
  const isLoading = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="contactType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <SettingsFormWrapper>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-12"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 ">
                      <FormControl>
                        <RadioGroupItem
                          className="cursor-pointer"
                          value="INDIVIDUAL"
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Individual
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 ">
                      <FormControl>
                        <RadioGroupItem
                          className="cursor-pointer"
                          value="BUSINESS"
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Business
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </SettingsFormWrapper>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Name</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Contact Name" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("contactType") === "BUSINESS" && (
          <div className="my-1">
            <div className="h-px w-full bg-gray-200 my-1" />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <SettingsFormWrapper>
                    <FormLabel>Company name</FormLabel>
                    <FormControl className="md:col-span-2 max-w-[450px]">
                      <div>
                        <Input placeholder="Company name" {...field} />
                        <Button
                          type="button"
                          onClick={handleAddContactPerson}
                          className="p-0 mt-6 h-0 ml-auto flex"
                          variant={"link"}
                        >
                          + Add Contact Person
                        </Button>
                      </div>
                    </FormControl>
                  </SettingsFormWrapper>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {form.watch("contactPersons")?.map((person, index) => (
              <article key={person.id || uuidv4()}>
                <SettingsFormWrapper>
                  <Label>Contact Person {index + 1}</Label>

                  <div>
                    <FormField
                      control={form.control}
                      name={`contactPersons.${index}.contactName`}
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Name</FormLabel>
                          <FormControl className="">
                            <Input placeholder="Name" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contactPersons.${index}.emailAddress`}
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl className="m">
                            <Input placeholder="Email" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contactPersons.${index}.phoneNumber`}
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Phone</FormLabel>
                          <FormControl className="m">
                            <Input
                              type="number"
                              placeholder="Phone"
                              {...field}
                              value={field.value || undefined}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type={"button"}
                      onClick={() => handleDeleteContactPerson(person?.id!)}
                      variant={"link"}
                      className="p-0 mt-6 h-0  flex text-rose-600"
                    >
                      - Delete
                    </Button>
                  </div>
                </SettingsFormWrapper>
                {index + 1 !== form.watch("contactPersons")?.length && (
                  <div className="h-px w-full bg-gray-200 my-6" />
                )}
              </article>
            ))}
          </div>
        )}
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Email Address</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Email Address" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Phone Number</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input type="number" placeholder="Phone Number" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel className="text-sm  ">Mobile Number</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input type="number" placeholder="Mobile Number" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1 " />
        <SettingsFormWrapper>
          <Label>Address</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:col-span-2 max-w-[450px]">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Zipcode
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Zipcode" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SettingsFormWrapper>

  {  form.watch('contactType')==="BUSINESS" && <><div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="cocNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>Chumber of commerce</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="Chumber of commerce" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>VAT Number</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="VAT Number" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-px w-full bg-gray-200 my-1" />
        <FormField
          control={form.control}
          name="IBAN"
          render={({ field }) => (
            <FormItem>
              <SettingsFormWrapper>
                <FormLabel>IBAN</FormLabel>
                <FormControl className="md:col-span-2 max-w-[450px]">
                  <Input placeholder="IBAN" {...field} />
                </FormControl>
              </SettingsFormWrapper>
              <FormMessage />
            </FormItem>
          )}
        />
        </>
        }
        <LoadingButton
          className="ml-auto  flex bg-second hover:bg-second/90"
          isLoading={isLoading}
          title={contact ? "Update" : "Create"}
        />
      </form>
    </Form>
  );
};

export default ContactForm;
