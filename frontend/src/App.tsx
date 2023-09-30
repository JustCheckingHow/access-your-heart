import { useState } from "react";
import AdvancedForm from "./AdvancedForm";
import SearchPage from "./components/ui/SearchPage";

function App() {
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);

  const handleAdvancedClick = () => {
    setIsAdvanced(!isAdvanced);
  };
  return (
    <div className="container mx-auto">
      {!isAdvanced ? (
        <SearchPage onChooseAdvanced={handleAdvancedClick} />
      ) : (
        <AdvancedForm />
      )}
    </div>
  );
}

export default App;
