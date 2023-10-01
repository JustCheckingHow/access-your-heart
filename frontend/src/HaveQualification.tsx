import { useState } from "react";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";

export interface HaveQualificationStepProps {
  onSelectedHaveQualification: (value: boolean) => void;
}
export function HaveQualificationStep({
  onSelectedHaveQualification,
}: HaveQualificationStepProps) {
  const [haveQualification, setHaveQualification] = useState<boolean>(false);
  const [doesNotHaveQualification, setDoesNotHaveQualification] =
    useState<boolean>(false);

  return (
    <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
      <Label className="text-md">
        3. Czy masz już zawód? Na podstawie umiejetnosci wymaganych w tym
        zawodzie uzupelnimy wyszukiwania
      </Label>
      <div className="flex justify-between space-x-2 max-w-lg">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="profession-yes"
            onCheckedChange={() => {
              setHaveQualification((prev) => !prev);
              setDoesNotHaveQualification(false);
              if (!haveQualification) {
                onSelectedHaveQualification(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setHaveQualification((prev) => !prev);
                setDoesNotHaveQualification(false);
                if (!haveQualification) {
                  onSelectedHaveQualification(true);
                }
              }
            }}
            disabled={doesNotHaveQualification}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tak, mam zawód
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="profession-no"
            onCheckedChange={() => {
              setDoesNotHaveQualification((prev) => !prev);
              setHaveQualification(false);
              if (!doesNotHaveQualification) {
                onSelectedHaveQualification(false);
              }
            }}
            disabled={haveQualification}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setDoesNotHaveQualification((prev) => !prev);
                setHaveQualification(false);
                if (!doesNotHaveQualification) {
                  onSelectedHaveQualification(false);
                }
              }
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Nie, nie mam zawodu
          </label>
        </div>
      </div>
    </div>
  );
}
