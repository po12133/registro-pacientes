import React, { useState } from 'react';
import SeccionRegistros from "@/components/NuevoPaciente/SeccionRegistros/SeccionRegistros";
import Header from "@/components/Header/Header";

export default function NuevoPaciente(){
    return (
        <>
            <Header/>
            <div>
                <SeccionRegistros />
            </div>
        </>
    );
}