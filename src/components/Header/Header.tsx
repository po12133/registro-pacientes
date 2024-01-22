"use client"
import React, { useState } from 'react';
import "./Header.css";
import Link from 'next/link';
import { Providers } from "./../../app/providers";
import { useUser } from '@auth0/nextjs-auth0/client';

export default function RegistroPaciente(){
    const { user } = useUser();

    if (!user) {
      // Manejar el caso en el que el usuario no está autenticado
      return (
        <Providers>
            <header className='header'>
                <div>
                    <a href="/api/auth/login">Login</a>
                </div>
                <section className='menu-secundario'>
                    <div className='pestañas-botones'>

                    </div>  
                </section>
            </header>
        </Providers>
      );
    }else{
        return (
            <Providers>
                <header className='header'>
                    <div>
                        <a>{user.nickname}</a>
                        <a href="/api/auth/logout">Salir</a>
                    </div>
                    <section className='menu-secundario'>
                        <div className='pestañas-botones'>
                            <Link href={"/nuevo-paciente"}>Nuevo paciente</Link>
                            <Link href={"/pacientes-registrados"}>Pacientes</Link>
                        </div>  
                    </section>
                </header>
            </Providers>
        );
    }
}