import { useContext, useState, useEffect } from 'react';
import style from '../styles/navBar.module.css';
import logo from '../utils/images/svg/logo.svg';
import Searcher from './Searcher';
import login from '../utils/images/svg/login.svg';
import { Link } from 'react-router-dom';
import { routes } from '../utils/route';
import { UserContext } from '../context/userContext';
import ModalLogin from './formComponents/ModalLogin'; 
import ModalRegister from './formComponents/ModalRegister';

const Navbar = () => {
    const [showNav, setShowNav] = useState(false);
    const [showModal, setShowModal] = useState(false); 
    const [showRegisterModal, setShowRegisterModal] = useState(false);  
    const { state, logout } = useContext(UserContext);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const openRegisterModal = () => setShowRegisterModal(true);
    const closeRegisterModal = () => setShowRegisterModal(false);

    useEffect(() => {
        if (state.user || state.admin || state.operator) {
            closeModal();
            closeRegisterModal();
        }
    }, [state.user, state.admin, state.operator]);

    return (
        <>
            <nav className={style.containerNavBar}>
                <Link to={routes.home}>
                    <img className={style.logo} src={logo} alt="Logo" />
                </Link>
                <div 
                    className={`${style.menu} ${showNav ? style.cross : ''}`} 
                    onClick={() => setShowNav(!showNav)}
                >
                    <span className={style.span}></span>
                    <span className={style.span}></span>
                    <span className={style.span}></span>
                </div>
                <div className={style.rightContainer}>
                    <ul className={`${style.ul} ${showNav ? style.open : ''}`}>
                        {(state.admin || state.user || state.operator) && <Link to={routes.perfilPage} className={style.linkPerfil}><li className={`${style.li} ${style.textoNav}`}>Mi perfil</li></Link>}
                        {(state.admin || state.user || state.operator) 
                            ? <li className={style.li}>
                                <button className={`${style.loginButton} ${style.logoutButton}`} onClick={logout}>
                                    <img src={login} alt='Login Icon' /> LogOut
                                </button>
                                </li> 
                            : <li className={style.li}>
                                <button className={style.loginButton} onClick={openModal}>
                                    <img src={login} alt='Login Icon' /> Log In
                                </button>
                                </li>
                        }
                        {!state.admin && !state.user && !state.operator &&
                            <li className={style.li}>
                                <p className={style.registerButton} onClick={openRegisterModal}>Registrarse</p>
                            </li>
                        }
                    </ul>
                    <div className={style.searcherShow}>
                        <Searcher />
                    </div>
                </div>
            </nav>
            {showModal && <ModalLogin isOpen={showModal} onClose={closeModal} openRegister={openRegisterModal} />}
            {showRegisterModal && <ModalRegister isOpen={showRegisterModal} onClose={closeRegisterModal} openLogin={openModal} />}
        </>
    );
};

export default Navbar;
