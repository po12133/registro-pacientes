"use client"
import { Providers } from "./../../../app/providers";
import { useUser } from '@auth0/nextjs-auth0/client';
import Header from "@/components/Header/Header";
import SeccionVerPacienteRegistrado from "@/components/VerPaciente/SeccionVerPacienteRegistrado/SeccionVerPacienteRegistrado";

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
              <SeccionVerPacienteRegistrado/>
            </div>
        </Providers>
      );
    }
}
