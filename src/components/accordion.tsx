"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
  return (
    <ShadcnAccordion
      type="single"
      defaultValue={defaultOpen ? "item-1" : undefined}
      collapsible
      className="w-full"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-medium">{title}</AccordionTrigger>
        <AccordionContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AccordionContent>
      </AccordionItem>
    </ShadcnAccordion>
  );
};

export default Accordion;
