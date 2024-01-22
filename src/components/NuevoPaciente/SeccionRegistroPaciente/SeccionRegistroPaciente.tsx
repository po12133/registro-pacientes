"use client";
import React, { useState } from 'react';
import "./SeccionRegistroPaciente.css"

interface FormPaciente {
    ap_paterno: string;
    ap_materno: string;
    nombres: string;
    doc_identidad: string;
    genero: string;
    fec_nac: Date;
    edad: number | null;
    lugar_nac: string;
    ciudad: string;
    provincia: string;
    direccion: string;
    zona: string;
    telf_1: number | null;
    telf_2: number | null;
}

type ActualizarDatosFunction = (datos: number) => void;

interface SeccionRegistroPacienteProps {
  actualizarDatos: ActualizarDatosFunction;
}

const SeccionRegistroPaciente: React.FC<SeccionRegistroPacienteProps> = ({ actualizarDatos }) => {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [formPaciente, setFormPaciente] = useState<FormPaciente>({
        ap_paterno: '',
        ap_materno: '',
        nombres: '',
        doc_identidad: '',
        genero: '',
        fec_nac: new Date(),
        edad: null,
        lugar_nac: '',
        ciudad: '',
        provincia: '',
        direccion: '',
        zona: '',
        telf_1: null,
        telf_2: null,
    })
    //actualizarDatos(3);
    const sanitizeText = (input: string): string => {
        return input.replace(/[^a-zA-Z0-9\s]/g, '');
    };
    const sanitizePhone = (input: string): string => {
        return input.replace(/[^0-9+()-]/g, '');
    };
    const sanitizeEmail = (input: string): string => {
        return input.trim();
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let sanitizedValue = value;

        if (type === 'text') {
            sanitizedValue = sanitizeText(value);
        } else if (name === 'phone') {
            sanitizedValue = sanitizePhone(value);
        } else if (name === 'email') {
            sanitizedValue = sanitizeEmail(value);
        }

        if (e.target.dataset.interface) {
            let interfaz = e.target.dataset.interface
            if(interfaz === "formPaciente"){
                setFormPaciente((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const postResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pacientes`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
              },
              body: JSON.stringify({
                data: {
                    nombres: formPaciente.nombres,
                    ap_paterno: formPaciente.ap_paterno,
                    ap_materno: formPaciente.ap_materno,
                    doc_identidad: formPaciente.doc_identidad,
                    genero: formPaciente.genero,
                    fec_nac: formPaciente.fec_nac,
                    edad: formPaciente.edad,
                    lugar_nac: formPaciente.lugar_nac,
                    ciudad: formPaciente.ciudad,
                    provincia: formPaciente.provincia,
                    direccion: formPaciente.direccion,
                    zona: formPaciente.zona,
                    telf_1: formPaciente.telf_1,
                    telf_2: formPaciente.telf_2,
                },
              }),
              cache: "no-store",
            }
          );
          if (postResponse.status === 200) {
            setFormSubmitted(true);
            const data_postResponse = await postResponse.json();
            actualizarDatos(data_postResponse.data.id);
          }
        } catch (error) {
          console.error('Error sending form data to Strapi:', error);
        }
      };
    return(
        <section className="formulario-registro-paciente">
            <div className="formulario-contenedor">
            {formSubmitted ? (
                <div className="mensaje-envio">
                    <p>¡Tu formulario ha sido enviado exitosamente!</p>
                </div>
                ) : (
                <form className="registro-paciente" onSubmit={handleSubmit}>
                    <div className='registro-pagina datos-paciente'>
                        <div className='campos'>
                            <label htmlFor="ap_paterno">AP. PATERNO</label>
                            <input
                                type="text"
                                id="ap_paterno"
                                name="ap_paterno"
                                data-interface="formPaciente"
                                value={formPaciente.ap_paterno}
                                maxLength={50}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="ap_materno">AP. MATERNO</label>
                            <input
                                type="text"
                                id="ap_materno"
                                name="ap_materno"
                                data-interface="formPaciente"
                                value={formPaciente.ap_materno}
                                maxLength={50}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="nombres">NOMBRES</label>
                            <input
                                type="text"
                                id="nombres"
                                name="nombres"
                                data-interface="formPaciente"
                                value={formPaciente.nombres}
                                maxLength={50}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="doc_identidad">DOC. IDENTIDAD</label>
                            <input
                                type="text"
                                id="doc_identidad"
                                name="doc_identidad"
                                data-interface="formPaciente"
                                value={formPaciente.doc_identidad}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="genero">GENERO</label>
                            <input
                                type="text"
                                id="genero"
                                name="genero"
                                data-interface="formPaciente"
                                value={formPaciente.genero}
                                maxLength={50}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="fec_nac">FEC. NAC. d/m/a</label>
                            <input
                                type="date"
                                id="fec_nac"
                                name="fec_nac"
                                data-interface="formPaciente"
                                value={formPaciente.fec_nac.toString()}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="edad">EDAD</label>
                            <input
                                type="number"
                                id="edad"
                                name="edad"
                                data-interface="formPaciente"
                                value={formPaciente.edad !== null ? formPaciente.edad : ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="lugar_nac">LUGAR NAC</label>
                            <input
                                type="text"
                                id="lugar_nac"
                                name="lugar_nac"
                                data-interface="formPaciente"
                                value={formPaciente.lugar_nac}
                                maxLength={50}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="ciudad">CIUDAD</label>
                            <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                data-interface="formPaciente"
                                value={formPaciente.ciudad}
                                maxLength={50}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="provincia">PROVINCIA</label>
                            <input
                                type="text"
                                id="provincia"
                                name="provincia"
                                data-interface="formPaciente"
                                value={formPaciente.provincia}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="direccion">DIRECCIÓN</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                data-interface="formPaciente"
                                value={formPaciente.direccion}
                                maxLength={50}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="zona">ZONA</label>
                            <input
                                type="text"
                                id="zona"
                                name="zona"
                                data-interface="formPaciente"
                                value={formPaciente.zona}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="telf_1">TELF 1</label>
                            <input
                                type="tel"
                                id="telf_1"
                                name="telf_1"
                                data-interface="formPaciente"
                                value={formPaciente.telf_1 !== null ? formPaciente.telf_1 : ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="telf_2">TELF 2</label>
                            <input
                                type="tel"
                                id="telf_2"
                                name="telf_2"
                                data-interface="formPaciente"
                                value={formPaciente.telf_2 !== null ? formPaciente.telf_2 : ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='botones-form'>
                        <button className="hero-button" type="submit">Enviar</button>
                    </div>
                </form>
            )}
            </div>
        </section>
    )
}

export default SeccionRegistroPaciente;