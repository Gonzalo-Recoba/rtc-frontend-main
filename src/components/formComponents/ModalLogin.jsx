import FormLogin from './FormLogin';
import style from '../../styles/modalLogin.module.css'; 
import logoXSmall from '../../utils/images/svg/logoXSmall.svg'

const ModalLogin = ({ isOpen, onClose, openRegister }) => {
    if (!isOpen) return null;

    return (
        <div className={style.modal} onClick={onClose}>
            <div className={style.modalContent} onClick={e => e.stopPropagation()}>
                <button className={style.closeButton} onClick={onClose}>X</button>
                <h2>Iniciar Sesion</h2>
                <FormLogin />
                <div className={style.textoModal}>
                    <p className={style.registerText} 
                        onClick={() => { onClose(); openRegister(); }}>
                            Todavia no tienes cuenta?
                        <span className={style.spanRegister}>
                            Registrate
                        </span>
                    </p>
                </div>
                <img src={logoXSmall} alt='Logo Tu Cancha' />
            </div>
        </div>
    );
};

export default ModalLogin;