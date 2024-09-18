import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/globalContext';
import CardReserva from '../components/bookingComponents/CardReserva';
import { UserContext } from '../context/userContext';
import { routes } from '../utils/route';
import style from '../styles/ReservasPorCanchaPage.module.css';
import dayjs from 'dayjs';

const ReservasPorCanchaPage = () => {
  const { id } = useParams();
  const { reservasPorCancha, state, getDetail } = useContext(GlobalContext);
  const { state: userState } = useContext(UserContext);
  const navigate = useNavigate();
  
  const today = dayjs().format('YYYY-MM-DD');
  //Si no se le pasa una fecha dentro del (), agarra la actual

  useEffect(() => {
    if (userState.admin || userState.operator) {
      reservasPorCancha(id);
      getDetail(id);
    } else {
      navigate(routes.home);
    }
  }, [id, reservasPorCancha, navigate, userState.admin, userState.operator, getDetail]);

  return (
    <div>
      <h2 className={style.tituloReserva}>Disponibilidad de la cancha:</h2>
      <h2 className={style.tituloReserva} style={{ textDecoration: 'underline', color: '#007F6D' }}>
        {state.pitchDetail.pitchName}
      </h2>
      <div className={style.containerCardsReservas}>
        {state.filteredReservas.length > 0 ? (
          state.filteredReservas
            .filter(reserva => {
              const reservaDate = dayjs(reserva.date).format('YYYY-MM-DD'); 
              //dayjs se le pasa el date de reserva para que lo formatee
              console.log("Reserva:", reservaDate);
              console.log("Hoy:", today);
              return reservaDate >= today;
            })
            .map(reserva => (
              <CardReserva reserva={reserva} key={reserva.id} />
            ))
        ) : (
          <h2 style={{ color: 'red', textAlign: 'center' }}>
            La cancha que usted indicó no tiene ninguna reserva
          </h2>
        )}
      </div>
    </div>
  );
};

export default ReservasPorCanchaPage;
