import React, { useContext, useEffect, useState, useCallback } from 'react'
import { GlobalContext } from '../../context/globalContext'
import style from '../../styles/BookingDetail.module.css'
import { Link } from 'react-router-dom'
import { routes } from '../../utils/route'

const BookingDetail = ({ infoBooking }) => {
    const { getDetail, state, createReserva } = useContext(GlobalContext)
    const { dia, hora, userEmail, completeName, cancha, userId } = infoBooking
    const [cantHoras, setCantidadHoras] = useState(1)
    const [canchaPrice, setCanchaPrice] = useState(null)
    const [horaFin, setHoraFin] = useState('')
    const [precioTotal, setPrecioTotal] = useState(0)
    const [reserva, setReserva] = useState({})
    const [showModalConfirm, setShowModalConfirm] = useState(false)
    const [confirmation, setConfirmation] = useState(false)


    useEffect(() => {
        getDetail(cancha)
        setCanchaPrice(state.pitchDetail.pitchPricePerHour)
    }, [cancha, getDetail, state.pitchDetail.pitchPricePerHour])

    const calcHora = useCallback(() => {
        const [hours, minutes] = hora.split(':').map(Number)
        const startDate = new Date()
        startDate.setHours(hours, minutes, 0, 0)

        const endDate = new Date(startDate)
        endDate.setHours(endDate.getHours() + cantHoras)

        const horaFinFormatted = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
        setHoraFin(horaFinFormatted)
        const total = cantHoras * canchaPrice
        setPrecioTotal(total)
    }, [hora, cantHoras, canchaPrice])

    useEffect(() => {
        if (canchaPrice !== null) {
            calcHora()
        }
    }, [cantHoras, canchaPrice, calcHora])

    const handleHourChange = (e) => {
        const value = Number(e.target.value);

        if (value >= 1 && value <= 3) {
            const [startHours, startMinutes] = hora.split(':').map(Number);
            const newStartDate = new Date(dia);
            newStartDate.setHours(startHours, startMinutes, 0, 0);

            // Calcula la hora de finalización propuesta
            const newEndDate = new Date(newStartDate);
            newEndDate.setHours(newEndDate.getHours() + value);

            // Verificar si alguna reserva existente entra en conflicto en el mismo día
            const hasConflict = state.filteredReservas.some(reserva => {
                const [reservaStartHours, reservaStartMinutes] = reserva.startTime.split(':').map(Number);
                const [reservaEndHours, reservaEndMinutes] = reserva.endTime.split(':').map(Number);

                const reservaDate = new Date(reserva.date); // Fecha de la reserva
                const reservaStartDate = new Date(reservaDate);
                reservaStartDate.setHours(reservaStartHours, reservaStartMinutes, 0, 0);

                const reservaEndDate = new Date(reservaDate);
                reservaEndDate.setHours(reservaEndHours, reservaEndMinutes, 0, 0);

                // Comprobar si la hora de inicio o fin propuesta se superponen con la reserva existente
                // Conflicto si la hora de inicio propuesta está entre la reserva existente
                return (
                    reservaDate.toDateString() === newStartDate.toDateString() && // Mismo día
                    (
                        (newStartDate >= reservaStartDate && newStartDate < reservaEndDate) || // Comienza durante otra reserva
                        (newEndDate > reservaStartDate && newEndDate <= reservaEndDate) || // Termina durante otra reserva
                        (newStartDate <= reservaStartDate && newEndDate >= reservaEndDate) // Ocupa completamente otra reserva
                    )
                );
            });

            if (!hasConflict) {
                // Si no hay conflicto, permite cambiar la cantidad de horas
                setCantidadHoras(value);
            } else {
                alert("La hora seleccionada entra en conflicto con otra reserva en el mismo día.");
            }
        }
    };

    const handleFormat = () => {
        setReserva({
            date: dia,
            startTime: hora,
            endTime: horaFin,
            fullPrice: precioTotal,
            userId: userId,
            pitchId: parseInt(cancha)
        })
        setShowModalConfirm(true)
    }

    const handleSubmit = () => {
        createReserva(reserva)
        setShowModalConfirm(false)
        setConfirmation(true)
    };

    if (confirmation) {
        return (
            <div className={style.bookingContainer}>
                <h3 className={style.confirmationMessage}>Gracias por confiar en nosotros, su reserva ha sido confirmada</h3>
                <p className={style.paragraphConfirmation}>Le estaremos enviando un correo con la información de la reserva.</p>
                <p>
                    Recuerde que puede verificar sus reservas yendo al apartado
                </p>
                <p><Link to={routes.perfilPage}>Mi Perfil</Link>.</p>
            </div>
        );
    }

    return (
        <div className={style.bookingContainer}>
            <p className={style.bookingInfo}><strong>Email:</strong> {userEmail}</p>
            <p className={style.bookingInfo}><strong>Nombre: </strong> {completeName}</p>
            <p className={style.bookingInfo}><strong>Dia:</strong>  {dia}</p>
            <label className={style.bookingLabel}><strong>Cuántas horas</strong></label>
            <input
                className={style.bookingInputNumber}
                type='number'
                placeholder='Cuántas Horas'
                min='1'
                max='3'
                value={cantHoras}
                onInput={handleHourChange}
            />
            <p className={style.bookingInfo}><strong>Hora de inicio:</strong> {hora}</p>
            <p className={style.bookingInfo}><strong>Hora de finalización:</strong> {horaFin}</p>
            <p className={`${style.bookingInfo} ${style.bookingPrice}`}>Precio total: ${precioTotal}</p>

            <button className={style.bookingButton} onClick={handleFormat}>Confirmar Datos</button>

            {showModalConfirm && <div className={style.bookingModal}>
                <p className={style.bookingP}>Confirmar reserva?</p>
                <button className={style.bookingModalButton} onClick={handleSubmit}>Confirmar</button>
                <button className={style.bookingCancelButton} onClick={() => setShowModalConfirm(false)}>Cancelar</button>
            </div>}
        </div>
    )
}

export default BookingDetail;