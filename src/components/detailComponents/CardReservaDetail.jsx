import { useContext } from 'react';
import style from '../../styles/cardMapaDetail.module.css';
import reservaIcon from '../../utils/images/svg/reservaIcon.svg';
import sociosIcon from '../../utils/images/svg/sociosIcon.svg';
import { UserContext } from '../../context/userContext';

const CardReservaDetail = ({setShow}) => {
  const { state } = useContext(UserContext);
  
  const isLoggedIn = state.user || state.admin;

  return (
    <div className={style.cardMapaDetailContainer}>
      <div className={style.mapa}>
        <h5>Reservar cancha</h5>
        <div>
            <label htmlFor="">Fecha</label>
            <input type="date" name="" id="" />
        </div>
        <div>
            <label htmlFor="">Hora inicio</label>
            <input type="time" name="" id="" />
        </div>
        <div>
            <label htmlFor="">Hora fin</label>
            <input type="time" name="" id="" />
        </div>
      </div>
      <div className={style.infoMapaContainer}>
        <p className={style.price}>Total AR120.000</p>
        <div className={style.buttonMapaDetailContainer}>
            <button
                onClick={()=>setShow(true)}
              className={`${style.buttonMapaDetail} ${
                !isLoggedIn ? style.buttonDisabled : ''
              }`}
              disabled={!isLoggedIn} 
            >
              <img
                className={style.iconButtonDetail}
                src={reservaIcon}
                alt="Icon Reserva"
              />
              Regresar
            </button>
            <button className={style.buttonMapaDetail}>
              <img
                className={style.iconButtonDetail}
                src={sociosIcon}
                alt="Icon Socios"
              />
              Confirmar
            </button>
        </div>
      </div>
    </div>
  );
};

export default CardReservaDetail;
