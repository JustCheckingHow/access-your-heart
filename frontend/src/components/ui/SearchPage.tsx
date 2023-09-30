import React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SearchResults from "@/components/ui/searchResults"

import logo from "@/assets/logo.jpg";
import { Heading } from "@/Heading";


interface SearchPageProps {
  onChooseAdvanced: () => void;
}

const SearchPage = ({ onChooseAdvanced }: SearchPageProps) => {
    const [searchValue, setSearchValue] = React.useState<string>("");
    const [searchResults, setSearchResults] = React.useState<string[]>([]);

    const handleChange = (e) => {
        setSearchValue(e.target.value);
        console.log(e);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://api.justcheckinghow.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                query: searchValue,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setSearchResults(data.results);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        searchResults.length == 0 ?
        (<>
            {/* make it centered */}
            <div className="flex justify-center" style={{marginTop: "77px"}}>
                {/* make it column like using flex */}
                <div style={{display: "flex", flexDirection: "column", gap: "25px"}}>
                    <img src={logo} width={134} height={134} style={{ margin: "auto"}}/>
                    <h3 className="scroll-m-20 text-4xl font-semibold tracking-tight text-center">
                        Cześć,
                    </h3>
                    <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
                        Zaplanuj z nami swoją karierę!
                    </h4>
                    <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "row", gap: "30px"}}>
                        <Input placeholder="Wyszukaj..." style={{marginTop: "30px", width: "562px"}} 
                        type="text"
                        value={searchValue}
                        onChange={handleChange} />
                        <Button style={{marginTop: "30px", width: "150px"}} >Szukaj</Button>
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
        </>)
        :
        (
            <SearchResults results={searchResults} />
        )
    );
}

export default SearchPage;
