"use client";
import React, { useState } from 'react';
import SeccionRegistroClinico from "@/components/NuevoPaciente/SeccionRegistroClinico/SeccionRegistroClinico";
import "./SeccionRegistros.css";

export default function SeccionRegistros() {
    // Estado para almacenar los datos compartidos
    const [datosCompartidos, setDatosCompartidos] = useState<number>(0);
    const [mostrarDiv, setMostrarDiv] = useState<'registro-paciente-clinico-atencion' | 'registro-clinico-atencion' | 'registro-atencion' | 'pacientes-registrados' | 'clinicos-registrados' | 'fichas-registradas'>('registro-paciente-clinico-atencion');

    const cambiarDiv = (nuevoDiv: 'registro-paciente-clinico-atencion' | 'registro-clinico-atencion' | 'registro-atencion' | 'pacientes-registrados' | 'clinicos-registrados' | 'fichas-registradas') => {setMostrarDiv(nuevoDiv);};
    // Función para actualizar los datos compartidos
    const actualizarDatosCompartidos = (nuevosDatos: React.SetStateAction<number>) => {
        setDatosCompartidos(nuevosDatos);
    };    
    return (
        <section className='registros'>
            <section className='menu-secundario'>
                <div className='pestañas-botones'>
                        <a onClick={() => cambiarDiv('registro-paciente-clinico-atencion')}>Nuevo paciente</a>
                        <a onClick={() => cambiarDiv('registro-clinico-atencion')}>Registrar historial clinico</a>
                        <a onClick={() => cambiarDiv('registro-atencion')}>Registrar ficha de atención</a>
                        <a onClick={() => cambiarDiv('pacientes-registrados')}>Pacientes</a>
                        <a onClick={() => cambiarDiv('clinicos-registrados')}>Historial clinicos</a>
                        <a onClick={() => cambiarDiv('fichas-registradas')}>Fichas de atención</a>
                </div>
            </section>
            <div className={`${mostrarDiv === 'registro-paciente-clinico-atencion' ? '' : 'ocultar'}`}>
                <SeccionRegistroClinico datosCompartidos={datosCompartidos} />
            </div>
        </section>
    );
}