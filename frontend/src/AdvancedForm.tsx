import { useEffect, useState } from "react";
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

interface SkillsResponse {
  skills: Option[];
}

interface ProfessionsResponse {
  professions: Option[];
}

interface HobbiesResponse {
  hobbies: Option[];
}

interface CitiesResponse {
  cities: Option[];
}

enum Step {
  Skills = 1,
  Profession = 2,
  Hobby = 3,
  Time = 4,
  Location = 5,
}

function AdvancedForm() {
  const [skillsOptions, setSkillsOptions] = useState<SkillsResponse["skills"]>(
    []
  );
  const [step, setStep] = useState<Step>(Step.Skills);
  const [selectedSkills, setSelectedSkills] = useState<Option[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<Option[]>([]);
  const [selectedTimeSpent, setSelectedTimeSpent] = useState<string[]>([]);
  const [selectedHaveQualification, setSelectedHaveQualification] =
    useState<boolean>(false);

  const [selectedProfessionsForHobbies, setSelectedProfessionsForHobbies] =
    useState<Option[]>([]);

  const [selectedCities, setSelectedCities] = useState<Option[]>([]);

  const [professionsOptions, setProfessionsOptions] = useState<
    ProfessionsResponse["professions"]
  >([]);

  const [hobbies, setHobbies] = useState<HobbiesResponse["hobbies"]>([]);

  const getSkillsOptions = () => {
    axios
      .get<SkillsResponse>(`${import.meta.env.VITE_BACKEND_URL}/skills`)
      .then(({ data }) => {
        console.log(data);
        setSkillsOptions(data.skills);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProfessionsOptions = () => {
    axios
      .get<ProfessionsResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/professions`
      )
      .then(({ data }) => {
        console.log(data);
        setProfessionsOptions(data.professions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getHobbiesOptions = () => {
    axios
      .get<HobbiesResponse>(`${import.meta.env.VITE_BACKEND_URL}/hobbies`)
      .then(({ data }) => {
        console.log(data);
        setHobbies(data.hobbies);
      })
      .catch((error) => {
        console.log(error);
        setHobbies([]);
      });
  };
  const [citiesOptions, setCitiesOptions] = useState<Option[]>([]);

  const getCitiesOptions = () => {
    axios
      .get<CitiesResponse>(`${import.meta.env.VITE_BACKEND_URL}/cities`)
      .then(({ data }) => {
        console.log(data);
        setCitiesOptions(data.cities);
      })
      .catch((error) => {
        console.log(error);
        setCitiesOptions([]);
      });
  };

  useEffect(() => {
    getSkillsOptions();
    getProfessionsOptions();
    getHobbiesOptions();
    getCitiesOptions();
  }, []);
  // TODO: remove this
  useEffect(() => {
    getProfessionForHobbies([]);
  }, []);

  const [professionForHobbies, setProfessionForHobbies] = useState<Option[]>(
    []
  );

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

  return (
    <div className="container mx-auto">
      <div className="flex flex-col mt-14 mb-4 gap-4">
        <Heading />
      </div>
      {step >= Step.Skills && (
        <SkillsStep
          skillsOptions={skillsOptions}
          onSelectedSkillsChange={setSelectedSkills}
          onNext={() => setStep(Step.Profession)}
        />
      )}
      {step >= Step.Profession && (
        <ProfessionsStep
          professionsOptions={professionsOptions}
          onSelectedSkillsChange={setSelectedProfessions}
          onNext={() => setStep(Step.Hobby)}
        />
      )}
      {step >= Step.Hobby && (
        <>
          <HaveQualificationStep
            onSelectedHaveQualification={setSelectedHaveQualification}
          />
          <HobbiesStep
            hobbiesOptions={hobbies}
            onSelectedHobbiesChange={getProfessionForHobbies}
            onNext={() => setStep(Step.Time)}
          />
        </>
      )}
      {step >= Step.Time && (
        <>
          <ProfessionsForHobbies
            professionsForHobbies={professionForHobbies}
            onChangeProfessionsForHobbies={setSelectedProfessionsForHobbies}
          />

          <TimeSpentStep onSelectedTimeSpent={setSelectedTimeSpent} />
          <CitiesStep
            citiesOptions={citiesOptions}
            onSelectedCitiesChange={setSelectedCities}
            onNext={() => setStep(Step.Location)}
          />
        </>
      )}
    </div>
  );
}

export default AdvancedForm;
