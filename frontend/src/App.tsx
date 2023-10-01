import { Home } from "lucide-react";
import { useState } from "react";
import AdvancedForm from "./AdvancedForm";
import { buttonVariants } from "./components/ui/button";
import SearchPage from "./components/ui/SearchPage";
import { LanguageDropdown } from "./language-dropdown";
import { cn } from "./lib/utils";

function App() {
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  const [language, setLanguage] = useState("pl");

  const handleAdvancedClick = () => {
    setIsAdvanced(!isAdvanced);
  };
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="w-full flex h-16 items-center justify-center px-4">
            <nav className="container flex items-center justify-between space-x-4 lg:space-x-6 mx-6">
              <p className="text-md font-medium transition-colors">
                Aby wypełnic, zadzwoń: +48 123 456 876
              </p>
              <div className="flex items-center space-x-4">
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-6 w-6 flex items-center justify-center p-0 rounded-full hover:cursor-pointer"
                  )}
                  onClick={() => {
                    setIsAdvanced(false);
                  }}
                >
                  <Home className="h-6 w-6" />
                </a>
                <LanguageDropdown
                  language={language}
                  setLanguageChoice={setLanguage}
                />
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        {!isAdvanced ? (
          <SearchPage onChooseAdvanced={handleAdvancedClick} />
        ) : (
          <AdvancedForm />
        )}
      </div>
    </>
  );
}

export default App;
