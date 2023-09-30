import { useEffect, useState } from "react";
import axios from "axios";
import { FancyMultiSelect, Option } from "./components/ui/multiselect";
import { Label } from "./components/ui/label";

interface SkillsResponse {
  skills: Option[];
}

interface ProfessionsResponse {
  professions: Option[];
}

function App() {
  const [skillsOptions, setSkillsOptions] = useState<SkillsResponse["skills"]>(
    []
  );
  const [professionsOptions, setProfessionsOptions] = useState<
    ProfessionsResponse["professions"]
  >([]);
  const getSkillsOptions = () => {
    axios
      .get<SkillsResponse>(`http://0.0.0.0:8080/skills`)
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
      .get<ProfessionsResponse>(`http://0.0.0.0:8080/professions`)
      .then(({ data }) => {
        console.log(data);
        setProfessionsOptions(data.professions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSkillsOptions();
    getProfessionsOptions();
  }, []);

  return (
    <div className="container mx-auto">
      <h3 className="scroll-m-20 text-4xl font-semibold tracking-tight text-center">
        Cześć,
      </h3>
      <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        Zaplanuj z nami swoją karierę!
      </h4>
      <div className="grid w-full max-w-md items-center gap-4 my-6 mx-auto">
        <Label className="text-md">
          1. Jakie umiejętności chcesz rozwijać?
        </Label>
        <FancyMultiSelect options={skillsOptions} />
      </div>
      <div className="grid w-full max-w-md items-center gap-4 my-6 mx-auto">
        <Label className="text-md">
          2. W jakim zawodzie się widzisz w przyszłości?
        </Label>
        <FancyMultiSelect options={professionsOptions} />
      </div>
    </div>
  );
}

export default App;
