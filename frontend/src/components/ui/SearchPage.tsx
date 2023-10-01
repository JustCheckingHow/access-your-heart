import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResultsProps } from "@/components/ui/SearchResults";

import { Heading } from "@/Heading";
import { SAMPLE_SEARCH_RESULTS } from "@/constants";

interface SearchPageProps {
  onChooseAdvanced: () => void;
  onSearchSubmit: (data: SearchResultsProps) => void;
}

const SearchPage = ({ onChooseAdvanced, onSearchSubmit }: SearchPageProps) => {
  const [searchValue, setSearchValue] = React.useState<string>("");

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    console.log(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        query: searchValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // TODO: uncomment
        // onSearchSubmit(data);
        onSearchSubmit(SAMPLE_SEARCH_RESULTS);
      })
      .catch((error) => {
        console.error("Error:", error);
        onSearchSubmit(SAMPLE_SEARCH_RESULTS); // TODO: remove
      });
  };

  return (
    <>
      {/* make it centered */}
      <div className="flex justify-center" style={{ marginTop: "77px" }}>
        {/* make it column like using flex */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Heading />
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "row", gap: "30px" }}
          >
            <Input
              placeholder="Wyszukaj..."
              style={{ marginTop: "30px", width: "562px" }}
              type="text"
              value={searchValue}
              onChange={handleChange}
            />
            <Button style={{ marginTop: "30px", width: "150px" }}>
              Szukaj
            </Button>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "141px",
              marginBottom: "220px",
            }}
          >
            <p style={{ fontSize: "20px" }}>
              Nie znalazłeś tego, czego szukasz?
            </p>
            <a style={{ fontSize: "14px" }} href="/add">
              Skorzystaj z wyszukiwania zaawansowanego
            </a>
            <Button
              style={{ marginTop: "30px", width: "270px" }}
              onClick={onChooseAdvanced}
            >
              Wyszukiwanie zaawansowane
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
