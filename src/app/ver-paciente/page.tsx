import React, { useState } from 'react';
import SeccionVerPacienteRegistradoLG from "@/components/VerPaciente/SeccionVerPacienteRegistrado/SeccionVerPacienteRegistradoLG";
import Header from "@/components/Header/Header";

export default function PacientesRegistrados(){
    return (
        <>
            <Header/>
            <div>
                <SeccionVerPacienteRegistradoLG/>
            </div>
        </>
    );
}