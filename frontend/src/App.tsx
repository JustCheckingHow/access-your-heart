import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { FancyMultiSelect, Option } from "./components/ui/multiselect";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Info, Plus } from "lucide-react";
import { Badge } from "./components/ui/badge";
import SearchPage from "./components/ui/SearchPage";


interface SkillsResponse {
  skills: Option[];
}

interface ProfessionsResponse {
  professions: Option[];
}

interface HobbiesResponse {
  hobbies: Option[];
}

function App() {

  const [skillsOptions, setSkillsOptions] = useState<SkillsResponse["skills"]>(
    []
  );
  const [professionsOptions, setProfessionsOptions] = useState<
    ProfessionsResponse["professions"]
  >([]);

  const [hobbies, setHobbies] = useState<HobbiesResponse["hobbies"]>([]);

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

  const getHobbiesOptions = () => {
    axios
      .get<HobbiesResponse>(`http:///0.0.0.0:8080/hobbies`)
      .then(({ data }) => {
        console.log(data);
        setHobbies(data.hobbies);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSkillsOptions();
    getProfessionsOptions();
    getHobbiesOptions();
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
        `http://0.0.0.0:8080/professions-for-hobbies`,
        {
          hobbies: hobbies,
        }
      )
      .catch((error) => {
        console.log(error);
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
      <SearchPage />
    </div>
  );
}

export default App;
