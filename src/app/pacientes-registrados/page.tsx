import React, { useState } from 'react';
import SeccionPacientesRegistradosLG from "@/components/PacientesRegistrados/SeccionPacientesRegistrados/SeccionPacientesRegistradosLG";
import Header from "@/components/Header/Header";

export default function PacientesRegistrados(){
    return (
        <>
            <Header/>
            <div>
                <SeccionPacientesRegistradosLG/>
            </div>
        </>
    );
}