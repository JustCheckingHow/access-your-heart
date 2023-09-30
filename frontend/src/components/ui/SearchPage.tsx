// import React from 'react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import logo from "@/assets/logo.jpg";
import { Heading } from "@/Heading";

// Create simple search component

interface SearchPageProps {
  onChooseAdvanced: () => void;
}

const SearchPage = ({ onChooseAdvanced }: SearchPageProps) => {
  return (
    <>
      {/* make it centered */}
      <div className="flex justify-center" style={{ marginTop: "77px" }}>
        {/* make it column like using flex */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Heading />
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            <Input
              placeholder="Wyszukaj..."
              style={{ marginTop: "30px", width: "562px" }}
            />
            <Button style={{ marginTop: "30px", width: "150px" }}>
              Szukaj
            </Button>
          </div>

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
