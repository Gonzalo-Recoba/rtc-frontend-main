import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../context/globalContext';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import style from '../../styles/CalendarioProvisorio.module.css';
import BookingDetail from './BookingDetail';
import { UserContext } from '../../context/userContext';
import {routes} from '../../utils/route'

dayjs.extend(isBetween);

const CalendarioReservaProvisorio = () => {
    const { state, reservasPorCancha, getDetail } = useContext(GlobalContext);
    const { state: userContxt } = useContext(UserContext);
    const { id } = useParams();
    const [reservas, setReservas] = useState([]);
    const [fechaActual, setFechaActual] = useState(dayjs().startOf('day'));
    const [showBookingDetail, setShowBookingDetail] = useState(false);
    const [infoBooking, setInfoBooking] = useState({});
    const [horas, setHoras] = useState([]);
    const [diaAbierto, setDiaAbierto] = useState([])
    const navigate = useNavigate();

    const {admin, user, operator } = userContxt;

    if(admin || operator){
        navigate(routes.home)
    }

    const userEmail = user.userEmail;
    
    const completeName =`${user.userFirstName} ${user.userLastName}`

    const userId = user.userId;

    useEffect(() => {
        reservasPorCancha(id);
        getDetail(id);
    }, [id, reservasPorCancha, getDetail, showBookingDetail]);

    useEffect(() => {
        if (state.filteredReservas) {
            setReservas(state.filteredReservas);
        }
    }, [state.filteredReservas]);

    useEffect(() => {
        if (state.pitchDetail && state.pitchDetail.schedules) {
            const schedule = state.pitchDetail.schedules[0]; 
            const openingTime = schedule.openingTime;
            const closingTime = schedule.closingTime;
            setHoras(generarHoras(openingTime, closingTime));
        }
    }, [state.pitchDetail]);

    const generarHoras = (openingTime, closingTime) => {
        const horas = [];
        let startHour = dayjs(`2000-01-01 ${openingTime}`, 'YYYY-MM-DD HH:mm:ss');
        let endHour = dayjs(`2000-01-01 ${closingTime}`, 'YYYY-MM-DD HH:mm:ss');

        while (startHour.isBefore(endHour)) {
            horas.push(startHour.format('HH:mm'));
            startHour = startHour.add(1, 'hour');
        }

        return horas;
    };

    const esHoraReservada = (fecha, hora) => {
        return reservas.some((reserva) => {
            const start = dayjs(`${reserva.date} ${reserva.startTime}`, 'YYYY-MM-DD HH:mm:ss');
            const end = dayjs(`${reserva.date} ${reserva.endTime}`, 'YYYY-MM-DD HH:mm:ss');
            const horaReserva = dayjs(`${fecha.format('YYYY-MM-DD')} ${hora}`, 'YYYY-MM-DD HH:mm');
            return horaReserva.isBetween(start, end, null, '[)'); 
        });
    };


    useEffect(() => {
        if (state.pitchDetail && state.pitchDetail.schedules) {
            
            const diasAbiertos = [];

            state.pitchDetail.schedules.forEach((dia) => {
                switch (dia.dayName) {
                    case 'Lunes':
                        diasAbiertos.push(1);
                        break;
                    case 'Martes':
                        diasAbiertos.push(2);
                        break;
                    case 'Miércoles':
                        diasAbiertos.push(3);
                        break;
                    case 'Jueves':
                        diasAbiertos.push(4);
                        break;
                    case 'Viernes':
                        diasAbiertos.push(5);
                        break;
                    case 'Sábado':
                        diasAbiertos.push(6);
                        break;
                    case 'Domingo':
                        diasAbiertos.push(0);
                        break;
                    default:
                        console.warn(`Día no reconocido: ${dia.dayName}`);
                }
            });
            setDiaAbierto(diasAbiertos);
        }
    }, [state.pitchDetail.schedule, state.pitchDetail]); 

    const esDiaAbierto = (fecha) => {
        const diaActual = fecha.day(); 
        return diaAbierto.includes(diaActual);
    };
    
    const renderCalendario = () => {
        const dias = [];
        let fecha = fechaActual;
    
        const horaActual = dayjs();
    
        for (let i = 0; i < 7; i++) {
            dias.push(fecha);
            fecha = fecha.add(1, 'day');
        }
    
        return (
            <div className={style['calendario-container']}>
                <table className={style.calendario}>
                    <thead>
                        <tr>
                            <th className={style.tituloHora}></th>
                            {dias.map((dia) => (
                                <th key={dia.format('YYYY-MM-DD')} className={`${style.titulo} ${style[`titulo-${dia.format('YYYY-MM-DD')}`]}`}>
                                    {dia.format('DD MMM')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {horas.map((hora) => (
                            <tr key={hora}>
                                <td className={`${style.tituloHora}`}>{hora}</td>
                                {dias.map((dia) => {
                                    const reservada = esHoraReservada(dia, hora);
                                    const abierto = esDiaAbierto(dia);
    
                                    
                                    const horaDiaActual = dayjs(`${dia.format('YYYY-MM-DD')} ${hora}`, 'YYYY-MM-DD HH:mm');
                                    const horaYaPaso = dia.isSame(dayjs(), 'day') && horaDiaActual.isBefore(horaActual);
    
                                    return (
                                        <td
                                            key={`${dia.format('YYYY-MM-DD')}-${hora}`}
                                            className={`${style.dia} ${reservada ? style.reservada : (!abierto ? style.cerrado : (horaYaPaso ? style.horaPasada : style.disponible))}`}
                                            onClick={() => {
                                                if (!reservada && abierto && !horaYaPaso) {
                                                    setShowBookingDetail(true);
                                                    setInfoBooking({
                                                        dia: dia.format('YYYY-MM-DD'),
                                                        hora: hora,
                                                        userEmail,
                                                        completeName,
                                                        cancha: id,
                                                        userId
                                                    });
                                                }
                                            }}
                                        >
                                            {reservada
                                                ? 'Reservado'
                                                : (!abierto
                                                    ? 'Cerrado'
                                                    : (horaYaPaso ? 'Hora pasada' : 'Disponible'))}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    

    return (
        <div>
            {!showBookingDetail ? (
                <>
                    <h2 style={{ textAlign: 'center', color: '#0A2824' }}>Disponibilidad</h2>
                    {renderCalendario()}
                </>
            ) : (
                <div className={style.bookingDetailContainer}>
                    <h2 style={{ textAlign: 'center', color: '#0A2824' }}>Datos de la Reserva</h2>
                    <button className={style.backButton} onClick={() => setShowBookingDetail(false)}>Atras</button>
                    <BookingDetail infoBooking={infoBooking} />
                </div>
            )}
        </div>
    );
};

export default CalendarioReservaProvisorio;