import { useState } from "react";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";

interface TimeSpentStepProps {
  onSelectedTimeSpent: (value: string[]) => void;
}

export function TimeSpentStep({ onSelectedTimeSpent }: TimeSpentStepProps) {
  const [selectedTimeSpent, setSelectedTimeSpent] = useState<string[]>([]);
  const onCheckOption = (option: { name: string; label: string }) => {
    setSelectedTimeSpent((prev) => [...prev, option.name]);
    onSelectedTimeSpent([...selectedTimeSpent, option.name]);
  };

  const onUncheckOption = (option: { name: string; label: string }) => {
    setSelectedTimeSpent((prev) => prev.filter((name) => name !== option.name));
    onSelectedTimeSpent(
      selectedTimeSpent.filter((name) => name !== option.name)
    );
  };

  return (
    <div className="grid w-full max-w-xl items-center gap-4 mt-6 mx-auto">
      <Label className="text-md">5. Ile czasu mozesz poswiecic na naukę?</Label>
      <div className="flex flex-wrap">
        {[
          {
            name: "nie-mam-ograniczen",
            label: "Nie mam ograniczneń",
          },
          {
            name: "wieczorowy",
            label: "Wieczorowy",
          },
          {
            name: "weekendy",
            label: "Weekendy",
          },
          {
            name: "20h-tygodniowo",
            label: "20h tygodniowo",
          },
          {
            name: "10h-co-drugi-tydzien",
            label: "10h co drugi tydzien",
          },
          {
            name: "bloker",
            label: "Bloker",
          },
        ].map(({ name, label }) => (
          <div className="flex items-center space-x-2 my-2 mx-2" key={name}>
            <Checkbox
              id={name}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  onCheckOption({ name, label });
                } else {
                  onUncheckOption({ name, label });
                }
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
