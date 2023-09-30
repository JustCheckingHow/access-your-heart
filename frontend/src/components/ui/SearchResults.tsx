import React from 'react';
import { Button } from "@/components/ui/button"

interface SearchWidgetProps {
    kierunek: string;
    przedmiot: string;
    score: string;
    syllabus: string;
  }

const SearchWidget = ({kierunek, przedmiot, score, syllabus}: SearchWidgetProps)  => {
    const unemployment = "1.5%";
    const timeToFindFirstJob = "2 miesiące";
    const numberOfGraduates = "12345";
    const numberOfPlaces = "12";
    const salary = "15 250 zł";

    return (
        <div className="search-tile" style={{border: "1px solid", borderColor: "#ACACAC", marginBottom: "40px"}}>
            <div className="st-header" style={{display: "flex", justifyContent: "space-between", backgroundColor: "rgba(119, 154, 235, 0.24)"}}>
                <h2 style={{fontSize: "25px", color: "#0F172A", marginLeft: "25px", display: "flex", alignItems: "center"}}>{kierunek}</h2>
                <div style={{display: "flex"}}>
                    <span style={{display: "flex", marginRight: "16px", fontSize: "20px", color: "#4F4F4F", alignItems: "center"}}>zarobki brutto </span>
                    <b style={{fontSize: "35px"}}>{salary}</b>
                    <Button style={{marginLeft: "20px", marginRight: "25px", marginTop: "5px"}}>Strona kierunku</Button>
                </div>
            </div>

            <div className="st-body" style={{display: "flex", flexDirection: "row", gap: "70px", marginLeft: "39px", marginTop: "20px"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: "20px", color:"#4F4F4F"}}>wskaźnik bezrobocia</span>
                    <span style={{fontSize: "35px"}}>{unemployment}</span>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: "20px", color:"#4F4F4F"}}>czas szukania pierwszej pracy</span>
                    <span style={{fontSize: "35px"}}>{timeToFindFirstJob}</span>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: "20px", color:"#4F4F4F"}}>liczba absolwentów</span>
                    <span style={{fontSize: "35px"}}>{numberOfGraduates}</span>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: "20px", color:"#4F4F4F"}}>liczba osób na jedno miejsce</span>
                    <span style={{fontSize: "35px"}}>{numberOfPlaces}</span>
                </div>
            </div>
            <div className="st-footer" style={{marginBottom: "27px", marginLeft: "39px", marginTop: "49px"}}>
                <span>Słowa pasujące z syllabusa: </span>
                <div>
                    {syllabus}
                </div>
            </div>
        </div>
    );
};


const SearchResults = (results: string[]) => {
    console.log(results);
    const out = results["results"].map((result) => {
        console.log(result);
        return (<SearchWidget kierunek={result['kierunek']} przedmiot={result['przedmiot']} score={result['score']} syllabus={result['syllabus']} />);
    });

    return (
        <div>
            <h1 style={{fontSize: "30px", marginBottom: "20px", marginTop: "20px"}}>Wyniki Wyszukiwania</h1>
            {/* <SearchWidget kierunek="Informatyka" przedmiot="Matematyka" score="0.9" syllabus="https://www.google.com/" />             */}
            {out}
        </div>
    );
};

export default SearchResults;