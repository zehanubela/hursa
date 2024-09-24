import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PeopleFilter = () => {
  return (
    <div className="flex gap-6">
      <div className="w-1/4 bg-white rounded-lg p-4">
        {/* Sidebar for filters */}
        <h3 className="font-bold">Filters</h3>

        <Accordion type="single" collapsible>
          <AccordionItem value="country">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <input
                type="text"
                placeholder="Country"
                className="border border-gray-300 rounded-md p-2"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="current-role">
          <AccordionTrigger>Current Role</AccordionTrigger>
            <AccordionContent>
              <input
                type="text"
                placeholder="Current Role"
                className="border border-gray-300 rounded-md p-2"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="current-company">
          <AccordionTrigger>Current Company</AccordionTrigger>
            <AccordionContent>
              <input
                type="text"
                placeholder="Current Company"
                className="border border-gray-300 rounded-md p-2"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="w-3/4 bg-white rounded-lg p-4 min-h-56">
        {/* Main content area */}
        <h3 className="font-bold">Content Area</h3>
        <div>People Results</div>
      </div>
    </div>
  );
};

export default PeopleFilter;
