import FormRegisterUser from './FormRegisterUser';
import style from '../../styles/modalRegister.module.css';
import logoXSmall from '../../utils/images/svg/logoXSmall.svg'

const ModalRegister = ({ isOpen, onClose, openLogin }) => {

  if (!isOpen) return null;

  return (
    <div className={style.modal} onClick={onClose}>
      <div className={style.modalContent} onClick={e => e.stopPropagation()}>
        <button className={style.closeButton} onClick={onClose}>X</button>
        <h2>Crear Cuenta</h2>
        <FormRegisterUser />
          <div className={style.textoModal}>
              <p className={style.registerText} onClick={() => { onClose(); openLogin(); }}>Ya tienes cuenta? <span className={style.spanRegister} >Ingresa</span></p>
          </div>
          <img src={logoXSmall} alt='Logo Tu Cancha' />
        </div>
      </div>
  );
};

export default ModalRegister;
