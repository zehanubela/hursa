"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PeopleFilter from "@/components/PeopleFilter";
import CompanyFilter from "@/components/CompanyFilter";
import { BsPeopleFill, BsBuildingsFill, BsPlus } from "react-icons/bs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Prospecting() {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("apiKey", apiKey);
    setSettingsOpen(false);
  };

  const handleExport = () => {
    console.log(selectedPeople, "selectedPeople");
    const csvContent =
      "data:text/csv;charset=utf-8," +
      selectedPeople
        .map((person) =>
          Object.entries(person)
            .flatMap(([key, value]) =>
              typeof value === "object"
                ? Object.values(value).map(String)
                : String(value),
            )
            .join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_people.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  return (
    <div className="p-8 bg-gray-200">
      <Tabs defaultValue="people" className="max-w-7xl relative">
        <TabsList>
          <TabsTrigger
            value="people"
            className="flex items-center gap-2 flex-grow-0"
          >
            <BsPeopleFill />
            People
          </TabsTrigger>
          <TabsTrigger
            value="company"
            className="flex items-center gap-2 flex-grow-0"
          >
            <BsBuildingsFill />
            Companies
          </TabsTrigger>
        </TabsList>
        <div className="absolute right-0 top-0 flex gap-6">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 rounded-md py-2 disabled:opacity-50 font-semibold"
          >
            Settings
          </button>
          <button className="flex items-center gap-2 bg-white text-blue-500 px-4 rounded-md py-2 disabled:opacity-50 font-semibold">
            Recent Searches
          </button>
          <button
            disabled={
              selectedCompanies.length === 0 && selectedPeople.length === 0
            }
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 rounded-md py-2 disabled:opacity-50 font-semibold"
          >
            Export to CSV
          </button>
        </div>

        <TabsContent value="people" className="w-full mt-6">
          <PeopleFilter
            selectedPeople={selectedPeople}
            setSelectedPeople={setSelectedPeople}
          />
        </TabsContent>
        <TabsContent value="company">
          <CompanyFilter />
        </TabsContent>
      </Tabs>

      <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <h1>Add your API key</h1>
          <Input
            type="text"
            placeholder="API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button className="w-min mt-4" onClick={handleSaveApiKey}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
