import React, { useContext, useEffect, useState } from 'react'
import style from '../../styles/formRegisterCancha.module.css'
import { useForm } from 'react-hook-form';
import {deportesConId, horas } from '../../utils/localidades';
import MapaPicker from './MapaPicker';
import { GlobalContext } from '../../context/globalContext';


import UploadImages from './UploadImages';
import axios from 'axios';



const CreateCanchas = ({setShowFormCreate, id=undefined}) => {
    const { createCancha, state } = useContext(GlobalContext);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [address, setAddress] = useState('');
    const [localidad, setLocalidad] = useState("");
    const [formData, setFormData] = useState({});
    const dias = [];
    const servicios = [];
    const urlMapa = selectedPosition ? "https://maps.google.com/?q=" + selectedPosition.lat + "," + selectedPosition.lng + "&z=14&output=embed" : ''
    const [showFormDataCancha, setShowFormDataCancha] = useState(true)
    const googleAPi = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    

    const setDirection = (e) => setAddress(e.replace(/ /g, '%20'))
    const seteLocalidad = (e) => setLocalidad(e.replace(/ /g, '%20'))
    
    useEffect(()=>{
        const direc = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&locality=${localidad}&key=${googleAPi}`;
        
        if (address !== "" && localidad !== "") {
            axios.get(direc)
            .then(res => {
                if (res.data.status === 'OK' && res.data.results.length > 0) {
                    const lat = res.data.results[0]?.geometry?.location?.lat;
                    const lng = res.data.results[0]?.geometry?.location?.lng;
                    
                    if (lat && lng) {
                        setSelectedPosition({ lat, lng });
                        console.log(`Lat: ${lat}, Lng: ${lng}`);
                    } else {
                        console.error('No se encontraron coordenadas en la respuesta');
                    }
                } else {
                    console.error('Geocoding falló o no devolvió resultados');
                }
            })
            .catch(err => {
                console.error('Error en la petición de geocoding:', err);
            });
        }
    }, [localidad, googleAPi, address]);
    
    
    const setearData = (data) => {
        const semana = [data.lunes, data.martes, data.miercoles, data.jueves, data.viernes, data.sabado, data.domingo]
        let aperturaComp = data.apertura
        let cierreComp = data.cierre
        if(parseInt(data.apertura) < 10) {aperturaComp = "0"+data.apertura}
        if(parseInt(data.cierre) < 10) {cierreComp = "0"+data.cierre}
        for(let i = 0; i<=semana.length; i++){
            if(semana[i]){
                dias.push({
                    idDay: i+1,
                    open: aperturaComp,
                    close: cierreComp
                })
            }
        }
        
        const listaServicios = [data.estacionamiento, data.vestuario, data.buffet]
        for(let i = 0; i<=listaServicios.length; i++){
            if(listaServicios[i]){
                servicios.push(i+1)
            }
        }



        const nuevaCancha = {
            pitchName: data.nombre,
            pitchDescription: data.descripcionDetail,
            pitchLocation: data.inputLocalidad,
            idSport: parseInt(data.deporte),
            pitchPricePerHour: parseInt(data.precio),
            pitchAddress: data.inputDireccion, 
            schedules: dias,
            idSurface: parseInt(data.superficie),
            pitchMapUrl: {
                mapUrl: urlMapa, 
                mapLatitude: String(selectedPosition.lat),
                mapLongitude: String(selectedPosition.lng)
            },
            idServices: servicios
        }
        createCancha(nuevaCancha)
        setShowFormDataCancha(false)
        // reset();
    };

    return (
        <> 
            {showFormDataCancha ?
                <form onSubmit={handleSubmit(setearData)} className={style.containerForm}>
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                        <label className={style.label}>Nombre</label>
                            <input
                                type="text"
                                placeholder="Nombre"
                                id="nombre"
                                className={style.inputField}
                                {...register("nombre", {
                                    required: {
                                        value: true,
                                        message: "El nombre es requerido",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "El mínimo que tiene que tener es de 3 caracteres",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "El máximo que tiene que tener es de 50 caracteres",
                                    },
                                })}
                            />
                        </div>
                        {errors.nombre && <span className={style.error}>{errors.nombre.message}</span>}
                    </div>
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                        <label className={style.label}>Descripción</label>
                            <textarea
                                type="text"
                                placeholder="Breve descripción de la cancha"
                                id="descripcionDetail"
                                className={`${style.inputField} ${style.inputDescripcion}`}
                                {...register("descripcionDetail", {
                                    required: {
                                        value: true,
                                        message: "La descripción de la cancha es requerida",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "El mínimo que tiene que tener es de 3 caracteres",
                                    },
                                    maxLength: {
                                        value: 500,
                                        message: "El máximo que tiene que tener es de 50 caracteres",
                                    },
                                })}
                            />
                        </div>
                        {errors.descripcionDetail && <span className={style.error}>{errors.descripcionDetail.message}</span>}
                    </div>
                    {/* <MapaPicker selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition} setAddress={setAddress} setLocalidad={setLocalidad}/> */}
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                        <label className={style.label}>Dirección</label>
                            <input
                                type="text"
                                placeholder="Direccion"
                                id="inputDireccion"
                                className={style.inputField}
                                {...register("inputDireccion", {
                                    required: {
                                        value: true,
                                        message: "La direccion es requerido",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "El mínimo que tiene que tener es de 3 caracteres",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "El máximo que tiene que tener es de 50 caracteres",
                                    },
                                })}
                                onBlur={(e)=>{setDirection(e.target.value)}}
                            />
                        </div>
                        {errors.inputDireccion && <span className={style.error}>{errors.inputDireccion.message}</span>}
                    </div>
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                        <label className={style.label}>Localidad</label>
                            <input
                                type="text"
                                placeholder="Localidad"
                                id="inputLocalidad"
                                className={style.inputField}
                                {...register("inputLocalidad", {
                                    required: {
                                        value: true,
                                        message: "La localidad es requerida",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "El mínimo que tiene que tener es de 3 caracteres",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "El máximo que tiene que tener es de 50 caracteres",
                                    },
                                })}
                                onBlur={(e)=>{seteLocalidad(e.target.value)}}
                            />
                        </div>
                        {errors.inputLocalidad && <span className={style.error}>{errors.inputLocalidad.message}</span>}
                    </div>
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                            <label className={style.label}>Deporte</label>
                            <select 
                            className={style.select}
                            {...register("deporte", { 
                                required: true 
                                })}>
                                    {deportesConId.map((deporte)=> <option key={deporte.id} value={deporte.id} className={style.option}>{deporte.name}</option>)}
                            </select>
                        </div>
                        {errors.deporte && <span className={style.error}>{errors.deporte.message}</span>}
                    </div>
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                            <label className={style.label}>Precio</label>
                            <input
                                type="number"
                                placeholder="Precio"
                                id="precio"
                                className={style.inputField}
                                {...register("precio", {
                                    required: {
                                        value: true,
                                        message: "El precio de la cancha es requerido",
                                    }, 
                                    min: {
                                        value: 1,
                                        message: "El valor minimo es 100",
                                    },
                                })}
                            />
                        </div>
                        {errors.precio && <span className={style.error}>{errors.precio.message}</span>}
                    </div>
                    <div className={style.inputModal}>
                        <p className={style.parrafo}>Horario de funcionamiento de la cancha</p>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor="lunes">Lunes</label>
                            <input className={style.checkbox} id="lunes" type="checkbox" {...register("lunes")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor="martes">Martes</label>
                            <input className={style.checkbox} id="martes" type="checkbox" {...register("martes")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor="miercoles">Miercoles</label>
                            <input className={style.checkbox} id="miercoles" type="checkbox" {...register("miercoles")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor="jueves">Jueves</label>
                            <input className={style.checkbox} id="jueves" type="checkbox" {...register("jueves")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor="viernes">Viernes</label>
                            <input className={style.checkbox} id="viernes" type="checkbox" {...register("viernes")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor="sabado">Sabado</label>
                            <input className={style.checkbox} id="sabado" type="checkbox" {...register("sabado")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor="domingo">Domingo</label>
                            <input className={style.checkbox} id="domingo" type="checkbox" {...register("domingo")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.label} htmlFor="apertura">Horario de apertura</label>
                            <select 
                                className={style.select}
                                {...register("apertura", {
                                    required: true
                                    })}>
                                {horas.map((hora, index)=> <option key={index} value={hora+":00"} className={style.option}>{hora}:00</option>)}
                            </select>
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.label} htmlFor="cierre">Horario de cierre</label>
                            <select 
                                className={style.select}
                                {...register("cierre", {
                                    required: true
                                    })}>
                                {horas.map((hora, index)=> <option key={index} value={hora+":00"} className={style.option}>{hora}:00</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                            <label className={style.label}>Superficie</label>
                            <select 
                                className={style.select}
                                {...register("superficie", {
                                    required: true
                                    })}>
                                {state.surfaces && 
                                state.surfaces.map((suelo)=> <option key={suelo.id} value={suelo.id} className={style.option}>{suelo.name}</option>)
                                }
                                <option value='5'>Madera</option>
                            </select>
                        </div>
                        {errors.deporte && <span className={style.error}>{errors.deporte.message}</span>}
                    </div>
                    <div className={style.inputModal}>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor='estacionamiento'>Estacionamiento</label>
                            <input className={style.checkbox}  id="estacionamiento" type="checkbox" {...register("estacionamiento")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor='vestuario'>Vestuario</label>
                            <input className={style.checkbox}  id='vestuario' type="checkbox" {...register("vestuario")} />
                        </div>
                        <div className={style.inputContainer}>
                            <label className={style.labelCheck} htmlFor='buffet'>Buffet</label>
                            <input className={style.checkbox}  id='buffet' type="checkbox" {...register("buffet")} />
                        </div>
                    </div>
                    <div className={style.inputModal}>
                    {/* <div className={`${style.inputContainer} ${style.imagesContainer}`}>
                            <label className={`${style.labelImages}`} htmlFor='fotos'>
                                <p>Cargar imagenes de la cancha y sus espacios</p>
                                <ImageSearchIcon className={style.icon}/>
                            </label>
                            <input className={style.inputImages} id="fotos" name='fotos' type="file" accept='image/*' multiple onChange={e =>{uploadImages(e)}} />
                    </div> */}
                    </div>
                    <div className={style.inputModal}>
                        <div className={style.buttonsContainer}>
                            <button type="button" className={style.cancelButton} onClick={()=>setShowFormCreate(false)}>Cancelar</button>
                            <button type="submit" className={style.submitButton}>Continuar</button>
                        </div>
                    </div>
                </form>
                :
                <UploadImages setShowFormDataCancha={setShowFormDataCancha} setShowFormCreate={setShowFormCreate}/>
            }
        </>
    )
}

export default CreateCanchas