"use client";
import React, { useEffect, useState } from 'react';
import "./SeccionEditarPaciente.css"
import Link from 'next/link';
import { useUrl } from 'nextjs-current-url';

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
interface Clinico {
    id: number;
    attributes: {
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        condicion_al_egreso: string;
        grado_de_instruccion: string;
        referencia: string;
        enviado_de: string;
        seguro: string;
        diagnostico_de_ingreso: string;
        autopsia: string;
        n_protocolo: string;
        fecha: string;
        causa_del_egreso: string;
        dias_de_estadia: number;
    };
}
interface Medico{
    id: number;
    dr: string;
    matricula: string;
};
interface Ingreso{
    id: number;
    fecha_in: Date;
    hora: Date;
    servicio: string;
    sala: string;
    cama: string;
};
interface Diagnostico_principal{
    id: number;
    descripcion: string;
    codigo: string;
};
interface Otros_diagnosticos{
    id: number;
    descripcion: string;
    codigo: string;
};
interface Operaciones{
    id: number;
    descripcion: string;
    codigo: string;
};
interface Atencion {
    id: number;
    attributes: {
        n_ficha: number;
        tipo_de_consulta: string;
        fecha_de_consulta: string;
        servicio: string;
        turno: number;
        tipo_paciente: string;
        medico: string;
        tipo_1: string;
        tipo_2: string;
        peso: number;
        talla: number;
        temperatura: number;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}

export default function SeccionEditarPaciente() {
    const [existe, setExiste] = useState<boolean>(false);
    const [dataPacientes, setDataPacientes] = useState<Paciente[]>([]);
    const [dataPaciente, setDataPaciente] = useState<Paciente | {}>({});

    const [dataClinico, setDataClinico] = useState<Clinico | {}>({});
    const [dataMedico, setDataMedico] = useState<Medico | {}>({});

    const [dataIngreso, setDataIngreso] = useState<Ingreso[]>([]);
    const [dataDiagnostico_principal, setDataDiagnostico_principal] = useState<Diagnostico_principal[]>([]);
    const [dataOtros_diagnosticos, setDataOtros_diagnosticos] = useState<Otros_diagnosticos[]>([]);
    const [dataOperaciones, setDataOperaciones] = useState<Operaciones[]>([]);
    const [dataAtencion, setDataAtencion] = useState<Atencion[]>([]);

    const [mostrarDiv, setMostrarDiv] = useState<'datos-paciente' | 'datos-clinico'>('datos-paciente');
    const cambiarDiv = (nuevoDiv: 'datos-paciente' | 'datos-clinico') => {setMostrarDiv(nuevoDiv);};
    const { href: currentUrl, pathname } = useUrl() ?? {};
    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');
        if(id !== null){
            getPaciente(Number(id))
        }
    }, []);
    async function getPaciente(id: number) {
        const responsePaciente = await fetch(
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
            if (responsePaciente.status !== 200) {
                setExiste(true)
                //throw new Error(`Failed to fetch data, ${responsePaciente.status}`);
            }else{
                const dataResponsePaciente = await responsePaciente.json();

                setDataPaciente(dataResponsePaciente.data)
                setDataAtencion(dataResponsePaciente.data?.attributes.historial_de_atencions.data)
                const responseClinico = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/historial-clinicos/${dataResponsePaciente.data?.attributes.historial_clinico.data?.id}?populate=*`,
                    {
                        method: "GET",
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
                        },
                        cache: "no-store",
                    }
                );
                if (responseClinico.status !== 200) {
                    //throw new Error(`Failed to fetch data, ${responseClinico.status}`);
                }else{
                    const dataResponseClinico = await responseClinico.json();

                    setDataClinico(dataResponseClinico.data)
                    setDataMedico(dataResponseClinico.data.attributes.medico_que_ordeno_la_internacion)
                    setDataIngreso(dataResponseClinico.data.attributes.ingreso)
                    setDataDiagnostico_principal(dataResponseClinico.data.attributes.diagnostico_principal)
                    setDataOtros_diagnosticos(dataResponseClinico.data.attributes.otros_diagnosticos)
                    setDataOperaciones(dataResponseClinico.data.attributes.operaciones)
                }
            }
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
        } else if (type === 'number') {
            sanitizedValue = sanitizePhone(value);
        } else if (name === 'email') {
            sanitizedValue = sanitizeEmail(value);
        }
        
        if (e.target.dataset.interface) {
            let interfaz = e.target.dataset.interface
            if(interfaz === "formPaciente"){
                setDataPaciente((prevData) => {
                    const newDataPaciente = { ...prevData };    
                    // Asegúrate de que attributes exista
                    (newDataPaciente as Paciente).attributes = (newDataPaciente as Paciente).attributes || {};               
                    // Modifica la propiedad específica en attributes
                    switch (name) {
                        case "ap_paterno":
                            (newDataPaciente as Paciente).attributes.ap_paterno = sanitizedValue;
                            break;
                        case "ap_materno":
                            (newDataPaciente as Paciente).attributes.ap_materno = sanitizedValue;
                            break;
                        case "nombres":
                            (newDataPaciente as Paciente).attributes.nombres = sanitizedValue;
                            break;
                        case "doc_identidad":
                            (newDataPaciente as Paciente).attributes.doc_identidad = sanitizedValue;
                            break;
                        case "genero":
                            (newDataPaciente as Paciente).attributes.genero = sanitizedValue;
                            break;
                        case "fec_nac_d_m_a":
                            (newDataPaciente as Paciente).attributes.fec_nac_d_m_a = sanitizedValue;
                            break;
                        case "edad":
                            (newDataPaciente as Paciente).attributes.edad = Number(sanitizedValue);
                            break;
                        case "lugar_nac":
                            (newDataPaciente as Paciente).attributes.lugar_nac = sanitizedValue;
                            break;
                        case "ciudad":
                            (newDataPaciente as Paciente).attributes.ciudad = sanitizedValue;
                            break;
                        case "provincia":
                            (newDataPaciente as Paciente).attributes.provincia = sanitizedValue;
                            break;
                        case "direccion":
                            (newDataPaciente as Paciente).attributes.direccion = sanitizedValue;
                            break;
                        case "zona":
                            (newDataPaciente as Paciente).attributes.zona = sanitizedValue;
                            break;
                        case "telf_1":
                            (newDataPaciente as Paciente).attributes.telf_1 = Number(sanitizedValue);
                            break;
                        case "telf_2":
                            (newDataPaciente as Paciente).attributes.telf_2 = Number(sanitizedValue);
                            break;
                        default:
                            break;
                    }                
                    return (newDataPaciente as Paciente);
                  });
            }
            if(interfaz === "formClinico"){
                setDataClinico((prevData) => {
                    const newDataClinico = { ...prevData };    
                    // Asegúrate de que attributes exista
                    (newDataClinico as Clinico).attributes = (newDataClinico as Clinico).attributes || {};               
                    // Modifica la propiedad específica en attributes
                    switch (name) {
                        case "grado_de_instruccion":
                            (newDataClinico as Clinico).attributes.grado_de_instruccion = sanitizedValue;
                            break;
                        case "referencia":
                            (newDataClinico as Clinico).attributes.referencia = sanitizedValue;
                            break;
                        case "enviado_de":
                            (newDataClinico as Clinico).attributes.enviado_de = sanitizedValue;
                            break;
                        case "seguro":
                            (newDataClinico as Clinico).attributes.seguro = sanitizedValue;
                            break;
                        case "diagnostico_de_ingreso":
                            (newDataClinico as Clinico).attributes.diagnostico_de_ingreso = sanitizedValue;
                            break;
                        case "causa_del_egreso":
                            (newDataClinico as Clinico).attributes.causa_del_egreso = sanitizedValue;
                            break;
                        case "condicion_al_egreso":
                            (newDataClinico as Clinico).attributes.condicion_al_egreso = sanitizedValue;
                            break;
                        case "dias_de_estadia":
                            (newDataClinico as Clinico).attributes.dias_de_estadia = Number(sanitizedValue);
                            break;
                        case "autopsia":
                            (newDataClinico as Clinico).attributes.autopsia = sanitizedValue;
                            break;
                        case "n_protocolo":
                            (newDataClinico as Clinico).attributes.n_protocolo = sanitizedValue;
                            break;
                        case "fecha_cl":
                            (newDataClinico as Clinico).attributes.fecha = sanitizedValue;
                            break;
                        default:
                            break;
                    }                
                    return (newDataClinico as Clinico);
                  });
            }
            if(interfaz === "medico_que_ordeno_la_internacion"){
                setDataMedico((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
            if (interfaz === "ingresos") {
                let pos = Number(parseInt(e.target.dataset.pos || '0', 10).toString());
                setDataIngreso((prevData) => {
                    // Verificar si la posición existe en el array ingresos
                    const newDataIngreso = [...prevData];
                    if (prevData.hasOwnProperty(pos)) {
                        newDataIngreso[pos] = {
                            ...newDataIngreso[pos],
                            [name]: sanitizedValue,
                        };
                        return newDataIngreso;
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Ingreso = {
                            id: pos,
                            fecha_in: new Date(), // Fecha actual por defecto
                            hora: new Date(),  // Hora actual por defecto (ajusta según necesites)
                            servicio: '',
                            sala: '',
                            cama: '',
                        };
                        switch (name) {
                            case 'fecha_in':
                                nuevoIngreso.fecha_in = new Date(sanitizedValue);
                                break;
                            case 'hora':
                                nuevoIngreso.hora = new Date(sanitizedValue);
                                break;
                            case 'servicio':
                                nuevoIngreso.servicio = sanitizedValue;
                                break;
                            case 'sala':
                                nuevoIngreso.sala = sanitizedValue;
                                break;
                            case 'cama':
                                nuevoIngreso.cama = sanitizedValue;
                                break;
                            // Agrega más casos según tus necesidades
                            default:
                                break;
                        }
                        // Añadir el nuevo ingreso al array y devolver el nuevo array
                        newDataIngreso.push(nuevoIngreso);
                        return newDataIngreso;
                    }
                });
            }
            if(interfaz === "diagnostico_principal"){
                let pos = Number(parseInt(e.target.dataset.pos || '0', 10).toString()); // Convertir la posición a una cadena
                setDataDiagnostico_principal((prevData) => {
                    const newDataIngreso = [...prevData];
                    // Verificar si la posición existe en el objeto ingresos
                    if (prevData.hasOwnProperty(pos)) {
                        // Si la posición existe, clonar el ingreso en esa posición y actualizar el campo 'name'
                        newDataIngreso[pos] = {
                            ...newDataIngreso[pos],
                            [name]: sanitizedValue,
                        };
                        return newDataIngreso;
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Diagnostico_principal = {
                            id: pos,
                            descripcion: '',
                            codigo: '',
                        };
                        switch (name) {
                            case 'descripcion':
                                nuevoIngreso.descripcion = sanitizedValue;
                                break;
                            case 'codigo':
                                nuevoIngreso.codigo = sanitizedValue;
                                break;
                            // Agrega más casos según tus necesidades
                        
                            default:
                                break;
                        }
                        // Añadir el nuevo ingreso al objeto con la posición como clave
                        newDataIngreso.push(nuevoIngreso);
                        return newDataIngreso;
                    }
                });
            }
            if(interfaz === "otros_diagnosticos"){
                let pos = Number(parseInt(e.target.dataset.pos || '0', 10).toString()); // Convertir la posición a una cadena
                setDataOtros_diagnosticos((prevData) => {
                    const newDataIngreso = [...prevData];
                    // Verificar si la posición existe en el objeto ingresos
                    if (prevData.hasOwnProperty(pos)) {
                        // Si la posición existe, clonar el ingreso en esa posición y actualizar el campo 'name'
                        newDataIngreso[pos] = {
                            ...newDataIngreso[pos],
                            [name]: sanitizedValue,
                        };
                        return newDataIngreso;
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Otros_diagnosticos = {
                            id: pos,
                            descripcion: '',
                            codigo: '',
                        };
                        switch (name) {
                            case 'descripcion':
                                nuevoIngreso.descripcion = sanitizedValue;
                                break;
                            case 'codigo':
                                nuevoIngreso.codigo = sanitizedValue;
                                break;
                            // Agrega más casos según tus necesidades
                        
                            default:
                                break;
                        }
                        // Añadir el nuevo ingreso al objeto con la posición como clave
                        newDataIngreso.push(nuevoIngreso);
                        return newDataIngreso;
                    }
                });
            }
            if(interfaz === "operaciones"){
                let pos = Number(parseInt(e.target.dataset.pos || '0', 10).toString()); // Convertir la posición a una cadena
                setDataOperaciones((prevData) => {
                    const newDataIngreso = [...prevData];
                    // Verificar si la posición existe en el objeto ingresos
                    if (prevData.hasOwnProperty(pos)) {
                        // Si la posición existe, clonar el ingreso en esa posición y actualizar el campo 'name'
                        newDataIngreso[pos] = {
                            ...newDataIngreso[pos],
                            [name]: sanitizedValue,
                        };
                        return newDataIngreso;
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Diagnostico_principal = {
                            id: pos,
                            descripcion: '',
                            codigo: '',
                        };
                        switch (name) {
                            case 'descripcion':
                                nuevoIngreso.descripcion = sanitizedValue;
                                break;
                            case 'codigo':
                                nuevoIngreso.codigo = sanitizedValue;
                                break;
                            // Agrega más casos según tus necesidades
                        
                            default:
                                break;
                        }
                        // Añadir el nuevo ingreso al objeto con la posición como clave
                        newDataIngreso.push(nuevoIngreso);
                        return newDataIngreso;
                    }
                });
            }
            if(interfaz === "formAtencion"){
                let pos = Number(parseInt(e.target.dataset.pos || '0', 10).toString());
                setDataAtencion((prevData) => {
                    // Verificar si la posición existe en el array ingresos
                    const newDataIngreso = [...prevData];
                    if (prevData.hasOwnProperty(pos)) {
                        const newDataAtencion = newDataIngreso[pos];    
                        // Asegúrate de que attributes exista
                        (newDataAtencion as Atencion).attributes = (newDataAtencion as Atencion).attributes || {};               
                        // Modifica la propiedad específica en attributes
                        switch (name) {
                            case "n_ficha":
                                (newDataAtencion as Atencion).attributes.n_ficha = Number(sanitizedValue);
                                break;
                            case "tipo_de_consulta":
                                (newDataAtencion as Atencion).attributes.tipo_de_consulta = sanitizedValue;
                                break;
                            case "fecha_de_consulta":
                                (newDataAtencion as Atencion).attributes.fecha_de_consulta = sanitizedValue;
                                break;
                            case "servicio":
                                (newDataAtencion as Atencion).attributes.servicio = sanitizedValue;
                                break;
                            case "turno":
                                (newDataAtencion as Atencion).attributes.turno = Number(sanitizedValue);
                                break;
                            case "tipo_paciente":
                                (newDataAtencion as Atencion).attributes.tipo_paciente = sanitizedValue;
                                break;
                            case "medico":
                                (newDataAtencion as Atencion).attributes.medico = sanitizedValue;
                                break;
                            case "tipo_1":
                                (newDataAtencion as Atencion).attributes.tipo_1 = sanitizedValue;
                                break;
                            case "tipo_2":
                                (newDataAtencion as Atencion).attributes.tipo_2 = sanitizedValue;
                                break;
                            case "peso":
                                (newDataAtencion as Atencion).attributes.peso = Number(sanitizedValue);
                                break;
                            case "talla":
                                (newDataAtencion as Atencion).attributes.talla = Number(sanitizedValue);
                                break;
                            case "temperatura":
                                (newDataAtencion as Atencion).attributes.temperatura = Number(sanitizedValue);
                                break;
                            default:
                                break;
                        }             
                        newDataIngreso[pos] = newDataAtencion 
                        return newDataIngreso;
                    }else{
                        return prevData;
                    }
                });
            }
        }
    };
    const handleSubmitPaciente = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const postPaciente = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pacientes/${(dataPaciente as Paciente).id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
                    },
                    body: JSON.stringify({
                        data: {
                            nombres: (dataPaciente as Paciente).attributes.nombres,
                            ap_paterno: (dataPaciente as Paciente).attributes.ap_paterno,
                            ap_materno: (dataPaciente as Paciente).attributes.ap_materno,
                            doc_identidad: (dataPaciente as Paciente).attributes.doc_identidad,
                            genero: (dataPaciente as Paciente).attributes.genero,
                            fec_nac: (dataPaciente as Paciente).attributes.fec_nac_d_m_a,
                            edad: (dataPaciente as Paciente).attributes.edad,
                            lugar_nac: (dataPaciente as Paciente).attributes.lugar_nac,
                            ciudad: (dataPaciente as Paciente).attributes.ciudad,
                            provincia: (dataPaciente as Paciente).attributes.provincia,
                            direccion: (dataPaciente as Paciente).attributes.direccion,
                            zona: (dataPaciente as Paciente).attributes.zona,
                            telf_1: (dataPaciente as Paciente).attributes.telf_1,
                            telf_2: (dataPaciente as Paciente).attributes.telf_2,
                        },
                    }),
                    cache: "no-store",
                }
            );
        } catch (error) {
          console.error('Error sending form data to Strapi:', error);
        }
    };
    const handleSubmitClinico = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const postPaciente = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/historial-clinicos/${(dataClinico as Clinico).id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
                    },
                    body: JSON.stringify({
                        data: {
                            grado_de_instruccion: (dataClinico as Clinico).attributes.grado_de_instruccion,
                            referencia: (dataClinico as Clinico).attributes.referencia === '' ? null : (dataClinico as Clinico).attributes.referencia,
                            enviado_de: (dataClinico as Clinico).attributes.enviado_de,
                            seguro: (dataClinico as Clinico).attributes.seguro === '' ? null : (dataClinico as Clinico).attributes.seguro,
                            diagnostico_de_ingreso: (dataClinico as Clinico).attributes.diagnostico_de_ingreso,
                            causa_del_egreso: (dataClinico as Clinico).attributes.causa_del_egreso,
                            condicion_al_egreso: (dataClinico as Clinico).attributes.condicion_al_egreso,
                            dias_de_estadia: (dataClinico as Clinico).attributes.dias_de_estadia,
                            autopsia: (dataClinico as Clinico).attributes.autopsia === '' ? null : (dataClinico as Clinico).attributes.autopsia,
                            n_protocolo: (dataClinico as Clinico).attributes.n_protocolo,
                            fecha: (dataClinico as Clinico).attributes.fecha,
                            medico_que_ordeno_la_internacion:{
                                dr: (dataMedico as Medico).dr || null,
                                matricula: (dataMedico as Medico).matricula || null,
                            },
                            ingreso:dataIngreso.map((ingreso) => ({
                                id: ingreso.id,
                                fecha: ingreso.fecha_in || new Date(),
                                hora: ingreso?.hora
                                ? ingreso?.hora + ':00'  // Añadir ':00' para tener un formato completo "HH:mm:ss"
                                : new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false,
                                    }),
                                servicio: ingreso.servicio || null,
                                sala: ingreso.sala || null,
                                cama: ingreso.cama || null,
                              })),
                            diagnostico_principal:dataDiagnostico_principal.map((principal) => ({
                                id: principal.id,
                                descripcion: principal.descripcion || null,
                                codigo: principal.codigo || null,
                            })),
                            otros_diagnosticos:dataOtros_diagnosticos.map((otros) => ({
                                id: otros.id,
                                descripcion: otros.descripcion || null,
                                codigo: otros.codigo || null,
                            })),
                            operaciones:dataOperaciones.map((operacion) => ({
                                id: operacion.id,
                                descripcion: operacion.descripcion || null,
                                codigo: operacion.codigo || null,
                            })),
                        },
                    }),
                    cache: "no-store",
                }
            );
        } catch (error) {
          console.error('Error sending form data to Strapi:', error);
        }
    };
    const handleSubmitAtencion = async (e: React.FormEvent, id : number, pos : number) => {
        e.preventDefault();

        try {
            const postPaciente = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/historial-de-atencions/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
                    },
                    body: JSON.stringify({
                        data: {
                            n_ficha: (dataAtencion[pos] as Atencion).attributes.n_ficha,
                            tipo_de_consulta: (dataAtencion[pos] as Atencion).attributes.tipo_de_consulta,
                            fecha_de_consulta: (dataAtencion[pos] as Atencion).attributes.fecha_de_consulta,
                            servicio: (dataAtencion[pos] as Atencion).attributes.servicio,
                            turno: (dataAtencion[pos] as Atencion).attributes.turno,
                            tipo_paciente: (dataAtencion[pos] as Atencion).attributes.tipo_paciente,
                            medico: (dataAtencion[pos] as Atencion).attributes.medico,
                            tipo_1: (dataAtencion[pos] as Atencion).attributes.tipo_1 === '' ? null : (dataAtencion[pos] as Atencion).attributes.tipo_1,
                            tipo_2: (dataAtencion[pos] as Atencion).attributes.tipo_2 === '' ? null : (dataAtencion[pos] as Atencion).attributes.tipo_2,
                            peso: (dataAtencion[pos] as Atencion).attributes.peso,
                            talla: (dataAtencion[pos] as Atencion).attributes.talla,
                            temperatura: (dataAtencion[pos] as Atencion).attributes.temperatura,
                        },
                    }),
                    cache: "no-store",
                }
            );
        } catch (error) {
          console.error('Error sending form data to Strapi:', error);
        }
    };

    return(
        <section className="editar-paciente-registrado">
            <div className="formulario-contenedor">
            {existe ? (
                <div className="mensaje-envio">
                    <p>NO DATA</p>
                </div>
                ) : (
                <>
                <form className="registro-paciente" onSubmit={handleSubmitPaciente}>
                    <div className='registro-titulo'>
                        <h2>Datos del paciente</h2>
                    </div>
                    <div className='registro-pagina datos-atencion'>
                        <div className='campos-editar'>
                            <label htmlFor="ap_paterno">AP. PATERNO</label>
                            <input
                                type="text"
                                id="ap_paterno"
                                name="ap_paterno"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.ap_paterno}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="ap_materno">AP. MATERNO</label>
                            <input
                                type="text"
                                id="ap_materno"
                                name="ap_materno"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.ap_materno}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="nombres">NOMBRES</label>
                            <input
                                type="text"
                                id="nombres"
                                name="nombres"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.nombres}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="doc_identidad">DOC. IDENTIDAD</label>
                            <input
                                type="text"
                                id="doc_identidad"
                                name="doc_identidad"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.doc_identidad}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="genero">GENERO</label>
                            <input
                                type="text"
                                id="genero"
                                name="genero"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.genero}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="fec_nac">FEC. NAC. d/m/a</label>
                            <input
                                type="date"
                                id="fec_nac"
                                name="fec_nac"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.fec_nac_d_m_a?.toString()}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="edad">EDAD</label>
                            <input
                                type="number"
                                id="edad"
                                name="edad"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.edad !== null ? (dataPaciente as Paciente).attributes?.edad : ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="lugar_nac">LUGAR NAC</label>
                            <input
                                type="text"
                                id="lugar_nac"
                                name="lugar_nac"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.lugar_nac}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="ciudad">CIUDAD</label>
                            <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.ciudad}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="provincia">PROVINCIA</label>
                            <input
                                type="text"
                                id="provincia"
                                name="provincia"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.provincia}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="direccion">DIRECCIÓN</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.direccion}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="zona">ZONA</label>
                            <input
                                type="text"
                                id="zona"
                                name="zona"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.zona}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="telf_1">TELF 1</label>
                            <input
                                type="tel"
                                id="telf_1"
                                name="telf_1"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.telf_1 ?? ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="telf_2">TELF 2</label>
                            <input
                                type="tel"
                                id="telf_2"
                                name="telf_2"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.telf_2 ?? ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='botones-form'>
                        <button className="hero-button" type="submit">Guardar cambios del paciente</button>
                    </div>
                </form>
                <form className="registro-paciente" onSubmit={handleSubmitClinico}>
                    <div className='registro-titulo'>
                        <h2>Historial clinico</h2>
                    </div>
                    <div className='registro-pagina datos-atencion'>
                        <div className='campos-editar'>
                            <label htmlFor="grado_de_instruccion">GRADO DE INSTRUCCION</label>
                            <select
                                id="grado_de_instruccion"
                                name="grado_de_instruccion"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.grado_de_instruccion}
                                onChange={handleChange}
                            >
                             <option value="NINGUNO" selected>NINGUNO</option>
                                <option value="A">A</option>
                                <option value="P">P</option>
                                <option value="S">S</option>
                                <option value="T">T</option>
                            </select>
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="referencia">REFERENCIA</label>
                            <select
                                id="referencia"
                                name="referencia"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.referencia || ''}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="enviado_de">ENVIADO DE</label>
                            <input
                                type="text"
                                id="enviado_de"
                                name="enviado_de"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.enviado_de}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="seguro">SEGURO</label>
                            <select
                                id="seguro"
                                name="seguro"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.seguro}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="P">P</option>
                                <option value="SEG">SEG</option>
                                <option value="ESP">ESP</option>
                            </select>
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="diagnostico_de_ingreso">DIAGNOSTICO DE INGRESO</label>
                            <input
                                type="text"
                                id="diagnostico_de_ingreso"
                                name="diagnostico_de_ingreso"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.diagnostico_de_ingreso}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-combinados'>
                            <h3>MEDICO QUE ORDENO INTERNACIÓN</h3>
                            <div>
                                <div className='campos-editar'>
                                    <label htmlFor="medico_que_ordeno_la_internacion-dr">DR.</label>
                                    <input
                                        type="text"
                                        id="medico_que_ordeno_la_internacion-dr"
                                        name="dr"
                                        data-interface="medico_que_ordeno_la_internacion"
                                        value={(dataMedico as Medico)?.dr}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='campos-editar'>
                                    <label htmlFor="medico_que_ordeno_la_internacion-matricula">MATRÍCULA</label>
                                    <input
                                        type="text"
                                        id="medico_que_ordeno_la_internacion-matricula"
                                        name="matricula"
                                        data-interface="medico_que_ordeno_la_internacion"
                                        value={(dataMedico as Medico)?.matricula}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='campos-acumulados'>
                            <h3>INGRESO - TRASLADO DURANTE LA HOSPITALIZACIÓN</h3>
                            {Array.isArray(dataIngreso) && dataIngreso.map((ingreso, index) => (
                            <div className={`campos-combinados ref-${(ingreso as Ingreso).id}`}>
                                <h3>REF {index+1}</h3>
                                <div>
                                    <div className='campos-editar'>
                                        <label htmlFor="fecha_in">FECHA</label>
                                        <input
                                            type="date"
                                            id="fecha_in"
                                            name="fecha_in"
                                            data-interface="ingresos"
                                            data-pos={index}
                                            value={(ingreso as Ingreso)?.fecha_in?.toString()}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos-editar'>
                                        <label htmlFor="hora">HORA</label>
                                        <input
                                            type="time"
                                            id="hora"
                                            name="hora"
                                            data-interface="ingresos"
                                            data-pos={index}
                                            value={(ingreso as Ingreso)?.hora?.toString()}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos-editar'>
                                        <label htmlFor="servicio">SERVICIO</label>
                                        <input
                                            type="text"
                                            id="servicio"
                                            name="servicio"
                                            data-interface="ingresos"
                                            data-pos={index}
                                            value={(ingreso as Ingreso)?.servicio}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos-editar'>
                                        <label htmlFor="sala">SALA</label>
                                        <input
                                            type="text"
                                            id="sala"
                                            name="sala"
                                            data-interface="ingresos"
                                            data-pos={index}
                                            value={(ingreso as Ingreso)?.sala}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos-editar'>
                                        <label htmlFor="cama">CAMA</label>
                                        <input
                                            type="text"
                                            id="cama"
                                            name="cama"
                                            data-interface="ingresos"
                                            data-pos={index}
                                            value={(ingreso as Ingreso)?.cama}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className='campos-acumulados'>
                            <h3>DiAGNOSTICO PRINCIPAL</h3>
                            {dataDiagnostico_principal.map((principal, index) => (
                            <div className={`campos-combinados dp-${(principal as Diagnostico_principal).id}`}>
                                <h3>{index+1}</h3>
                                <div>
                                    <div className='campos-editar'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="diagnostico_principal"
                                            data-pos={index}
                                            value={(principal as Diagnostico_principal)?.descripcion}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos-editar'>
                                        <label htmlFor="nacodigome">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="diagnostico_principal"
                                            data-pos={index}
                                            value={(principal as Diagnostico_principal)?.codigo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className='campos-acumulados'>
                            <h3>OTROS DIAGNOSTICOS</h3>
                            {dataOtros_diagnosticos.map((otros, index) => (
                            <div className={`campos-combinados dp-${(otros as Otros_diagnosticos).id}`}>
                                <h3>{index+1}</h3>
                                <div>
                                    <div className='campos-editar'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="otros_diagnosticos"
                                            data-pos={index}
                                            value={(otros as Otros_diagnosticos)?.descripcion}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos-editar'>
                                        <label htmlFor="codigo">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="otros_diagnosticos"
                                            data-pos={index}
                                            value={(otros as Otros_diagnosticos)?.codigo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className='campos-acumulados'>
                            <h3>OPERACIONES</h3>
                            {dataOperaciones.map((operacion, index) => (
                            <div className={`campos-combinados dp-${(operacion as Operaciones).id}`}>
                                <h3>{index+1}</h3>
                                <div>
                                    <div className='campos-editar'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="operaciones"
                                            data-pos={index}
                                            value={(operacion as Operaciones)?.descripcion}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos-editar'>
                                        <label htmlFor="codigo">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="operaciones"
                                            data-pos={index}
                                            value={(operacion as Operaciones)?.codigo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="causa_del_egreso">CAUSA DEL EGRESO</label>
                            <select
                                id="causa_del_egreso"
                                name="causa_del_egreso"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.causa_del_egreso}
                                onChange={handleChange}
                            >
                                <option value="HOSPITALARIA" selected>HOSPITALARIA</option>
                                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                                <option value="SOLICITADA">SOLICITADA</option>
                                <option value="FUGA">FUGA</option>
                                <option value="FALLECIDO">FALLECIDO</option>
                            </select>
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="condicion_al_egreso">CONDICIÓN AL EGRESO</label>
                            <select
                                id="condicion_al_egreso"
                                name="condicion_al_egreso"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.condicion_al_egreso}
                                onChange={handleChange}
                            >
                                <option value="CURADO" selected>CURADO</option>
                                <option value="MEJORADO">MEJORADO</option>
                                <option value="MISMO ESTADO">MISMO ESTADO</option>
                                <option value="INCURABLE">INCURABLE</option>
                                <option value="NO TRATADO">NO TRATADO</option>
                            </select>
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="dias_de_estadia">DIAS DE ESTADIA</label>
                            <input
                                type="number "
                                id="dias_de_estadia"
                                name="dias_de_estadia"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.dias_de_estadia}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="autopsia">AUTOPSIA</label>
                            <select
                                id="autopsia"
                                name="autopsia"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.autopsia}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="n_protocolo">N. PROTOCOLO</label>
                            <input
                                type="text"
                                id="n_protocolo"
                                name="n_protocolo"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.n_protocolo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-editar'>
                            <label htmlFor="fecha">FECHA</label>
                            <input
                                type="date"
                                id="fecha"
                                name="fecha_cl"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.fecha.toString()}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='botones-form'>
                        <button className="hero-button" type="submit">Guardar cambios del historial clinico</button>
                    </div>
                </form>
                <div className="registro-paciente">
                    <div className='registro-titulo'>
                        <h2>Fichas de atencion</h2>
                    </div>
                    {dataAtencion.map((atencion, index) => (
                    <form className="registro-paciente atencion" onSubmit={(e) => handleSubmitAtencion(e, (dataAtencion[dataAtencion.length-index-1] as Atencion).id, dataAtencion.length-index-1)}>
                        <div className='registro-titulo'>
                            <h3>Atencion ID - {(dataAtencion[dataAtencion.length-index-1] as Atencion).id}</h3>
                        </div>
                        <div className='registro-pagina datos-atencion'>
                            <div className='campos-editar'>
                                <label htmlFor="n_ficha">N. FICHA</label>
                                <input
                                    type="number"
                                    id="n_ficha"
                                    name="n_ficha"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.n_ficha}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="tipo_de_consulta">TIPO DE CONSULTA</label>
                                <input
                                    type="text"
                                    id="tipo_de_consulta"
                                    name="tipo_de_consulta"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.tipo_de_consulta}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="fecha_de_consulta">FECHA DE CONSULTA</label>
                                <input
                                    type="text"
                                    value={(dataAtencion[dataAtencion.length - index - 1] as Atencion).attributes.fecha_de_consulta
                                        ? new Date((dataAtencion[dataAtencion.length - index - 1] as Atencion).attributes.fecha_de_consulta).toLocaleString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : ""}
                                    readOnly
                                    onChange={handleChange}
                                />
                                {/* Input oculto para almacenar el valor real en formato datetime-local */}
                                <input
                                    type="datetime-local"
                                    id="fecha_de_consulta"
                                    name="fecha_de_consulta"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length - index - 1}
                                    value={(dataAtencion[dataAtencion.length - index - 1] as Atencion).attributes.fecha_de_consulta
                                        ? new Date((dataAtencion[dataAtencion.length - index - 1] as Atencion).attributes.fecha_de_consulta).toLocaleString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="servicio">SERVICIO</label>
                                <input
                                    type="text"
                                    id="servicio"
                                    name="servicio"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.servicio}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="turno">TURNO</label>
                                <input
                                    type="text"
                                    id="turno"
                                    name="turno"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.turno}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="tipo_paciente">TIPO DE PACIENTE</label>
                                <input
                                    type="text"
                                    id="tipo_paciente"
                                    name="tipo_paciente"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.tipo_paciente}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="paciente">PACIENTE</label>
                                <input
                                    type="text"
                                    id="paciente"
                                    name="paciente"
                                    data-interface="formAtencion"
                                    value={`${(dataPaciente as Paciente).attributes?.ap_paterno} ${(dataPaciente as Paciente).attributes?.ap_materno} ${(dataPaciente as Paciente).attributes?.nombres}`}
                                    disabled={true}
                                />
                            </div>
                            <div className='campos-editar'>
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
                            <div className='campos-editar'>
                                <label htmlFor="medico">MEDICO</label>
                                <input
                                    type="text"
                                    id="medico"
                                    name="medico"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.medico}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="tipo_1">TIPO 1</label>
                                <select
                                    id="tipo_1"
                                    name="tipo_1"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.tipo_1}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="CANCELADO">CANCELADO</option>
                                    <option value="RECONSULTA">RECONSULTA</option>
                                    <option value="REFERIDO">REFERIDO</option>
                                </select>
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="tipo_2">TIPO 2</label>
                                <select
                                    id="tipo_2"
                                    name="tipo_2"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.tipo_2}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="T_SOCIAL">T_SOCIAL</option>
                                    <option value="INTERC">INTERC</option>
                                    <option value="DISCAP">DISCAP</option>
                                </select>
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="peso">PESO</label>
                                <input
                                    type="number"
                                    id="peso"
                                    name="peso"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.peso}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="talla">TALLA</label>
                                <input
                                    type="number"
                                    id="talla"
                                    name="talla"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.talla}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='campos-editar'>
                                <label htmlFor="temperatura">TEMPERATURA</label>
                                <input
                                    type="number"
                                    id="temperatura"
                                    name="temperatura"
                                    data-interface="formAtencion"
                                    data-pos={dataAtencion.length-index-1}
                                    value={(dataAtencion[dataAtencion.length-index-1] as Atencion).attributes?.temperatura}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='botones-form'>
                            <button className="hero-button" type="submit">Guardar cambios de ficha de atencion - {(dataAtencion[dataAtencion.length-index-1] as Atencion).id}</button>
                        </div>
                    </form>
                    ))}

                </div>
                </>
            )}
            </div>
        </section>
    )
}