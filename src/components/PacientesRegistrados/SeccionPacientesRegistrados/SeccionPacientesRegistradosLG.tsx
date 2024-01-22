"use client"
import { Providers } from "./../../../app/providers";
import { useUser } from '@auth0/nextjs-auth0/client';
import Header from "@/components/Header/Header";
import SeccionPacientesRegistrados from "@/components/PacientesRegistrados/SeccionPacientesRegistrados/SeccionPacientesRegistrados";

export default function Acceso() {
    const { user } = useUser();

    if (!user) {
      // Manejar el caso en el que el usuario no está autenticado
      return (
        <div>
          
        </div>
      );
    }else{
      return (
        <Providers>
            <div>
              <SeccionPacientesRegistrados/>
            </div>
        </Providers>
      );
    }
}
