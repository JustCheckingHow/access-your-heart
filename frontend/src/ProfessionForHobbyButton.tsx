import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "./components/ui/badge";
import { Option } from "./components/ui/multiselect";

interface ProfessionsForHobbiesButtonProps {
  profession: Option;
  onAddProfession: (profession: Option) => void;
  onRemoveProfession: (profession: Option) => void;
}

export function ProfessionsForHobbiesButton({
  profession,
  onAddProfession,
  onRemoveProfession,
}: ProfessionsForHobbiesButtonProps) {
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const handleAddProfession = (profession: Option) => {
    onAddProfession(profession);
    setIsAdded(true);
  };
  const handleRemoveProfession = (profession: Option) => {
    onRemoveProfession(profession);
    setIsAdded(false);
  };
  const variant = isAdded ? "default" : "secondary";
  return (
    <Badge variant={variant} className="mx-1 my-1">
      <button
        className="mx-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() =>
          isAdded
            ? handleRemoveProfession(profession)
            : handleAddProfession(profession)
        }
      >
        <Plus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
      </button>
      {profession.name}
    </Badge>
  );
}
