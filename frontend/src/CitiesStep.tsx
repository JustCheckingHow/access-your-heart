import { useState } from "react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { FancyMultiSelect, Option } from "./components/ui/multiselect";

export interface CitiesStepProps {
  citiesOptions: Option[];
  onSelectedCitiesChange: (skills: Option[]) => void;
  onNext: () => void;
}
export function CitiesStep({
  citiesOptions,
  onSelectedCitiesChange,
  onNext,
}: CitiesStepProps) {
  const [canGoNext, setcanGoNext] = useState<boolean>(false);

  const handleSelectionChange = (options: Option[]) => {
    onSelectedCitiesChange(options);
    setcanGoNext(options.length > 0);
  };
  return (
    <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
      <Label className="text-md">6. W których miastach możesz studiować?</Label>
      <div className="flex w-full max-w-lg items-center space-x-4">
        <FancyMultiSelect
          onSelectionChange={handleSelectionChange}
          options={citiesOptions}
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
