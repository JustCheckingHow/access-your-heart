import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { FancyMultiSelect, Option } from "./components/ui/multiselect";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Info, Plus } from "lucide-react";
import { Badge } from "./components/ui/badge";

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
      <h3 className="scroll-m-20 text-4xl font-semibold tracking-tight text-center">
        Cześć,
      </h3>
      <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        Zaplanuj z nami swoją karierę!
      </h4>
      <div className="grid w-full max-w-md items-center gap-4 mt-6 mx-auto">
        <Label className="text-md">
          1. Jakie umiejętności chcesz rozwijać?
        </Label>
        <FancyMultiSelect options={skillsOptions} />
      </div>
      <div className="grid w-full max-w-md items-center gap-4 mt-6 mx-auto">
        <Label className="text-md">
          2. W jakim zawodzie się widzisz w przyszłości?
        </Label>
        <FancyMultiSelect options={professionsOptions} />
      </div>
      <div className="grid w-full max-w-md items-center gap-4 mt-6 mx-auto">
        <Label className="text-md">
          3. Czy masz już zawód? Na podstawie umiejetnosci wymaganych w tym
          zawodzie uzupelnimy wyszukiwania
        </Label>
        <div className="flex justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="profession-yes" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tak, mam zawód
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="profession-no" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nie, nie mam zawodu
            </label>
          </div>
        </div>
      </div>
      <div className="grid w-full max-w-md items-center gap-4 mt-6 mx-auto">
        <Label className="text-md">
          4. Jakie hobby chcialbys wykorzystywac w swoim zawodzie?
        </Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="hobby-none" />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Żadne
          </label>
        </div>
        <FancyMultiSelect options={hobbies} />
      </div>
      <Alert className="max-w-lg mx-auto mt-2">
        <Info className="h-4 w-4" />
        <AlertTitle className="space-y-1 leading-6">
          Te zawody pasują do Twoich elementów wyszukiwania. Czy chcesz je dodać
          do możliwych zawodów?
        </AlertTitle>
        <AlertDescription>
          <div className="flex flex-wrap">
            {professionForHobbies.map((profession) => (
              <Badge variant="secondary" className="mx-1 my-1">
                <button className="mx-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Plus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
                {profession.name}
              </Badge>
            ))}
          </div>
        </AlertDescription>
      </Alert>
      <div className="grid w-full max-w-md items-center gap-4 mt-6 mx-auto">
        <Label className="text-md">
          5. Ile czasu mozesz poswiecic na naukę?
        </Label>
        <div className="flex justify-between flex-wrap">
          {[
            "Nie mam ograniczneń",
            "Wieczorowy",
            "Weekendy",
            "20h tygodniowo",
            "10h co drugi tydzien",
            "Bloker",
          ].map((option) => (
            <div className="flex items-center space-x-2 my-1" key={option}>
              <Checkbox id="option" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid w-full max-w-md items-center gap-4 mt-6 mx-auto">
        <Label className="text-md">
          6. W których miastach możesz studiować?
        </Label>
        <FancyMultiSelect options={professionsOptions} />
      </div>
    </div>
  );
}

export default App;
