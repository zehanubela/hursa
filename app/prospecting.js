"use client";
import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PeopleFilter from "@/components/PeopleFilter";
import CompanyFilter from "@/components/CompanyFilter";
import { BsPeopleFill, BsBuildingsFill } from "react-icons/bs";

export default function Prospecting() {

  return (
    <div className="p-8 bg-gray-200 h-full">
      <Tabs defaultValue="people" className="max-w-5xl">
        <TabsList>
          <TabsTrigger value="people" className="flex items-center gap-2"><BsPeopleFill />People</TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2"><BsBuildingsFill />Companies</TabsTrigger>
        </TabsList>
        <TabsContent value="people" className="w-full">
        <PeopleFilter />
        </TabsContent>
        <TabsContent value="company">
          <CompanyFilter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
