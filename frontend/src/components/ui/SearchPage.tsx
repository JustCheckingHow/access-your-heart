// import React from 'react';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import logo from "@/assets/logo.jpg"

// Create simple search component

const SearchPage = () => {
    return (
        <>
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
                    <div style={{display: "flex", flexDirection: "row", gap: "30px"}}>
                        <Input placeholder="Wyszukaj..." style={{marginTop: "30px", width: "562px"}} />
                        <Button style={{marginTop: "30px", width: "150px"}}>Szukaj</Button>
                    </div>

                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "141px", marginBottom: "220px"}}>
                        <p style={{fontSize: "20px"}}>Nie znalazłeś tego, czego szukasz?</p>
                        <a style={{fontSize: "14px"}} href="/add">Skorzystaj z wyszukiwania zaawansowanego</a>
                        <Button style={{marginTop: "30px", width: "270px"}}>Wyszukiwanie zaawansowane</Button>
                    </div>
                </div>

            </div>
        </>
    );
}

export default SearchPage;