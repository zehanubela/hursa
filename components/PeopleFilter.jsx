import {useState} from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import mockPeopleData from "@/app/person_search_mock.json";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Modal from "./Modal";
const PeopleFilter = ({ selectedPeople, setSelectedPeople }) => {
  // const [people, setPeople] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState(null)

  // React.useEffect(() => {
  //   // Fetch data from the JSON file
  //   fetch("/app/person_search_mock.json")
  //     .then((response) => response.json())
  //     .then((data) => setPeople(data.results));
  // }, []);

  // console.log(mockPeopleData, "mockpeople");

  const handleViewDetails = (person) => {
    setViewDetails(person)
    setIsModalOpen(true)
  }

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
        <div>
          {mockPeopleData.results.map((person) => (
            <div
              key={person.profile.public_identifier}
              className="flex justify-between border-b-2 border-gray-200 py-2"
            >
              <Checkbox checked={selectedPeople.includes(person)} onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedPeople([...selectedPeople, person]);
                } else {
                  setSelectedPeople(selectedPeople.filter(p => p.profile.public_identifier !== person.profile.public_identifier));
                }
              }} />
              <div className="flex flex-col gap-2 border-r-2 border-gray-200 w-[400px]">
                <div className="flex items-center gap-2">
                  <a
                    className="text-blue-500 block truncate"
                    href={person.linkedin_profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {person.profile.full_name}
                  </a>
                  <FaLinkedin />
                </div>
                <p className="truncate">
                  {person.profile.experiences[0].title}
                </p>
                <div className="flex items-center gap-2">
                  <IoLocationSharp />
                  <span className="truncate">{`${person.profile.city}, ${person.profile.state}, ${person.profile.country}`}</span>
                </div>
              </div>

              <div>
                {person.profile.experiences[0].company_linkedin_profile_url ? (
                  <Link
                    href={
                      person.profile.experiences[0].company_linkedin_profile_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-blue-500 block truncate">
                      {person.profile.experiences[0].company}
                    </span>
                  </Link>
                ) : (
                  <span className="block truncate">
                    {person.profile.experiences[0].company}
                  </span>
                )}

                {person.profile.experiences[0].location ? (
                  <span className="block truncate">
                    {person.profile.experiences[0].location}
                  </span>
                ) : null}
              </div>

              <div>
                <button onClick={() => handleViewDetails(person)} className="border-2 border-blue-500 bg-white text-blue-500 px-4 py-2 rounded-md">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} viewDetails={viewDetails} />
    </div>
  );
};

export default PeopleFilter;
