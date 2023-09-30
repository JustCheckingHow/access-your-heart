import { useState } from "react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { FancyMultiSelect, Option } from "./components/ui/multiselect";

export interface SkillsStepProps {
  skillsOptions: Option[];
  onSelectedSkillsChange: (skills: Option[]) => void;
  onNext: () => void;
}
export function SkillsStep({
  skillsOptions,
  onSelectedSkillsChange,
  onNext,
}: SkillsStepProps) {
  const [canGoNext, setcanGoNext] = useState<boolean>(false);

  const handleSelectionChange = (options: Option[]) => {
    onSelectedSkillsChange(options);
    setcanGoNext(options.length > 0);
  };
  return (
    <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
      <Label className="text-md">1. Jakie umiejętności chcesz rozwijać?</Label>
      <div className="flex w-full max-w-lg items-center space-x-4">
        <FancyMultiSelect
          onSelectionChange={handleSelectionChange}
          options={skillsOptions}
        />
        <Button
          type="submit"
          size="sm"
          className="mb-2"
          disabled={!canGoNext}
          onClick={onNext}
        >
          Dalej
        </Button>
      </div>
    </div>
  );
}
