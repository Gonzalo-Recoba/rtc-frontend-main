import style from "../../styles/cardItem.module.css";
import arrowButtonMore from '../../utils/images/svg/arrowButtonMore.svg'
import heartIcon from '../../utils/images/svg/heartIcon.svg'
import {routes} from '../../utils/route'
import { Link } from "react-router-dom";

const CardItem = ({ item }) => {
    const {id, pitchName, pitchDescription, imagePaths, pitchLocation, sport } = item;
    const nombreDeporte = sport.sport.toLowerCase();


    return (
        <>
            <div className={style.cardIntegradorContainer}>
            <img src={imagePaths[0]} alt="Cancha imagen" className={style.imageCancha} />
                <div className={style.canchaInformation}>
                    <div className={style.titleFav}>
                    <Link to={`${routes.detailSinId}${id}`} className={style.linkDetail}>
                        <h3>{pitchName}</h3>
                    </Link>
                    </div>
                    <p className={style.deporte}>{nombreDeporte}</p>
                    <p className={style.description}>{pitchDescription}</p>
                    <p className={style.direccion}>{pitchLocation}</p>
                    <Link to={`${routes.detailSinId}${id}`} className={style.linkButton}><button className={style.buttonVerMas}><img src={arrowButtonMore} alt="See more"/>Ver mas</button></Link>
                </div>
            </div>
        </>
    );
};

export default CardItem;
