"use client"
import { Providers } from "./../../../app/providers";
import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useState } from 'react';
import SeccionRegistroClinico from "@/components/NuevoPaciente/SeccionRegistroClinico/SeccionRegistroClinico";
import "./SeccionRegistros.css";

export default function SeccionRegistros() {
    const { user } = useUser();

    if (!user) {
      // Manejar el caso en el que el usuario no está autenticado
      return (
        <div>
          
        </div>
      );
    }else{
        // Estado para almacenar los datos compartidos
        const [datosCompartidos, setDatosCompartidos] = useState<number>(0);
        
        // Función para actualizar los datos compartidos
        const actualizarDatosCompartidos = (nuevosDatos: React.SetStateAction<number>) => {
            setDatosCompartidos(nuevosDatos);
        };    
        return (
            <section className='registros'>
                <div className='registro-paciente-clinico-atencion'>
                    <SeccionRegistroClinico datosCompartidos={datosCompartidos} />
                </div>
            </section>
        );
    }
}