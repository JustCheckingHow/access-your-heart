import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Option } from "@/components/ui/multiselect";
import { useEffect, useState } from "react";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SkillsResponse {
  skills: Option[];
}

export interface ProfessionsResponse {
  professions: Option[];
}

export interface HobbiesResponse {
  hobbies: Option[];
}

export interface CitiesResponse {
  cities: Option[];
}

export enum Step {
  Skills = 1,
  Profession = 2,
  Hobby = 3,
  Time = 4,
  Location = 5,
}

export const useAdvancedFormUserSelection = () => {
  const [selectedSkills, setSelectedSkills] = useState<Option[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<Option[]>([]);
  const [selectedTimeSpent, setSelectedTimeSpent] = useState<string[]>([]);
  const [selectedHaveQualification, setSelectedHaveQualification] =
    useState<boolean>(false);
  const [selectedProfessionsForHobbies, setSelectedProfessionsForHobbies] =
    useState<Option[]>([]);
  const [selectedCities, setSelectedCities] = useState<Option[]>([]);

  return {
    selectedSkills,
    setSelectedSkills,
    selectedProfessions,
    setSelectedProfessions,
    selectedTimeSpent,
    setSelectedTimeSpent,
    selectedHaveQualification,
    setSelectedHaveQualification,
    selectedProfessionsForHobbies,
    setSelectedProfessionsForHobbies,
    selectedCities,
    setSelectedCities,
  };
};

export const useAdvancedFormData = () => {
  const [skillsOptions, setSkillsOptions] = useState<SkillsResponse["skills"]>(
    []
  );
  const [step, setStep] = useState<Step>(Step.Skills);
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

  return {
    skillsOptions,
    professionsOptions,
    hobbies,
    citiesOptions,
    step,
    setStep,
    setCitiesOptions,
    setHobbies,
    setProfessionsOptions,
    setSkillsOptions,
  };
};
