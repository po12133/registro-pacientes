"use client";
import React, { useEffect, useState } from 'react';
import "./SeccionRegistroClinico.css"

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

interface FormClinico {
    paciente: number;
    grado_de_instruccion: string;
    referencia: string | null;
    enviado_de: string;
    seguro: string;
    diagnostico_de_ingreso: string;
    causa_del_egreso: string;
    condicion_al_egreso: string;
    dias_de_estadia: number;
    autopsia: string;
    n_protocolo: string;
    fecha_cl: Date;
}
interface Medico_que_ordeno_la_internacion{
    dr: string;
    matricula: string;
};
interface Ingreso{
    fecha_in: Date;
    hora: Date;
    servicio: string;
    sala: string;
    cama: string;
};
interface Diagnostico_principal{
    descripcion: string;
    codigo: string;
};
interface Otros_diagnosticos{
    descripcion: string;
    codigo: string;
};
interface Operaciones{
    descripcion: string;
    codigo: string;
};
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
interface SeccionRegistroClinicoProps {
    datosCompartidos: number; // Puedes ajustar el tipo según tus necesidades
}
const SeccionRegistroClinico: React.FC<SeccionRegistroClinicoProps> = ({ datosCompartidos }) => {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [mostrarDiv, setMostrarDiv] = useState<'datos-paciente' | 'datos-atencion' | 'datos-clinico'>('datos-paciente');
    const cambiarDiv = (nuevoDiv: 'datos-paciente' | 'datos-atencion' | 'datos-clinico') => {setMostrarDiv(nuevoDiv);};
    const [dataPacientes, setDataPacientes] = useState<Paciente[]>([]);
    const [dataPaciente, setDataPaciente] = useState<Paciente | {}>({});
    const [id_paciente, setId_paciente] = useState<number>(0);

    const [formClinico, setFormClinico] = useState<FormClinico>({
        paciente: datosCompartidos,
        grado_de_instruccion: "NINGUNO",
        referencia: '',
        enviado_de: '',
        seguro: '',
        diagnostico_de_ingreso: '',
        causa_del_egreso: "HOSPITALARIA",
        condicion_al_egreso: "CURADO",
        dias_de_estadia: 0,
        autopsia: '',
        n_protocolo: '',
        fecha_cl: new Date(),
    });
    const [medico_que_ordeno_la_internacion, setMedico_que_ordeno_la_internacion] = useState<Medico_que_ordeno_la_internacion>({
        dr: '',
        matricula: '',
    })
    const [ingresos, setIngresos] = useState<{ [pos: string]: Ingreso }>({});

    const [diagnostico_principals, setDiagnostico_principals] = useState<{ [pos: string]: Diagnostico_principal }>({})

    const [otros_diagnosticos, setOtros_diagnosticos] = useState<{ [pos: string]: Otros_diagnosticos }>({})

    const [operaciones, setOperaciones] = useState<{ [pos: string]: Operaciones }>({})

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
    useEffect(() => {
        setId_paciente(datosCompartidos)
        if(datosCompartidos === 0){
            getPacientes();
        }else{
            getPaciente(datosCompartidos);
            setFormClinico((prevFormClinico) => ({
                ...prevFormClinico,
                paciente: datosCompartidos,
            }));
        }
    }, [datosCompartidos]);

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
        
        if (e.target.dataset.interface) {
            let interfaz = e.target.dataset.interface
            if(interfaz === "formPaciente"){
                setFormPaciente((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
            if(interfaz === "formClinico"){
                setFormClinico((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
            if(interfaz === "medico_que_ordeno_la_internacion"){
                setMedico_que_ordeno_la_internacion((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
            if (interfaz === "ingresos") {
                let pos = parseInt(e.target.dataset.pos || '0', 10).toString(); // Convertir la posición a una cadena
                setIngresos((prevData) => {
                    // Verificar si la posición existe en el objeto ingresos
                    if (prevData.hasOwnProperty(pos)) {
                        // Si la posición existe, clonar el ingreso en esa posición y actualizar el campo 'name'
                        return {
                            ...prevData,
                            [pos]: {
                                ...prevData[pos],
                                [name]: sanitizedValue,
                            },
                        };
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Ingreso = {
                            fecha_in: new Date(), // Fecha actual por defecto
                            hora: new Date(),  // Hora actual por defecto (puedes ajustar según necesites)
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
                        // Añadir el nuevo ingreso al objeto con la posición como clave
                        return {
                            ...prevData,
                            [pos]: nuevoIngreso,
                        };
                    }
                });
            }
            if(interfaz === "diagnostico_principal"){
                let pos = parseInt(e.target.dataset.pos || '0', 10).toString(); // Convertir la posición a una cadena
                setDiagnostico_principals((prevData) => {
                    // Verificar si la posición existe en el objeto ingresos
                    if (prevData.hasOwnProperty(pos)) {
                        // Si la posición existe, clonar el ingreso en esa posición y actualizar el campo 'name'
                        return {
                            ...prevData,
                            [pos]: {
                                ...prevData[pos],
                                [name]: sanitizedValue,
                            },
                        };
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Diagnostico_principal = {
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
                        return {
                            ...prevData,
                            [pos]: nuevoIngreso,
                        };
                    }
                });
            }
            if(interfaz === "otros_diagnosticos"){
                let pos = parseInt(e.target.dataset.pos || '0', 10).toString(); // Convertir la posición a una cadena
                setOtros_diagnosticos((prevData) => {
                    // Verificar si la posición existe en el objeto ingresos
                    if (prevData.hasOwnProperty(pos)) {
                        // Si la posición existe, clonar el ingreso en esa posición y actualizar el campo 'name'
                        return {
                            ...prevData,
                            [pos]: {
                                ...prevData[pos],
                                [name]: sanitizedValue,
                            },
                        };
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Otros_diagnosticos = {
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
                        return {
                            ...prevData,
                            [pos]: nuevoIngreso,
                        };
                    }
                });
            }
            if(interfaz === "operaciones"){
                let pos = parseInt(e.target.dataset.pos || '0', 10).toString(); // Convertir la posición a una cadena
                setOperaciones((prevData) => {
                    // Verificar si la posición existe en el objeto ingresos
                    if (prevData.hasOwnProperty(pos)) {
                        // Si la posición existe, clonar el ingreso en esa posición y actualizar el campo 'name'
                        return {
                            ...prevData,
                            [pos]: {
                                ...prevData[pos],
                                [name]: sanitizedValue,
                            },
                        };
                    } else {
                        // Si la posición no existe, crear un nuevo ingreso con valores predeterminados y actualizar el campo 'name'
                        const nuevoIngreso: Diagnostico_principal = {
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
                        return {
                            ...prevData,
                            [pos]: nuevoIngreso,
                        };
                    }
                });
            }
            if(interfaz === "formAtencion"){
                if (name === "paciente") {
                    // Supongamos que value es el ID del paciente que deseas buscar
                    const pacienteEncontrado = dataPacientes.find((paciente) => paciente.id === Number(value));
                    if (pacienteEncontrado) {
                      // Establecer el paciente encontrado como estado de dataPaciente
                      setDataPaciente(pacienteEncontrado);
                    }
                    setId_paciente(Number(pacienteEncontrado?.id))
                    setFormAtencion((prevData) => ({ ...prevData, ["fec_nac_d_m_a"]: pacienteEncontrado?.attributes?.fec_nac_d_m_a }));
                }
                setFormAtencion((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const postPaciente = await fetch(
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
            const data_postPaciente = await postPaciente.json();
            const postClinico = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/historial-clinicos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`
                    },
                    body: JSON.stringify({
                        data: {
                            paciente: data_postPaciente.data.id,
                            grado_de_instruccion: formClinico.grado_de_instruccion,
                            referencia: formClinico.referencia === '' ? null : formClinico.referencia,
                            enviado_de: formClinico.enviado_de,
                            seguro: formClinico.seguro === '' ? null : formClinico.seguro,
                            diagnostico_de_ingreso: formClinico.diagnostico_de_ingreso,
                            causa_del_egreso: formClinico.causa_del_egreso,
                            condicion_al_egreso: formClinico.condicion_al_egreso,
                            dias_de_estadia: formClinico.dias_de_estadia,
                            autopsia: formClinico.autopsia === '' ? null : formClinico.autopsia,
                            n_protocolo: formClinico.n_protocolo,
                            fecha: formClinico.fecha_cl,
                            medico_que_ordeno_la_internacion:{
                                dr: medico_que_ordeno_la_internacion.dr || null,
                                matricula: medico_que_ordeno_la_internacion.matricula || null,
                            },
                            ingreso:[
                                {
                                    fecha: ingresos[0]?.fecha_in || new Date(),
                                    hora: ingresos[0]?.hora
                                        ? ingresos[0]?.hora.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false, // Esto quita el AM/PM
                                        })
                                        : new Date().toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false,
                                        }),
                                    servicio: ingresos[0]?.servicio || null,
                                    sala: ingresos[0]?.sala || null,
                                    cama: ingresos[0]?.cama || null,
                                }                        
                            ],
                            diagnostico_principal:[
                                {
                                    descripcion: diagnostico_principals[0]?.descripcion || null,
                                    codigo: diagnostico_principals[0]?.codigo || null,
                                }
                            ],
                            otros_diagnosticos:[
                                {
                                descripcion: otros_diagnosticos[0]?.descripcion || null,
                                codigo: otros_diagnosticos[0]?.codigo || null,
                                }
                            ],
                            operaciones:[
                                {
                                descripcion: operaciones[0]?.descripcion || null,
                                codigo: operaciones[0]?.codigo || null,
                                }
                            ],
                        },
                    }),
                    cache: "no-store",
                }
            );
            const dataPostClinico = await postClinico.json();
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
                            paciente: data_postPaciente.data.id,
                            historial_clinico: dataPostClinico.data.id,
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
        <section className="formulario-registro-clinico-atencion">
            <div className="formulario-contenedor">
            {formSubmitted ? (
                <div className="mensaje-envio">
                    <p>¡Tu formulario ha sido enviado exitosamente!</p>
                </div>
                ) : (
                <form className="registro-paciente" onSubmit={handleSubmit}>
                    <div className={`registro-pagina ${mostrarDiv === 'datos-paciente' ? '' : 'ocultar'}`}>
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
                    <div className={`registro-pagina ${mostrarDiv === 'datos-clinico' ? '' : 'ocultar'}`}>
                        <div className='campos'>
                            <label htmlFor="grado_de_instruccion">GRADO DE INSTRUCCION</label>
                            <select
                                id="grado_de_instruccion"
                                name="grado_de_instruccion"
                                data-interface="formClinico"
                                value={formClinico.grado_de_instruccion}
                                onChange={handleChange}
                                required
                            >
                                <option value="NINGUNO" selected>NINGUNO</option>
                                <option value="A">A</option>
                                <option value="P">P</option>
                                <option value="S">S</option>
                                <option value="T">T</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="referencia">REFERENCIA</label>
                            <select
                                id="referencia"
                                name="referencia"
                                data-interface="formClinico"
                                value={formClinico.referencia || ''}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="enviado_de">ENVIADO DE</label>
                            <input
                                type="text"
                                id="enviado_de"
                                name="enviado_de"
                                data-interface="formClinico"
                                value={formClinico.enviado_de}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="seguro">SEGURO</label>
                            <select
                                id="seguro"
                                name="seguro"
                                data-interface="formClinico"
                                value={formClinico.seguro}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="P">P</option>
                                <option value="SEG">SEG</option>
                                <option value="ESP">ESP</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="diagnostico_de_ingreso">DIAGNOSTICO DE INGRESO</label>
                            <input
                                type="text"
                                id="diagnostico_de_ingreso"
                                name="diagnostico_de_ingreso"
                                data-interface="formClinico"
                                value={formClinico.diagnostico_de_ingreso}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos-combinados'>
                            <h3>MEDICO QUE ORDENO INTERNACIÓN</h3>
                            <div>
                                <div className='campos'>
                                    <label htmlFor="medico_que_ordeno_la_internacion-dr">DR.</label>
                                    <input
                                        type="text"
                                        id="medico_que_ordeno_la_internacion-dr"
                                        name="dr"
                                        data-interface="medico_que_ordeno_la_internacion"
                                        value={medico_que_ordeno_la_internacion.dr}
                                        maxLength={50}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='campos'>
                                    <label htmlFor="medico_que_ordeno_la_internacion-matricula">MATRÍCULA</label>
                                    <input
                                        type="text"
                                        id="medico_que_ordeno_la_internacion-matricula"
                                        name="matricula"
                                        data-interface="medico_que_ordeno_la_internacion"
                                        value={medico_que_ordeno_la_internacion.matricula}
                                        maxLength={50}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='campos-acumulados'>
                            <h3>INGRESO - TRASLADO DURANTE LA HOSPITALIZACIÓN</h3>
                            <div className='campos-combinados ref-0'>
                                <h3>REF 1</h3>
                                <div>
                                    <div className='campos'>
                                        <label htmlFor="fecha_in">FECHA</label>
                                        <input
                                            type="date"
                                            id="fecha_in"
                                            name="fecha_in"
                                            data-interface="ingresos"
                                            data-pos="0"
                                            value={ingresos[0]?.fecha_in?.toString()}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos'>
                                        <label htmlFor="hora">HORA</label>
                                        <input
                                            type="time"
                                            id="hora"
                                            name="hora"
                                            data-interface="ingresos"
                                            data-pos="0"
                                            value={ingresos[0]?.hora?.toString()}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos'>
                                        <label htmlFor="servicio">SERVICIO</label>
                                        <input
                                            type="text"
                                            id="servicio"
                                            name="servicio"
                                            data-interface="ingresos"
                                            data-pos="0"
                                            value={ingresos[0]?.servicio}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos'>
                                        <label htmlFor="sala">SALA</label>
                                        <input
                                            type="text"
                                            id="sala"
                                            name="sala"
                                            data-interface="ingresos"
                                            data-pos="0"
                                            value={ingresos[0]?.sala}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos'>
                                        <label htmlFor="cama">CAMA</label>
                                        <input
                                            type="text"
                                            id="cama"
                                            name="cama"
                                            data-interface="ingresos"
                                            data-pos="0"
                                            value={ingresos[0]?.cama}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='campos-acumulados'>
                            <h3>DiAGNOSTICO PRINCIPAL</h3>
                            <div className='campos-combinados dp-0'>
                                <h3>1</h3>
                                <div>
                                    <div className='campos'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="diagnostico_principal"
                                            value={diagnostico_principals[0]?.descripcion}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos'>
                                        <label htmlFor="nacodigome">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="diagnostico_principal"
                                            value={diagnostico_principals[0]?.codigo}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='campos-acumulados'>
                            <h3>OTROS DIAGNOSTICOS</h3>
                            <div className='campos-combinados od-1'>
                                <h3>1</h3>
                                <div>
                                    <div className='campos'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="otros_diagnosticos"
                                            value={otros_diagnosticos[0]?.descripcion}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos'>
                                        <label htmlFor="codigo">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="otros_diagnosticos"
                                            value={otros_diagnosticos[0]?.codigo}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='campos-acumulados'>
                            <h3>OPERACIONES</h3>
                            <div className='campos-combinados o-1'>
                                <h3>1</h3>
                                <div>
                                    <div className='campos'>
                                        <label htmlFor="descripcion">DESCRIPCIÓN</label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            name="descripcion"
                                            data-interface="operaciones"
                                            value={operaciones[0]?.descripcion}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='campos'>
                                        <label htmlFor="codigo">CODIGO</label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            data-interface="operaciones"
                                            value={operaciones[0]?.codigo}
                                            maxLength={50}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='campos'>
                            <label htmlFor="causa_del_egreso">CAUSA DEL EGRESO</label>
                            <select
                                id="causa_del_egreso"
                                name="causa_del_egreso"
                                data-interface="formClinico"
                                value={formClinico.causa_del_egreso}
                                onChange={handleChange}
                                required
                            >
                                <option value="HOSPITALARIA" selected>HOSPITALARIA</option>
                                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                                <option value="SOLICITADA">SOLICITADA</option>
                                <option value="FUGA">FUGA</option>
                                <option value="FALLECIDO">FALLECIDO</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="condicion_al_egreso">CONDICIÓN AL EGRESO</label>
                            <select
                                id="condicion_al_egreso"
                                name="condicion_al_egreso"
                                data-interface="formClinico"
                                value={formClinico.condicion_al_egreso}
                                onChange={handleChange}
                                required
                            >
                                <option value="CURADO" selected>CURADO</option>
                                <option value="MEJORADO">MEJORADO</option>
                                <option value="MISMO ESTADO">MISMO ESTADO</option>
                                <option value="INCURABLE">INCURABLE</option>
                                <option value="NO TRATADO">NO TRATADO</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="dias_de_estadia">DIAS DE ESTADIA</label>
                            <input
                                type="number"
                                id="dias_de_estadia"
                                name="dias_de_estadia"
                                data-interface="formClinico"
                                value={formClinico.dias_de_estadia}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="autopsia">AUTOPSIA</label>
                            <select
                                id="autopsia"
                                name="autopsia"
                                data-interface="formClinico"
                                value={formClinico.autopsia}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                        <div className='campos'>
                            <label htmlFor="n_protocolo">N. PROTOCOLO</label>
                            <input
                                type="text"
                                id="n_protocolo"
                                name="n_protocolo"
                                data-interface="formClinico"
                                value={formClinico.n_protocolo}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='campos'>
                            <label htmlFor="fecha">FECHA</label>
                            <input
                                type="date"
                                id="fecha"
                                name="fecha_cl"
                                data-interface="formClinico"
                                value={formClinico.fecha_cl.toString()}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className={`registro-pagina ${mostrarDiv === 'datos-atencion' ? '' : 'ocultar'}`}>
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
                                type="date"
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
                        {/*
                        <div className='campos'>
                            <label htmlFor="paciente">PACIENTE</label>
                            <select
                                id="paciente"
                                name="paciente"
                                data-interface="formAtencion"
                                onChange={handleChange}
                                required
                            >
                            {id_paciente === 0 ? (
                                <>
                                <option value="">Selecciona una opción</option>
                                {dataPacientes.map((paciente) => (
                                    <option key={paciente.id} value={paciente.id}>
                                    {`${paciente.attributes.ap_paterno} ${paciente.attributes.ap_materno} ${paciente.attributes.nombres}`}
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
                        <div className='campos'>
                            <label htmlFor="fec_nac_d_m_a">FECHA DE NACIMIENTO</label>
                            <input
                                type="date"
                                id="fec_nac_d_m_a"
                                name="fec_nac_d_m_a"
                                data-interface="formAtencion"
                                value={id_paciente > 0 ? (dataPaciente as Paciente).attributes?.fec_nac_d_m_a?.toString() : ""}
                                maxLength={50}
                                onChange={handleChange}
                            />
                        </div>
                        */}
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
                        <a className="hero-button" onClick={() => cambiarDiv('datos-paciente')}>Datos personales</a>
                        <a className="hero-button" onClick={() => cambiarDiv('datos-clinico')}>Datos clinicos</a>
                        <a className="hero-button" onClick={() => cambiarDiv('datos-atencion')}>Ficha de atención</a>
                        <button className="hero-button" type="submit">Enviar</button>
                    </div>
                </form>
            )}
            </div>
        </section>
    )
}
export default SeccionRegistroClinico;