import React, { useState } from 'react';
import SeccionAtenderPacienteLG from "@/components/AtenderPaciente/SeccionAtenderPaciente/SeccionAtenderPacienteLG";
import Header from "@/components/Header/Header";

export default function AtenderPaciente(){
    return (
        <>
            <Header/>
            <div>
                <SeccionAtenderPacienteLG/>
            </div>
        </>
    );
}