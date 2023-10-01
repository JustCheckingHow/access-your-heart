import { Info } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Option } from "./components/ui/multiselect";
import { ProfessionsForHobbiesButton } from "./ProfessionForHobbyButton";

interface ProfessionsForHobbiesProps {
  professionsForHobbies: Option[];
  onChangeProfessionsForHobbies: (professions: Option[]) => void;
}

export function ProfessionsForHobbies({
  professionsForHobbies,
  onChangeProfessionsForHobbies,
}: ProfessionsForHobbiesProps) {
  const [selectedProfessions, setSelectedProfessions] = useState<Option[]>([]);

  const onAddProfession = (profession: Option) => {
    setSelectedProfessions([...selectedProfessions, profession]);
    onChangeProfessionsForHobbies([...selectedProfessions, profession]);
  };

  const onRemoveProfession = (profession: Option) => {
    const filteredProfessions = selectedProfessions.filter(
      (selectedProfession) => selectedProfession.name !== profession.name
    );
    setSelectedProfessions(filteredProfessions);
    onChangeProfessionsForHobbies(filteredProfessions);
  };

  return (
    <Alert className="max-w-xl mx-auto mt-2">
      <Info className="h-4 w-4" />
      <AlertTitle className="space-y-1 leading-6">
        Te zawody pasują do Twoich elementów wyszukiwania. Czy chcesz je dodać
        do możliwych zawodów?
      </AlertTitle>
      <AlertDescription>
        <div className="flex flex-wrap max-w-lg">
          {professionsForHobbies.map((profession) => (
            <ProfessionsForHobbiesButton
              key={profession.name}
              profession={profession}
              onAddProfession={onAddProfession}
              onRemoveProfession={onRemoveProfession}
            />
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}
