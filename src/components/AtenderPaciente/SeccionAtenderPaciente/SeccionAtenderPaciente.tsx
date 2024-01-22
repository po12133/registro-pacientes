"use client";
import React, { useEffect, useState } from 'react';
import "./SeccionAtenderPaciente.css"

interface FormAtencion{
    paciente: number;
    historial_clinico: number;
    n_ficha: number;
    tipo_de_consulta: string;
    fecha_de_consulta: Date;
    servicio: string;
    turno: number;
    tipo_paciente: string;
    medico: string;
    tipo_1: string;
    tipo_2: string;
    peso: number;
    talla: number;
    temperatura: number;
}
interface Paciente {
    id: number;
    attributes: {
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        nombres: string;
        ap_paterno: string;
        ap_materno: string;
        doc_identidad: string;
        genero: string;
        fec_nac_d_m_a: string | null;
        edad: number;
        lugar_nac: string;
        ciudad: string;
        provincia: string;
        direccion: string;
        zona: string;
        telf_1: number | null;
        telf_2: number | null;
    };
}

export default function  SeccionAtenderPaciente(){
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [dataPacientes, setDataPacientes] = useState<Paciente[]>([]);
    const [dataPaciente, setDataPaciente] = useState<Paciente | {}>({});

    const [formAtencion, setFormAtencion] = useState<FormAtencion>({
        paciente: 0,
        historial_clinico: 0,
        n_ficha: 0,
        tipo_de_consulta: '',
        fecha_de_consulta: new Date(),
        servicio: '',
        turno: 0,
        tipo_paciente: '',
        medico: '',
        tipo_1: '',
        tipo_2: '',
        peso: 0,
        talla: 0,
        temperatura: 0,
    });
    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');
        if(id !== null){
            getPaciente(Number(id))
        }
    }, []);

    async function getPacientes() {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pacientes`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
            },
            cache: "no-store",
        }
        );
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data, ${response.status}`);
        }
        const data = await response.json();
        setDataPacientes(data.data)
    }
    async function getPaciente(id: number) {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pacientes/${id}?populate=*`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
            },
            cache: "no-store",
        }
        );
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data, ${response.status}`);
        }
        const data = await response.json();
        setDataPaciente(data.data)
        setFormAtencion((prevData) => ({ ...prevData, ["historial_clinico"]: data.data.attributes.historial_clinico?.data.id }));
    }

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
            if(interfaz === "formAtencion"){
                setFormAtencion((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const postAtencion = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/historial-de-atencions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
                    },
                    body: JSON.stringify({
                        data: {
                            paciente: (dataPaciente as Paciente).id,
                            historial_clinico: formAtencion.historial_clinico,
                            n_ficha: formAtencion.n_ficha,
                            tipo_de_consulta: formAtencion.tipo_de_consulta,
                            fecha_de_consulta: formAtencion.fecha_de_consulta,
                            servicio: formAtencion.servicio,
                            turno: formAtencion.turno,
                            tipo_paciente: formAtencion.tipo_paciente,
                            medico: formAtencion.medico,
                            tipo_1: formAtencion.tipo_1 === '' ? null : formAtencion.tipo_1,
                            tipo_2: formAtencion.tipo_2 === '' ? null : formAtencion.tipo_2,
                            peso: formAtencion.peso,
                            talla: formAtencion.talla,
                            temperatura: formAtencion.temperatura,
                        },
                    }),
                    cache: "no-store",
                }
            );
            if (postAtencion.status === 200) {
                setFormSubmitted(true);
            }
        } catch (error) {
          console.error('Error sending form data to Strapi:', error);
        }
    };
    return(
        <section className="formulario-registro-atencion">
            <div className="formulario-contenedor">
            {formSubmitted ? (
                <div className="mensaje-envio">
                    <p>¡Tu formulario ha sido enviado exitosamente!</p>
                </div>
                ) : (
                <form className="registro-paciente" onSubmit={handleSubmit}>
                    <div className='registro-pagina datos-atencion'>
                        <div className='campos'>
                            <label htmlFor="n_ficha">N. FICHA</label>
                            <input
                                type="number"
                                id="n_ficha"
                                name="n_ficha"
                                data-interface="formAtencion"
                                value={formAtencion.n_ficha}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="tipo_de_consulta">TIPO DE CONSULTA</label>
                            <input
                                type="text"
                                id="tipo_de_consulta"
                                name="tipo_de_consulta"
                                data-interface="formAtencion"
                                value={formAtencion.tipo_de_consulta}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="fecha_de_consulta">FECHA DE CONSULTA</label>
                            <input
                                type="datetime"
                                id="fecha_de_consulta"
                                name="fecha_de_consulta"
                                data-interface="formAtencion"
                                value={formAtencion.fecha_de_consulta
                                    ? formAtencion.fecha_de_consulta.toLocaleString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : ""}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="servicio">SERVICIO</label>
                            <input
                                type="text"
                                id="servicio"
                                name="servicio"
                                data-interface="formAtencion"
                                value={formAtencion.servicio}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="turno">TURNO</label>
                            <input
                                type="text"
                                id="turno"
                                name="turno"
                                data-interface="formAtencion"
                                value={formAtencion.turno}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="tipo_paciente">TIPO DE PACIENTE</label>
                            <input
                                type="text"
                                id="tipo_paciente"
                                name="tipo_paciente"
                                data-interface="formAtencion"
                                value={formAtencion.tipo_paciente}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="paciente">PACIENTE</label>
                            <input
                                type="text"
                                id="paciente"
                                name="paciente"
                                data-interface="formAtencion"
                                disabled={true}
                                value={`${(dataPaciente as Paciente).attributes?.ap_paterno} ${(dataPaciente as Paciente).attributes?.ap_materno} ${(dataPaciente as Paciente).attributes?.nombres}`}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="fec_nac_d_m_a">FECHA DE NACIMIENTO</label>
                            <input
                                type="text"
                                id="fec_nac_d_m_a"
                                name="fec_nac_d_m_a"
                                data-interface="formAtencion"
                                value={(dataPaciente as Paciente).attributes?.fec_nac_d_m_a?.toString()}
                                disabled={true}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="medico">MEDICO</label>
                            <input
                                type="text"
                                id="medico"
                                name="medico"
                                data-interface="formAtencion"
                                value={formAtencion.medico}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="tipo_1">TIPO 1</label>
                            <select
                                id="tipo_1"
                                name="tipo_1"
                                data-interface="formAtencion"
                                value={formAtencion.tipo_1}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="CANCELADO">CANCELADO</option>
                                <option value="RECONSULTA">RECONSULTA</option>
                                <option value="REFERIDO">REFERIDO</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="tipo_2">TIPO 2</label>
                            <select
                                id="tipo_2"
                                name="tipo_2"
                                data-interface="formAtencion"
                                value={formAtencion.tipo_2}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="T_SOCIAL">T_SOCIAL</option>
                                <option value="INTERC">INTERC</option>
                                <option value="DISCAP">DISCAP</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="peso">PESO</label>
                            <input
                                type="number"
                                id="peso"
                                name="peso"
                                data-interface="formAtencion"
                                value={formAtencion.peso}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="talla">TALLA</label>
                            <input
                                type="number"
                                id="talla"
                                name="talla"
                                data-interface="formAtencion"
                                value={formAtencion.talla}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="temperatura">TEMPERATURA</label>
                            <input
                                type="number"
                                id="temperatura"
                                name="temperatura"
                                data-interface="formAtencion"
                                value={formAtencion.temperatura}
                                maxLength={50}
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