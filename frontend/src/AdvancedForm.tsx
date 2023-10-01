import { useState } from "react";
import axios from "axios";
import { Option } from "./components/ui/multiselect";
import { SkillsStep } from "./SkillsStep";
import { ProfessionsStep } from "./ProfessionsStep";
import { HaveQualificationStep } from "./HaveQualification";
import { HobbiesStep } from "./HobbiesStep";
import { ProfessionsForHobbies } from "./ProfessionsForHobbies";
import { Heading } from "./Heading";
import { TimeSpentStep } from "./TimeSpentStep";
import { CitiesStep } from "./CitiesStep";
import {
  HobbiesResponse,
  ProfessionsResponse,
  Step,
  useAdvancedFormData,
  useAdvancedFormUserSelection,
} from "./lib/utils";

function AdvancedForm() {
  const {
    selectedSkills,
    setSelectedSkills,
    selectedProfessions,
    setSelectedProfessions,
    selectedHobbies,
    setSelectedHobbies,
    selectedTimeSpent,
    setSelectedTimeSpent,
    selectedHaveQualification,
    setSelectedHaveQualification,
    selectedProfessionsForHobbies,
    setSelectedProfessionsForHobbies,
    selectedCities,
    setSelectedCities,
  } = useAdvancedFormUserSelection();

  const userData = {
    skills: selectedSkills.map((skill) => skill.name),
    professions: selectedProfessions.map((profession) => profession.name),
    hobbies: selectedHobbies.map((hobby) => hobby.name),
    // timeSpent: selectedTimeSpent,
    // haveQualification: selectedHaveQualification,
    // professionsForHobbies: selectedProfessionsForHobbies.map(
    //   (profession) => profession.name
    // ),
    cities: selectedCities.map((city) => city.name),
  };

  const [professionForHobbies, setProfessionForHobbies] = useState<Option[]>(
    []
  );
  const {
    skillsOptions,
    professionsOptions,
    hobbies,
    citiesOptions,
    step,
    setStep,
  } = useAdvancedFormData();

  const getProfessionForHobbies = (hobbies: Option[]) => {
    axios
      .post<HobbiesResponse, ProfessionsResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/professions-for-hobbies`,
        {
          hobbies: hobbies,
        }
      )
      .catch((error) => {
        console.log(error);
        setProfessionForHobbies([]);
      })
      .then((response) => {
        console.log({ hobbiesforprofession: response });
        if (response && "data" in response) {
          const { data } = response;
          if (data && "professions" in (data as ProfessionsResponse)) {
            const { professions } = data as ProfessionsResponse;
            setProfessionForHobbies(professions);
          }
        }
      });
  };

  async function handleSubmit() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/facet-search`,
        userData
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col mt-14 mb-4 gap-4">
        <Heading />
      </div>
      <ol className="border-l-2 border-primary dark:border-primary-500">
        {step >= Step.Skills ? (
          <li>
            <SkillsStep
              skillsOptions={skillsOptions}
              onSelectedSkillsChange={setSelectedSkills}
              onNext={() => setStep(Step.Profession)}
            />
          </li>
        ) : (
          <li>
            <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary dark:bg-secondary-500"></div>
            <div className="w-full h-4"></div>
          </li>
        )}
        {step >= Step.Profession ? (
          <li>
            <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary dark:bg-primary-500"></div>
            <ProfessionsStep
              professionsOptions={professionsOptions}
              onSelectedSkillsChange={setSelectedProfessions}
              onNext={() => setStep(Step.Hobby)}
            />
          </li>
        ) : (
          <li>
            <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary dark:bg-secondary-500"></div>
            <div className="w-full h-4"></div>
          </li>
        )}
        {step >= Step.Hobby ? (
          <li>
            <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary dark:bg-primary-500"></div>
            <HaveQualificationStep
              onSelectedHaveQualification={setSelectedHaveQualification}
            />
            <HobbiesStep
              hobbiesOptions={hobbies}
              onSelectedHobbiesChange={(hobbies) => {
                setSelectedHobbies(hobbies);
                getProfessionForHobbies(hobbies);
              }}
              onNext={() => setStep(Step.Time)}
            />
          </li>
        ) : (
          <li>
            <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary dark:bg-secondary-500"></div>
            <div className="w-full h-4"></div>
          </li>
        )}
        {step >= Step.Time ? (
          <li>
            <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary dark:bg-primary-500"></div>
            <ProfessionsForHobbies
              professionsForHobbies={professionForHobbies}
              onChangeProfessionsForHobbies={setSelectedProfessionsForHobbies}
            />
            <TimeSpentStep onSelectedTimeSpent={setSelectedTimeSpent} />
            <CitiesStep
              citiesOptions={citiesOptions}
              onSelectedCitiesChange={setSelectedCities}
              onNext={() => {
                setStep(Step.Location);
                console.log(userData);
                handleSubmit();
              }}
            />
          </li>
        ) : (
          <li>
            <div className="-ml-[9px] -mt-2 mr-3 flex h-4 w-4 items-center justify-center rounded-full bg-secondary dark:bg-secondary-500"></div>
            <div className="w-full h-4"></div>
          </li>
        )}
      </ol>
    </div>
  );
}

export default AdvancedForm;
