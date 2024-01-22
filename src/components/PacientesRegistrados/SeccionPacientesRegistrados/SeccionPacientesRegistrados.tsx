"use client";
import React, { useEffect, useState } from 'react';
import "./SeccionPacientesRegistrados.css"
import Link from 'next/link';

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
interface Busqueda {
    nombres: string;
    ap_paterno: string;
    ap_materno: string;
    doc_identidad: string;
}

export default function SeccionPacientesRegistrados() {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [dataPacientes, setDataPacientes] = useState<Paciente[]>([]);
    const [dataPaciente, setDataPaciente] = useState<Paciente | {}>({});
    const [busqueda, setBusqueda] = useState<Busqueda>({
        nombres: "",
        ap_paterno: "",
        ap_materno: "",
        doc_identidad: "",
    })

    useEffect(() => {
        getPacientes()
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
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pacientes/${id}`,
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
        setBusqueda((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };

    async function getPacientesBusqueda() {
        var parametros=""
        if(busqueda.ap_paterno!==""){
            parametros+="filters[ap_paterno][$eq]="+busqueda.ap_paterno+"&"
        }
        if(busqueda.ap_materno!==""){
            parametros+="filters[ap_materno][$eq]="+busqueda.ap_materno+"&"
        }
        if(busqueda.nombres!==""){
            parametros+="filters[nombres][$eq]="+busqueda.nombres+"&"
        }
        if(busqueda.doc_identidad!==""){
            parametros+="filters[doc_identidad][$eq]="+busqueda.doc_identidad+"&"
        }

        const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pacientes?${parametros}`,
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
    const handleSubmitBusqueda = async (e: React.FormEvent) => {
        e.preventDefault();
        getPacientesBusqueda()
    };
    return(
        <section className="pacientes-registrados">
            <div>
                <div className='herramientas'>
                    <form className="registro-paciente" onSubmit={handleSubmitBusqueda}>
                        <div className='registro-pagina'>
                            <div className='campos'>
                                <label htmlFor="ap_paterno">AP. PATERNO</label>
                                <input
                                    type="text"
                                    id="ap_paterno"
                                    name="ap_paterno"
                                    data-interface="formAtencion"
                                    value={busqueda.ap_paterno}
                                    maxLength={50}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos'>
                                <label htmlFor="ap_materno">AP. MATERNO</label>
                                <input
                                    type="text"
                                    id="ap_materno"
                                    name="ap_materno"
                                    data-interface="formAtencion"
                                    value={busqueda.ap_materno}
                                    maxLength={50}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos'>
                                <label htmlFor="nombres">NOMBRES</label>
                                <input
                                    type="text"
                                    id="nombres"
                                    name="nombres"
                                    data-interface="formAtencion"
                                    value={busqueda.nombres}
                                    maxLength={50}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos'>
                                <label htmlFor="doc_identidad">DOC. IDENTIDAD</label>
                                <input
                                    type="text"
                                    id="doc_identidad"
                                    name="doc_identidad"
                                    data-interface="formAtencion"
                                    value={busqueda.doc_identidad}
                                    maxLength={50}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='botones-form'>
                            <button className="hero-button" type="submit">Buscar</button>
                    </div>
                    </form>
                </div>
                <div className='tabla-contenedor'>
                    <table>
                        <thead>
                            <tr>
                                <th>Doc Identidad</th>
                                <th>Historial Clínico</th>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>Nombres</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Aquí deberías mapear sobre tus datos y crear una fila por cada paciente */}
                            {dataPacientes.map((paciente) => (
                                <tr key={paciente.id}>
                                    <td>{paciente.attributes.doc_identidad}</td>
                                    <td>{paciente.id}</td>
                                    <td>{paciente.attributes.ap_paterno}</td>
                                    <td>{paciente.attributes.ap_materno}</td>
                                    <td>{paciente.attributes.nombres}</td>
                                    <td>
                                        <ul>
                                            <li><Link href={`/ver-paciente?id=${paciente.id}`}>Ver</Link></li>
                                            <li><Link href={`/editar-paciente?id=${paciente.id}`}>Editar</Link></li>
                                            <li><Link href={`/atender-paciente?id=${paciente.id}`}>Ficha</Link></li>
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}