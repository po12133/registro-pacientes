import React, { useState } from 'react';
import SeccionEditarPacienteLG from "@/components/EditarPaciente/SeccionEditarPaciente/SeccionEditarPacienteLG";
import Header from "@/components/Header/Header";

export default function EditarPaciente(){
    return (
        <>
            <Header/>
            <div>
                <SeccionEditarPacienteLG/>
            </div>
        </>
    );
}