"use client";

import { useDashboard } from "@/hooks/dashboard-component-hook";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { nl } from 'date-fns/locale'

type Props = {};

const sectionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

const DashboardComponent = (props: Props) => {
  const { STEPS, setStep, step, companySlug,hide,setHide } = useDashboard();
  return  <div><AnimatePresence mode="wait">

{!hide ?   <motion.div 
  variants={sectionVariants}
  initial="initial"
  animate="animate"
  exit={'exit'}
key={'steps-article'} className="grid grid-cols-3 gap-4 p-12 bg-white border overflow-x-scroll noScroll relative">
  <button onClick={()=>setHide(true)} className="absolute text-sm top-6 right-6 text-gray-400 ">Hide</button>
      {/* Left */}
      <div className="col-span-1 flex flex-col   border-r pr-2 gap-3">
        {STEPS.map((el, i) => (
          <span
          key={el}
            onClick={() => setStep(el)}
            className={cn(
              "flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition relative z-20",
              step === el && "bg-muted"
            )}
          >
            <span
              className={cn(
                "w-8 h-8 bg-white flex relative items-center justify-center text-xs rounded-full border transition",
                step === el && "border-second text-second "
              )}
            >
              {i + 1}
              {!!(i !== STEPS.length - 1) && (
                <span className="absolute -bottom-[100%] w-px h-full bg-gray-200 z-10" />
              )}
            </span>
            <span className={cn("first-letter:capitalize text-muted-foreground text-sm",el===step && 'text-prime font-semibold')}>{el}</span>
          </span>
        ))}
      </div>
      {/* Right */}
      <div className="w-full flex items-center justify-center col-span-2">
        <AnimatePresence mode="wait" onExitComplete={()=>{} }>
        {step === "Edit company details" && (
          <motion.div
          key={'1-step'}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit={'exit'}
          >
            <EditCompany
              companySlug={companySlug}
              nextStep={() => setStep("add a service")}
            />
          </motion.div>
        )}
        {step === "add a service" && (
          <motion.div
          key={'2-step'}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit={'exit'}
          >
            <AddService
              companySlug={companySlug}
              nextStep={() => setStep("add a form")}
            />
          </motion.div>
        )}
        {step === "add a form" && (
          <motion.div
          key={'3-step'}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit={'exit'}
          >
            {" "}
            <AddForm
              companySlug={companySlug}
              nextStep={() => setStep("create a contact")}
            />
          </motion.div>
        )}
        {step === "create a contact" && (
          <motion.div
          key={'4-step'}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit={'exit'}
          >
            <AddContact
              companySlug={companySlug}
              nextStep={() => setStep("create a quotation")}
            />
          </motion.div>
        )}
        {step === "create a quotation" && (
          <motion.div
          key={'5-step'}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit={'exit'}
          >
            <AddQuotation nextStep={()=>setStep('create an invoice')} companySlug={companySlug} />
          </motion.div>
        )}
          {step === "create an invoice" && (
          <motion.div
          key={'6-step'}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit={'exit'}
          >
            <AddInvoice nextStep={()=>setHide(true)} companySlug={companySlug} />
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div> : 
    <motion.div 
    variants={sectionVariants}
    initial="initial"
    animate="animate"
    exit={'exit'}
    key={'show-article'} className="   flex items-center gap-2"> 
      Let&apos;s get you set up with Flowlead.  <button onClick={()=>setHide(false)} className="text-indigo-500 flex items-center font-semibold">Get Started{<ChevronRight size={20} className="ml-1"/>}</button>
    </motion.div>
    }
  </AnimatePresence></div>

  

};

export default DashboardComponent;

const EditCompany = ({
  nextStep,
  companySlug,
}: {
  nextStep: () => void;
  companySlug: string;
}) => {
  return (
    <article>
      <h3 className="font-semibold text-prime text-lg">Edit company details</h3>
      <p className="text-sm text-muted-foreground w-[450px] mt-2">
        Add your basic info, logo, and branding. They&apos;ll be automatically added
        to your contracts, proposals and invoices.
      </p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/settings/company`}>Edit Details</Link>
        </Button>
        <Button
          onClick={nextStep}
          className="text-second border-second  border bg-white  rounded-lg w-40 hover:bg-white"
        >
          Next Step <ArrowRight size={20} className="ml-1" />
        </Button>
      </div>
    </article>
  );
};
const AddService = ({
  nextStep,
  companySlug,
}: {
  nextStep: () => void;
  companySlug: string;
}) => {
  return (
    <article>
      <h3 className="font-semibold text-lg text-prime">Add a service</h3>
      <p className="text-sm text-muted-foreground mt-2  w-[450px]">
        Add new services and products to illustrate in your forms.
      </p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/services/new`}>Add Services</Link>
        </Button>
        <Button
          onClick={nextStep}
          className="text-second border-second  border bg-white  rounded-lg w-40 hover:bg-white"
        >
          Next Step <ArrowRight size={20} className="ml-1" />
        </Button>
      </div>
    </article>
  );
};

const AddForm = ({
  nextStep,
  companySlug,
}: {
  nextStep: () => void;
  companySlug: string;
}) => {
  return (
    <article>
      <h3 className="font-semibold text-lg text-prime">Create a form</h3>
      <p className="text-sm text-muted-foreground  w-[450px]">
        Create new forms to show to your clients .
      </p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/forms/new`}>Add Form</Link>
        </Button>
        <Button
          onClick={nextStep}
          className="text-second border-second  border bg-white  rounded-lg w-40 hover:bg-white"
        >
          Next Step <ArrowRight size={20} className="ml-1" />
        </Button>
      </div>
    </article>
  );
};
const AddContact = ({
  nextStep,
  companySlug,
}: {
  nextStep: () => void;
  companySlug: string;
}) => {
  return (
    <article>
      <h3 className="font-semibold text-ground text-lg">Create a contact</h3>
      <p className="text-sm text-muted-foreground mt-2  w-[450px]">
        Create new contacts and spread your business.
      </p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/contacts/new`}>Add Contact</Link>
        </Button>
        <Button
          onClick={nextStep}
          className="text-second border-second  border bg-white  rounded-lg w-40 hover:bg-white"
        >
          Next Step <ArrowRight size={20} className="ml-1" />
        </Button>
      </div>
    </article>
  );
};
const AddQuotation = ({
  nextStep,
  companySlug,
}: {
  nextStep: () => void;
  companySlug: string;
}) => {
  return (
    <article>
      <h3 className="font-semibold text-lg text-prime ">Create a quotation</h3>
      <p className="text-sm text-muted-foreground mt-2  w-[450px]">Create new quotation.</p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/quotations/new`}>Add Quotation</Link>
        </Button>
        <Button
          onClick={nextStep}
          className="text-second border-second  border bg-white  rounded-lg w-40 hover:bg-white"
        >
          Next Step <ArrowRight size={20} className="ml-1" />
        </Button>
      </div>
    </article>
  );
};

const AddInvoice = ({
  nextStep,
  companySlug,
}: {
  nextStep: () => void;
  companySlug: string;
}) => {
  return (
    <article>
      <h3 className="font-semibold text-lg text-prime">Create Invoice</h3>
      <p className="text-sm text-muted-foreground mt-2  w-[450px]">Create new Invoice.</p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/invoices/new`}>Add Invoice</Link>
        </Button>
        <Button
          onClick={nextStep}
          className="text-second border-second  border bg-white  rounded-lg w-40 hover:bg-white"
        >
          Hide  
        </Button>
      </div>
    </article>
  );
};
