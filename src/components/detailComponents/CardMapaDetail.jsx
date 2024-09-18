import { useContext } from 'react';
import style from '../../styles/cardMapaDetail.module.css';
import reservaIcon from '../../utils/images/svg/reservaIcon.svg';
import sociosIcon from '../../utils/images/svg/sociosIcon.svg';
import { UserContext } from '../../context/userContext';
import { Link, useParams } from 'react-router-dom';
import { routes } from '../../utils/route';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const CardMapaDetail = ({ pitchPricePerHour, pitchMapUrl}) => {
  const { state } = useContext(UserContext);
  const { id } = useParams()
  const isLoggedIn = state.user;
  const urlMapa = "https://maps.google.com/?q=" + pitchMapUrl.mapLatitude + "," +pitchMapUrl.mapLongitude + "&z=14&output=embed"


  return (
    <div className={style.cardMapaDetailContainer}>
      <iframe
        className={style.mapa}
        src={urlMapa}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade" />
      <div className={style.infoMapaContainer}>
        <p className={style.price}>ARS {pitchPricePerHour} por hora</p>
        <div className={style.buttonMapaDetailContainer}>
          <Link className={style.linkReserva} to={`${routes.reservaSinId}${id}`}>
            <button
              className={`${style.buttonMapaDetail} ${!isLoggedIn ? style.buttonDisabled : ''
                }`}
              disabled={!isLoggedIn}>
                <EventAvailableIcon/>
              Reserva
            </button>
          </Link>
          <a href='https://api.whatsapp.com/send?phone=5491157192701&text=Hola.%20Estoy%20interesado%20en%20hacer%20una%20reserva%20en%20tu%20cancha.' target='_blank' className={style.buttonMapaDetail}>
          <WhatsAppIcon/>
            Whatsapp
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardMapaDetail;
