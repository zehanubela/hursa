import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "./Loader";
import { FaArrowLeft } from "react-icons/fa";

const PeopleFilter = ({
  selectedPeople,
  setSelectedPeople,
  isRecentSearchesOpen,
  setRecentSearchesOpen,
  setRecentSearches,
}) => {
  const [peopleData, setPeopleData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [error, setError] = useState([]);
  const [payload, setPayload] = useState({
    country: "",
    current_role: "",
    current_company: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveRecentSearches = (searches) => {
    const existingSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    existingSearches.push({
      country: payload.country,
      current_role: payload.current_role,
      current_company: payload.current_company,
      results: searches,
    });

    if (existingSearches.length > 10) {
      existingSearches.shift();
    }

    localStorage.setItem("recentSearches", JSON.stringify(existingSearches));
  };

  const handleSearch = async () => {
    setError([]);
    setRecentSearchesOpen(false);
    let hasError = false;

    if (payload.country === "") {
      setError((prev) => [...prev, "Country is required"]);
      hasError = true;
    }
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      setError((prev) => [...prev, "Please enter your API key"]);
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      await fetch(
        `http://localhost:3000/api/mockPeople?country=${payload.country}&page_size=10&enrich_profiles=enrich`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setPeopleData(data.results);
          handleSaveRecentSearches(data.results);
        });
    } catch (error) {
      console.log(error, "error");
    }
    setIsLoading(false);
  };

  const handleViewDetails = (person) => {
    setViewDetails(person);
    setIsModalOpen(true);
  };

  const handleViewRecentSearch = (search) => {
    setPeopleData(search);
    setRecentSearchesOpen(false);
  };

  return (
    <div className="flex gap-6">
      <div className="w-1/4 bg-white rounded-lg p-4">
        {/* Sidebar for filters */}
        <h3 className="font-bold">Filters</h3>

        <Accordion type="single" collapsible>
          <AccordionItem value="country">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <Input
                type="text"
                placeholder="Country"
                className="border border-gray-300 rounded-md p-2"
                onChange={(e) =>
                  setPayload({ ...payload, country: e.target.value })
                }
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
                value={payload.current_role}
                onChange={(e) =>
                  setPayload({ ...payload, current_role: e.target.value })
                }
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
                value={payload.current_company}
                onChange={(e) =>
                  setPayload({ ...payload, current_company: e.target.value })
                }
              />
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center">
            <Button onClick={handleSearch} className="w-full mt-4">
              Apply
            </Button>
          </div>

          {error &&
            error.map((err) => (
              <p
                className="text-red-500 text-sm font-semibold text-center mt-2"
                key={err}
              >
                {err}
              </p>
            ))}
        </Accordion>
      </div>
      <div className="w-3/4 bg-white rounded-lg p-4">
        <div>
          {isRecentSearchesOpen && (
            <div>
              <span className="flex flex-col items-center gap-4 w-full justify-center mt-12">
                <span className="text-3xl font-semibold">Recent Searches</span>
                <div className="flex flex-col gap-4">
                  {JSON.parse(localStorage.getItem("recentSearches")).map(
                    (search) => (
                      <div key={search.id} className="border-2 border-gray-200 p-4 rounded-md w-[400px] hover:cursor-pointer" onClick={() => handleViewRecentSearch(search.results)}>
                        <span>{search.country}</span>
                        <span>{` ${search.current_role && ", " + search.current_role}`}</span>
                        <span>{`${search.current_company && ", " + search.current_company}`}</span>
                      </div>
                    ),
                  )}
                </div>
              </span>
            </div>
          )}

          {!isRecentSearchesOpen && !isLoading && peopleData.length === 0 && (
            <div>
              <span className="flex items-center gap-4 w-full justify-center mt-24">
                <FaArrowLeft className="text-5xl" />
                <span className="text-3xl font-semibold">
                  Find your prospects here
                </span>
              </span>
            </div>
          )}

          {!isRecentSearchesOpen && isLoading ? (
            <Loader />
          ) : (
            !isRecentSearchesOpen &&
            peopleData.map((person) => (
              <div
                key={person.profile.public_identifier}
                className="flex justify-between border-b-2 border-gray-200 py-2"
              >
                <Checkbox
                  checked={selectedPeople.includes(person)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPeople([...selectedPeople, person]);
                    } else {
                      setSelectedPeople(
                        selectedPeople.filter(
                          (p) =>
                            p.profile.public_identifier !==
                            person.profile.public_identifier,
                        ),
                      );
                    }
                  }}
                />
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
                  {person.profile.experiences[0]
                    .company_linkedin_profile_url ? (
                    <Link
                      href={
                        person.profile.experiences[0]
                          .company_linkedin_profile_url
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
                  <button
                    onClick={() => handleViewDetails(person)}
                    className="border-2 border-blue-500 bg-white text-blue-500 px-4 py-2 rounded-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        viewDetails={viewDetails}
      />
    </div>
  );
};

export default PeopleFilter;
