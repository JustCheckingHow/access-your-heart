import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import polandSvg from "@/assets/flag-for-poland-svgrepo-com.svg";
import ukSvg from "@/assets/england-svgrepo-com.svg";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageDropdownProps {
  setLanguageChoice: (language: string) => void;
  language: string;
}

export function LanguageDropdown({
  setLanguageChoice,
  language,
}: LanguageDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Języki</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={setLanguageChoice}
        >
          <DropdownMenuRadioItem value="en">
            <img src={ukSvg} alt="English" className="h-4 w-4 mr-2" />
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pl">
            <img src={polandSvg} alt="Polski" className="h-4 w-4 mr-2" />
            Polski
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
