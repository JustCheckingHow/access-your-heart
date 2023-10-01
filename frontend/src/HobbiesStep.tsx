import { useState } from "react";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { FancyMultiSelect, Option } from "./components/ui/multiselect";

export interface HobbiesStepProps {
  hobbiesOptions: Option[];
  onSelectedHobbiesChange: (hobbies: Option[]) => void;
  onNext: () => void;
}
export function HobbiesStep({
  hobbiesOptions,
  onSelectedHobbiesChange,
  onNext,
}: HobbiesStepProps) {
  const [selectedNone, setSelectedNone] = useState<boolean>(false);
  const [canGoNext, setCanGoNext] = useState<boolean>(false);

  const handleSelectionChange = (options: Option[]) => {
    onSelectedHobbiesChange(options);
    setSelectedNone(false);
    setCanGoNext(options.length > 0);
  };
  return (
    <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
      <Label className="text-md">
        4. Jakie hobby chcialbys wykorzystywac w swoim zawodzie?
      </Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hobby-none"
          onCheckedChange={() => {
            setSelectedNone((prev) => !prev);
            if (!selectedNone) {
              onSelectedHobbiesChange([]);
              setCanGoNext(true);
            } else {
              setCanGoNext(false);
            }
          }}
          checked={selectedNone}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSelectedNone((prev) => !prev);
              if (!selectedNone) {
                onSelectedHobbiesChange([]);
                setCanGoNext(true);
              } else {
                setCanGoNext(false);
              }
            }
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Żadne
        </label>
      </div>
      <div className="flex w-full max-w-lg items-center space-x-4">
        <FancyMultiSelect
          onSelectionChange={handleSelectionChange}
          options={hobbiesOptions}
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
