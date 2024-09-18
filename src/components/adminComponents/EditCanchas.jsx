import React, { useContext, useEffect, useState } from 'react'
import style from '../../styles/formRegisterCancha.module.css'
import { useForm } from 'react-hook-form';
import {deportesConId, horas } from '../../utils/localidades';
import MapaPicker from './MapaPicker';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { GlobalContext } from '../../context/globalContext';
import UpdateImages from './UpdateImages';


const EditCanchas = ({setShowFormEdit}) => {
    const { state, updateCancha, uploadImages } = useContext(GlobalContext);
    const [images, setImages] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [direccion, setDireccion] = useState(state.pitchDetail.pitchAddress)
    const [localidad, setLocalidad] = useState(state.pitchDetail.pitchLocation)


    const dias = {
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false
    }
    const dayMapping = {
        "Lunes": "lunes",
        "Martes": "martes",
        "Miércoles": "miercoles",
        "Jueves": "jueves",
        "Viernes": "viernes",
        "Sábado": "sabado",
        "Domingo": "domingo"
    };
    state.pitchDetail.schedules.forEach((dia) => {
        const key = dayMapping[dia.dayName];
        if (key) {
            dias[key] = true;
        }
    });


    const servicios = {
        estacionamiento: false,
        vestuario: false,
        buffet: false
    }
    const servMapping = {
        "Servicio A": "estacionamiento",
        "Servicio B": "vestuario",
        "Servicio C": "buffet"
    }

    state.pitchDetail.services.forEach((serv) => {
        const key = servMapping[serv.serviceName];
        if (key) {
            servicios[key] = true;
        }
    });
 
    const onSubmit = (data) => {
        const dias = [];
        const servicios = [];
        const semana = [data.lunes, data.martes, data.miercoles, data.jueves, data.viernes, data.sabado, data.domingo]
        let aperturaComp = data.apertura
        let cierreComp = data.cierre
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
                pitchLocation: localidad,
                idSport: parseInt(data.deporte),
                pitchPricePerHour: parseInt(data.precio),
                pitchAddress: direccion, 
                schedules: dias,
                idSurface: parseInt(data.superficie),
                pitchMapUrl: {
                    mapUrl: state.pitchDetail.pitchMapUrl.mapUrl, 
                    mapLatitude: state.pitchDetail.pitchMapUrl.mapLatitude,
                    mapLongitude: state.pitchDetail.pitchMapUrl.mapLongitude
                },
                idServices: servicios
        }
        updateCancha(nuevaCancha, state.pitchDetail.id)
        uploadImages(images)
        setShowFormEdit(false)
    };

  return (
    <> 
        <div className={style.inputModal}>
            <div className={style.inputContainer}>
                    {state.pitchDetail.imagePaths.map((image, index) => (
                        <div className={style.imagesContainer} key={index}>
                        <span className={style.buttonDeleteImage} id={image} key={"img"+index} onClick={(e)=>console.log(
                            `Imagen eliminada:
                            id cancha ${state.pitchDetail.id}
                            nombre cancha ${state.pitchDetail.pitchName}
                            index imagen ${index}
                            url imagen ${image}
                            `
                        )}>
                            <HighlightOffIcon/>
                        </span>
                        <span className={style.buttonDownloadImage} id={image} key={"img"+index} onClick={()=>{window.open(image, '_blank');}}>
                            <FileDownloadIcon/>
                        </span>
                            <img
                                className={style.imageDetail}
                                key={index}
                                src={image}
                                alt={`upload-${index}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                                />
                        </div>
                    ))}
            </div>
        <UpdateImages setImages={setImages}/>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={style.containerForm}>
            <div className={style.inputModal}>
                <div className={style.inputContainer}>
                <label className={style.label}>Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        id="nombre"
                        className={style.inputField}
                        defaultValue={state.pitchDetail.pitchName}
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
                        placeholder="Descripción"
                        id="descripcionDetail"
                        className={`${style.inputField} ${style.inputDescripcion}`}
                        defaultValue={state.pitchDetail.pitchDescription}
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
                                message: "El máximo que tiene que tener es de 500 caracteres",
                            },
                        })}
                    />
                </div>
                {errors.descripcionDetail && <span className={style.error}>{errors.descripcionDetail.message}</span>}
            </div>
            <div className={style.inputModal}>
                <div className={style.inputContainer}>
                <label className={style.label}>Dirección</label>
                    <input
                        type="text"
                        placeholder="Dirección"
                        id="dirección"
                        className={style.inputField}
                        defaultValue={state.pitchDetail.pitchAddress}
                        {...register("direccion", {
                            required: {
                                value: true,
                                message: "La dirección de la cancha es requerida",
                            },
                            minLength: {
                                value: 3,
                                message: "El mínimo que tiene que tener es de 3 caracteres",
                            },
                            maxLength: {
                                value: 100,
                                message: "El máximo que tiene que tener es de 80 caracteres",
                            },
                        })}
                        onBlur={(e)=>{setDireccion(e.target.value)}}
                    />
                </div>
                {errors.direccion && <span className={style.error}>{errors.direccion.message}</span>}
            </div>
            <div className={style.inputModal}>
                <div className={style.inputContainer}>
                <label className={style.label}>Localidad</label>
                    <input
                        type="text"
                        placeholder="localidad"
                        id="localidad"
                        defaultValue={state.pitchDetail.pitchLocation}
                        className={style.inputField}
                        {...register("localidad", {
                            required: {
                                value: true,
                                message: "La localidad de la cancha es requerida",
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
                        onBlur={(e)=>{setLocalidad(e.target.value)}}
                    />
                </div>
                {errors.localidad && <span className={style.error}>{errors.localidad.message}</span>}
            </div>
            <div className={style.inputModal}>
                <div className={style.inputContainer}>
                    <label className={style.label}>Deporte</label>
                    <select
                    className={style.select}
                    defaultValue={state.pitchDetail.sport.sportId} 
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
                        defaultValue={state.pitchDetail.pitchPricePerHour}
                        {...register("precio", {
                            required: {
                                value: true,
                                message: "El precio de la cancha es requerido",
                            }, 
                            min: {
                                value: 1,
                                message: "El valor minimo es 1",
                            },
                        })}
                    />
                </div>
                {errors.precio && <span className={style.error}>{errors.precio.message}</span>}
            </div>
            <div className={style.inputModal}>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor="lunes">Lunes</label>
                    <input className={style.checkbox} id="lunes" type="checkbox" {...register("lunes")} defaultChecked={dias.lunes}/>
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor="martes">Martes</label>
                    <input className={style.checkbox} id="martes" type="checkbox" {...register("martes")} defaultChecked={dias.martes}/>
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor="miercoles">Miércoles</label>
                    <input className={style.checkbox} id="miercoles" type="checkbox" {...register("miercoles")} defaultChecked={dias.miercoles}/>
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor="jueves">Jueves</label>
                    <input className={style.checkbox} id="jueves" type="checkbox" {...register("jueves")} defaultChecked={dias.jueves}/>
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor="viernes">Viernes</label>
                    <input className={style.checkbox} id="viernes" type="checkbox" {...register("viernes")} defaultChecked={dias.viernes}/>
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor="sabado">Sábado</label>
                    <input className={style.checkbox} id="sabado" type="checkbox" {...register("sabado")} defaultChecked={dias.sabado}/>
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor="domingo">Domingo</label>
                    <input className={style.checkbox} id="domingo" type="checkbox" {...register("domingo")} defaultChecked={dias.domingo}/>
                </div>
                <div className={`${style.inputsHorarios} ${style.inputModal}`}>
                    <div className={`${style.inputContainer} ${style.inputApertura}`}>
                        <label  className={style.label} htmlFor="apertura">Horario de apertura</label>
                        <input type="time" name="apertura" id="apertura" step="3600" className={style.select} defaultValue={state.pitchDetail.schedules[0].openingTime}
                            {...register("apertura", {required: true})}
                        />
                    </div>
                    <div className={`${style.inputContainer} ${style.inputCierre}`}>
                        <label className={style.label} htmlFor="cierr">Horario de cierre</label>
                        <input type="time" name="cierre" id="cierre" step="3600" className={style.select} defaultValue={state.pitchDetail.schedules[0].closingTime}
                            {...register("cierre", {required: true})}
                        />
                    </div>
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
                        {state.surfaces && state.surfaces.map((suelo)=> 
                        <option key={suelo.id} value={suelo.id} className={style.option}>{suelo.name}</option>
                        )}
                    </select>
                </div>
                {errors.superficie && <span className={style.error}>{errors.superficie.message}</span>}
            </div>
            <div className={style.inputModal}>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor='estacionamiento'>Estacionamiento</label>
                    <input className={style.checkbox} id="estacionamiento" type="checkbox" 
                    {...register("estacionamiento")} 
                    defaultChecked={servicios.estacionamiento}
                    />
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor='vestuario'>Vestuario</label>
                    <input className={style.checkbox} id='vestuario' type="checkbox" {...register("vestuario")} 
                    defaultChecked={servicios.vestuario}
                    />
                </div>
                <div className={style.inputContainer}>
                    <label className={style.labelCheck} htmlFor='buffet'>Buffet</label>
                    <input className={style.checkbox} id='buffet' type="checkbox" {...register("buffet")} 
                    defaultChecked={servicios.buffet}
                    />
                </div>
            </div>
            
                <div className={`${style.inputContainer} ${style.buttonsContainer}`}>
                    <button type="submit" className={style.submitButton}>Guardar</button>
                    <button type="button" className={style.cancelButton} onClick={()=>setShowFormEdit(false)}>Cancelar</button>
                </div>
        </form>
    </>
  )
}

export default EditCanchas