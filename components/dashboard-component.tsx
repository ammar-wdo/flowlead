"use client";

import { useDashboard } from "@/hooks/dashboard-component-hook";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, Variants, motion } from "framer-motion";

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
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
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
  <button onClick={()=>setHide(true)} className="absolute top-6 right-6 text-gray-400 ">Hide</button>
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
                "w-10 h-10 bg-white flex relative items-center justify-center rounded-full border transition",
                step === el && "border-second text-second"
              )}
            >
              {i + 1}
              {!!(i !== STEPS.length - 1) && (
                <span className="absolute -bottom-[100%] w-px h-full bg-gray-200 z-10" />
              )}
            </span>
            <span className="capitalize text-muted-foreground">{el}</span>
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
            <AddQuotation companySlug={companySlug} />
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
      Let's get you set up with Flowlead.  <button onClick={()=>setHide(false)} className="text-indigo-500 flex items-center font-semibold">Get Started{<ChevronRight size={20} className="ml-1"/>}</button>
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
      <h3 className="font-semibold text-lg">Edit company details</h3>
      <p className="text-sm text-zinc-500 w-[450px]">
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
      <h3 className="font-semibold text-lg">Add a service</h3>
      <p className="text-sm text-zinc-500  w-[450px]">
        Add new services and products to illustrate in your forms.
      </p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/services`}>Add Services</Link>
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
      <h3 className="font-semibold text-lg">Create a form</h3>
      <p className="text-sm text-zinc-500  w-[450px]">
        Create new forms to show to your clients .
      </p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/forms`}>Add Form</Link>
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
      <h3 className="font-semibold text-lg">Create a contact</h3>
      <p className="text-sm text-zinc-500  w-[450px]">
        Create new contacts and spread your business.
      </p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/contacts`}>Add Contact</Link>
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
const AddQuotation = ({ companySlug }: { companySlug: string }) => {
  return (
    <article>
      <h3 className="font-semibold text-lg">Create a quotation</h3>
      <p className="text-sm text-zinc-500  w-[450px]">Create new quotation.</p>
      <div className="flex items-center gap-8 mt-4">
        {" "}
        <Button
          asChild
          className="bg-second hover:bg-second/90   text-white rounded-lg w-40"
        >
          <Link href={`/${companySlug}/contacts`}>Add Quotation</Link>
        </Button>
      </div>
    </article>
  );
};
