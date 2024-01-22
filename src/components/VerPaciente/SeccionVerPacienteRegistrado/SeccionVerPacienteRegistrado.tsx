"use client";
import React, { useEffect, useState } from 'react';
import "./SeccionVerPacienteRegistrado.css"
import Link from 'next/link';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
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

export default function SeccionPacientesRegistrados() {
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

    return(
        <section className="ver-paciente-registrado">
            <div className="formulario-contenedor">
            {existe ? (
                <div className="mensaje-envio">
                    <p>NO DATA</p>
                </div>
                ) : (
                <>
                <div className="registro-paciente">
                    <div className={`registro-titulo ${mostrarDiv === 'datos-paciente' ? '' : 'ocultar'}`}>
                        <h2>Datos del paciente</h2>
                    </div>
                    <div className={`registro-titulo ${mostrarDiv === 'datos-clinico' ? '' : 'ocultar'}`}>
                        <h2>Historial clinico</h2>
                    </div>
                    <div className={`registro-pagina ${mostrarDiv === 'datos-paciente' ? '' : 'ocultar'}`}>
                        <div className='campos-ver'>
                            <label htmlFor="ap_paterno">AP. PATERNO</label>
                            <input
                                type="text"
                                id="ap_paterno"
                                name="ap_paterno"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.ap_paterno}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="ap_materno">AP. MATERNO</label>
                            <input
                                type="text"
                                id="ap_materno"
                                name="ap_materno"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.ap_materno}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="nombres">NOMBRES</label>
                            <input
                                type="text"
                                id="nombres"
                                name="nombres"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.nombres}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="doc_identidad">DOC. IDENTIDAD</label>
                            <input
                                type="text"
                                id="doc_identidad"
                                name="doc_identidad"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.doc_identidad}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="genero">GENERO</label>
                            <input
                                type="text"
                                id="genero"
                                name="genero"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.genero}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="fec_nac">FEC. NAC. d/m/a</label>
                            <input
                                type="text"
                                id="fec_nac"
                                name="fec_nac"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.fec_nac_d_m_a?.toString()}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="edad">EDAD</label>
                            <input
                                type="text"
                                id="edad"
                                name="edad"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.edad !== null ? (dataPaciente as Paciente).attributes?.edad : ''}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="lugar_nac">LUGAR NAC</label>
                            <input
                                type="text"
                                id="lugar_nac"
                                name="lugar_nac"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.lugar_nac}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="ciudad">CIUDAD</label>
                            <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.ciudad}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="provincia">PROVINCIA</label>
                            <input
                                type="text"
                                id="provincia"
                                name="provincia"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.provincia}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="direccion">DIRECCIÓN</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.direccion}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="zona">ZONA</label>
                            <input
                                type="text"
                                id="zona"
                                name="zona"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.zona}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="telf_1">TELF 1</label>
                            <input
                                type="text"
                                id="telf_1"
                                name="telf_1"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.telf_1 ?? ''}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="telf_2">TELF 2</label>
                            <input
                                type="text"
                                id="telf_2"
                                name="telf_2"
                                data-interface="formPaciente"
                                value={(dataPaciente as Paciente).attributes?.telf_2 ?? ''}
                                disabled={true} />
                        </div>
                    </div>
                    <div className={`registro-pagina ${mostrarDiv === 'datos-clinico' ? '' : 'ocultar'}`}>
                        <div className='campos-ver'>
                            <label htmlFor="grado_de_instruccion">GRADO DE INSTRUCCION</label>
                            <input
                                type="text"
                                id="grado_de_instruccion"
                                name="grado_de_instruccion"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.grado_de_instruccion}
                                disabled={true}
                            />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="referencia">REFERENCIA</label>
                            <input
                                type="text"
                                id="referencia"
                                name="referencia"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.referencia || ''}
                                disabled={true}
                            />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="enviado_de">ENVIADO DE</label>
                            <input
                                type="text"
                                id="enviado_de"
                                name="enviado_de"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.enviado_de}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="seguro">SEGURO</label>
                            <input
                                type="text"
                                id="seguro"
                                name="seguro"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.seguro}
                                disabled={true}
                            />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="diagnostico_de_ingreso">DIAGNOSTICO DE INGRESO</label>
                            <input
                                type="text"
                                id="diagnostico_de_ingreso"
                                name="diagnostico_de_ingreso"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.diagnostico_de_ingreso}
                                disabled={true} />
                        </div>
                        <div className='campos-combinados'>
                            <h3>MEDICO QUE ORDENO INTERNACIÓN</h3>
                            <div>
                                <div className='campos-ver'>
                                    <label htmlFor="medico_que_ordeno_la_internacion-dr">DR.</label>
                                    <input
                                        type="text"
                                        id="medico_que_ordeno_la_internacion-dr"
                                        name="dr"
                                        data-interface="medico_que_ordeno_la_internacion"
                                        value={(dataMedico as Medico)?.dr}

                                        disabled={true} />
                                </div>
                                <div className='campos-ver'>
                                    <label htmlFor="medico_que_ordeno_la_internacion-matricula">MATRÍCULA</label>
                                    <input
                                        type="text"
                                        id="medico_que_ordeno_la_internacion-matricula"
                                        name="matricula"
                                        data-interface="medico_que_ordeno_la_internacion"
                                        value={(dataMedico as Medico)?.matricula}

                                        disabled={true} />
                                </div>
                            </div>
                        </div>
                        <div className='campos-acumulados'>
                            <h3>INGRESO - TRASLADO DURANTE LA HOSPITALIZACIÓN</h3>
                            {dataIngreso.map((ingreso, index) => (
                            <div className={`campos-combinados ref-${(ingreso as Ingreso).id}`}>
                                <h3>REF {index+1}</h3>
                                <div>
                                    <div className='campos-ver'>
                                        <label htmlFor="fecha_in">FECHA</label>
                                        <input
                                            type="text"
                                            id="fecha_in"
                                            name="fecha_in"
                                            data-interface="ingresos"
                                            data-pos={(ingreso as Ingreso).id}
                                            value={(ingreso as Ingreso)?.fecha_in?.toString()}
                                            disabled={true} />
                                    </div>
                                    <div className='campos-ver'>
                                        <label htmlFor="hora">HORA</label>
                                        <input
                                            type="time"
                                            id="hora"
                                            name="hora"
                                            data-interface="ingresos"
                                            data-pos={(ingreso as Ingreso).id}
                                            value={(ingreso as Ingreso)?.hora?.toString()}
                                            disabled={true} />
                                    </div>
                                    <div className='campos-ver'>
                                        <label htmlFor="servicio">SERVICIO</label>
                                        <input
                                            type="text"
                                            id="servicio"
                                            name="servicio"
                                            data-interface="ingresos"
                                            data-pos={(ingreso as Ingreso).id}
                                            value={(ingreso as Ingreso)?.servicio}
                                            disabled={true} />
                                    </div>
                                    <div className='campos-ver'>
                                        <label htmlFor="sala">SALA</label>
                                        <input
                                            type="text"
                                            id="sala"
                                            name="sala"
                                            data-interface="ingresos"
                                            data-pos={(ingreso as Ingreso).id}
                                            value={(ingreso as Ingreso)?.sala}
                                            disabled={true} />
                                    </div>
                                    <div className='campos-ver'>
                                        <label htmlFor="cama">CAMA</label>
                                        <input
                                            type="text"
                                            id="cama"
                                            name="cama"
                                            data-interface="ingresos"
                                            data-pos={(ingreso as Ingreso).id}
                                            value={(ingreso as Ingreso)?.cama}
                                            disabled={true} />
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
                                    <div className='campos-ver'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="diagnostico_principal"
                                            data-pos={(principal as Diagnostico_principal).id}
                                            value={(principal as Diagnostico_principal)?.descripcion}

                                            disabled={true} />
                                    </div>
                                    <div className='campos-ver'>
                                        <label htmlFor="nacodigome">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="diagnostico_principal"
                                            data-pos={(principal as Diagnostico_principal).id}
                                            value={(principal as Diagnostico_principal)?.codigo}

                                            disabled={true} />
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
                                    <div className='campos-ver'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="otros_diagnosticos"
                                            data-pos={(otros as Otros_diagnosticos).id}
                                            value={(otros as Otros_diagnosticos)?.descripcion}
                                            disabled={true} />
                                    </div>
                                    <div className='campos-ver'>
                                        <label htmlFor="codigo">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="otros_diagnosticos"
                                            data-pos={(otros as Otros_diagnosticos).id}
                                            value={(otros as Otros_diagnosticos)?.codigo}
                                            disabled={true} />
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
                                    <div className='campos-ver'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="operaciones"
                                            data-pos={(operacion as Operaciones).id}
                                            value={(operacion as Operaciones)?.descripcion}

                                            disabled={true} />
                                    </div>
                                    <div className='campos-ver'>
                                        <label htmlFor="codigo">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="operaciones"
                                            data-pos={(operacion as Operaciones).id}
                                            value={(operacion as Operaciones)?.codigo}

                                            disabled={true} />
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="causa_del_egreso">CAUSA DEL EGRESO</label>
                            <input
                                type="text"
                                id="causa_del_egreso"
                                name="causa_del_egreso"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.causa_del_egreso}
                                disabled={true}
                            />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="condicion_al_egreso">CONDICIÓN AL EGRESO</label>
                            <input
                                type="text"
                                id="condicion_al_egreso"
                                name="condicion_al_egreso"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.condicion_al_egreso}
                                disabled={true}
                            />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="dias_de_estadia">DIAS DE ESTADIA</label>
                            <input
                                type="text"
                                id="dias_de_estadia"
                                name="dias_de_estadia"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.dias_de_estadia}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="autopsia">AUTOPSIA</label>
                            <input
                                type="text"
                                id="autopsia"
                                name="autopsia"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.autopsia}
                                disabled={true}
                            />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="n_protocolo">N. PROTOCOLO</label>
                            <input
                                type="text"
                                id="n_protocolo"
                                name="n_protocolo"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.n_protocolo}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="fecha">FECHA</label>
                            <input
                                type="text"
                                id="fecha"
                                name="fecha_cl"
                                data-interface="formClinico"
                                value={(dataClinico as Clinico).attributes?.fecha.toString()}
                                disabled={true} />
                        </div>
                    </div>
                    <div className='botones-form'>
                        <a className="hero-button" onClick={() => cambiarDiv('datos-paciente')}>Datos personales</a>
                        <a className="hero-button" onClick={() => cambiarDiv('datos-clinico')}>Datos clinicos</a>
                    </div>
                </div>
                <div className="registro-paciente">
                    <div className='registro-titulo'>
                        <h2>Fichas de atencion</h2>
                    </div>
                    {[...dataAtencion].reverse().map((atencion, index) => (
                    <>
                    <div className='registro-titulo'>
                        <h3>Atencion ID - {(atencion as Atencion).id}</h3>
                    </div>
                    <div className='registro-pagina datos-atencion'>
                        <div className='campos-ver'>
                            <label htmlFor="n_ficha">N. FICHA</label>
                            <input
                                type="text"
                                id="n_ficha"
                                name="n_ficha"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(atencion as Atencion).attributes?.n_ficha}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="tipo_de_consulta">TIPO DE CONSULTA</label>
                            <input
                                type="text"
                                id="tipo_de_consulta"
                                name="tipo_de_consulta"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(atencion as Atencion).attributes?.tipo_de_consulta}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="fecha_de_consulta">FECHA DE CONSULTA</label>
                            <input
                                type="datetime"
                                id="fecha_de_consulta"
                                name="fecha_de_consulta"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(atencion as Atencion).attributes?.fecha_de_consulta ? (atencion as Atencion).attributes?.fecha_de_consulta.toLocaleString() : ""}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="servicio">SERVICIO</label>
                            <input
                                type="text"
                                id="servicio"
                                name="servicio"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(atencion as Atencion).attributes?.servicio}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="turno">TURNO</label>
                            <input
                                type="text"
                                id="turno"
                                name="turno"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(atencion as Atencion).attributes?.turno}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="tipo_paciente">TIPO DE PACIENTE</label>
                            <input
                                type="text"
                                id="tipo_paciente"
                                name="tipo_paciente"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(atencion as Atencion).attributes?.tipo_paciente}
                                disabled={true} />
                        </div>
                        {/*
                        <div className='campos-ver'>
                        <label htmlFor="paciente">PACIENTE</label>
                        <input
                            type="text"
                        id="paciente"
                        name="paciente"
                        data-interface="formAtencion"
                        data-pos={(atencion as Atencion).id}
                        disabled={true}
                        >
                        {id_paciente === 0 ? (
                        <>
                        <option value="">Selecciona una opción</option>
                        {dataPacientes.map((paciente) => (
                            <option key={paciente.id} value={paciente.id}>
                            {`${paciente.attributes?.ap_paterno} ${paciente.attributes?.ap_materno} ${paciente.attributes?.nombres}`}
                            </option>
                        ))}
                        </>
                        ) : (
                        <option value={(dataPaciente as Paciente).id}>
                        {`${(dataPaciente as Paciente).attributes?.ap_paterno} ${(dataPaciente as Paciente).attributes?.ap_materno} ${(dataPaciente as Paciente).attributes?.nombres}`}
                        </option>
                        )}
                        </select>
                        </div>
                        <div className='campos-ver'>
                        <label htmlFor="fec_nac_d_m_a">FECHA DE NACIMIENTO</label>
                        <input
                        type="text"
                        id="fec_nac_d_m_a"
                        name="fec_nac_d_m_a"
                        data-interface="formAtencion"
                        data-pos={(atencion as Atencion).id}
                        value={id_paciente > 0 ? (dataPaciente as Paciente).attributes?.fec_nac_d_m_a?.toString() : ""}
                        disabled={true}
                        />
                        </div>
                        */}
                        <div className='campos-ver'>
                            <label htmlFor="medico">MEDICO</label>
                            <input
                                type="text"
                                id="medico"
                                name="medico"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(dataAtencion[0] as Atencion).attributes?.medico}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="tipo_1">TIPO 1</label>
                            <input
                                type="text"
                                id="tipo_1"
                                name="tipo_1"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(dataAtencion[0] as Atencion).attributes?.tipo_1}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="tipo_2">TIPO 2</label>
                            <input
                                type="text"
                                id="tipo_2"
                                name="tipo_2"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(dataAtencion[0] as Atencion).attributes?.tipo_2}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="peso">PESO</label>
                            <input
                                type="text"
                                id="peso"
                                name="peso"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(dataAtencion[0] as Atencion).attributes?.peso}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="talla">TALLA</label>
                            <input
                                type="text"
                                id="talla"
                                name="talla"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(dataAtencion[0] as Atencion).attributes?.talla}
                                disabled={true} />
                        </div>
                        <div className='campos-ver'>
                            <label htmlFor="temperatura">TEMPERATURA</label>
                            <input
                                type="text"
                                id="temperatura"
                                name="temperatura"
                                data-interface="formAtencion"
                                data-pos={(atencion as Atencion).id}
                                value={(dataAtencion[0] as Atencion).attributes?.temperatura}
                                disabled={true} />
                        </div>
                    </div>
                    </>
                    ))}
                    <div className='botones-form'>
                    </div>
                </div>
                </>
            )}
            </div>
        </section>
    )
}