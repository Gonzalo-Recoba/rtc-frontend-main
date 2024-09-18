import style from '../styles/footer.module.css'
import logoXSmall from '../utils/images/svg/logoXSmall.svg'
import whatsapp from '../utils/images/svg/whatsapp.svg'
import instagram from '../utils/images/svg/instagram.svg'
import facebook from '../utils/images/svg/facebook.svg'
import {routes} from '../utils/route'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className={style.footerContainer} >
      <div className={style.topContainer}>
        <div className={style.logoFooter}>
        <Link to={routes.home}><img src={logoXSmall} alt='Logo' /></Link> 
        </div>
        <div className={style.socialNetworks}>
          <img src={whatsapp} alt="Logo Whatsapp " />
          <img src={instagram} alt="Logo Instagram " />
          <img src={facebook} alt="Logo Facebook" />
        </div>
      </div>
      <div className={style.copyright}>
        <p>@ 2024 derechos reservados</p>
      </div>
    </div>
  )
}

export default Footer