import React, { useEffect } from 'react';
import style from '../../styles/cardDetail.module.css';
import heartIcon from '../../utils/images/svg/heartIcon.svg';
import CardMapaDetail from './CardMapaDetail';
import CarouselCardDetail from '../carouselComponents/CarouselCardDetail';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import GrassIcon from '@mui/icons-material/Grass';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ShowerIcon from '@mui/icons-material/Shower';
import FastfoodIcon from '@mui/icons-material/Fastfood';

const CardDetail = ({ item }) => {

    const { pitchName, pitchDescription, pitchPricePerHour, pitchMapUrl, surfaceName, schedules, sport, services } = item;
    const sportName = sport.sport.toLowerCase()
    let estacionamiento
    let vestuario
    let buffet
    const abreviaturas = []

    services.map((servicio)=>{
        if(servicio.id === 1) estacionamiento = true
        if(servicio.id === 2) vestuario = true
        if(servicio.id === 3) buffet = true
    })

    schedules.map((dia)=>{
        abreviaturas.push(dia.dayName.slice(0,3))
    })
    const diasApertura = abreviaturas.join(', ')

    const horaApertura = schedules[0].openingTime.slice(0, 5)
    const horaCierre = schedules[0].closingTime.slice(0, 5)
    



    return (
        <div className={style.cardDetailContainer}>
            <div className={style.carouselCardItem}>
                <CarouselCardDetail item={item} />
            </div>
            <div className={style.containerInfoCardDetail}>
                <div className={style.titleFavDetail}>
                    <h2 className={style.title}>{pitchName}</h2>
                    <p className={style.subtitle}>{sportName}</p>
                </div>
                <div className={style.informacionCardDetailConImagen}>
                    <div className={style.caracteristicasContainer}>
                        <div className={style.imageAndText}>
                            <AccessTimeFilledIcon />
                            <p className={style.textoDetailCategoria}>
                                {diasApertura}
                                <br />
                                <span className={style.textoDetailCategoria}>{horaApertura} a {horaCierre}</span>
                            </p>
                        </div>
                        <div className={style.imageAndText}>
                            <GrassIcon />
                            <p className={style.textoDetailCategoria}>{surfaceName}</p>
                        </div>
                        <div
                            className={style.imageAndText}
                            style={estacionamiento ? { color: "var(--boton-enable)" } :  { color: "var(--boton-disabled-service)", borderColor:"var(--boton-disabled-service)" }}
                            title={estacionamiento ? "Este local cuenta con estacionamiento" : "Este local no cuenta con estacionamiento"}
                        >
                            <LocalParkingIcon />
                            <p className={style.textoDetailCategoria}>Parking</p>
                        </div>
                        <div
                            className={style.imageAndText}
                            style={vestuario ? { color: "var(--boton-enable)" } : { color: "var(--boton-disabled-service)", borderColor:"var(--boton-disabled-service)" }}
                            title={vestuario ? "Este local cuenta con vestuario" : "Este local no cuenta con vestuario"}
                        >
                            <ShowerIcon />
                            <p className={style.textoDetailCategoria}>Vestuario</p>
                        </div>
                        <div
                            className={style.imageAndText}
                            style={buffet ? { color: "var(--boton-enable)" } :  { color: "var(--boton-disabled-service)", borderColor:"var(--boton-disabled-service)" }}
                            title={buffet ? "Este local cuenta con servicio de buffet" : "Este local no cuenta con servicio de buffet"}
                        >
                            <FastfoodIcon />
                            <p className={style.textoDetailCategoria}>Buffet</p>
                        </div>
                    </div>
                    <div className={style.informacionCardDetail}>
                        <div className={style.descripcionDetail}>
                            <p>{pitchDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
            <CardMapaDetail pitchPricePerHour={pitchPricePerHour} pitchMapUrl={pitchMapUrl} />
        </div>
    );
};

export default CardDetail;
