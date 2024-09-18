import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import PanelAdmin from '../components/adminComponents/PanelAdmin';
import style from '../styles/perfilPage.module.css'
import ErrorPage from './ErrorPage';
import { GlobalContext } from '../context/globalContext';
import UserReservas from '../components/userComponents/UserReservas';

const PerfilPage = () => {
    const { state } = useContext(UserContext);
    const {state: globalState, getUserReservas} =useContext(GlobalContext)
    const user = state.user;
    const admin = state.admin;
    const operator = state.operator
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !admin && !operator) {
            navigate('/');
        }
    }, [user, admin, operator, navigate]);

    useEffect(()=>{
        getUserReservas()
    }, [getUserReservas])

    // console.log(globalState.reservasUser);
    

    return (
        <div className={style.miPerfil}>
            <div className={style.dataPerfilContainer}>
            {user ? (
                <>
                    <h1>Hola <span className={style.nombreUser}>{user.userFirstName}</span>!</h1>
                    <div className={style.dataPerfil}>
                        <h3>Tus datos son:</h3>
                        <p><span className={style.spanBold}>Nombre:</span> {user.userFirstName}</p>
                        <p><span className={style.spanBold}>Apellido:</span> {user.userLastName}</p>
                        <p><span className={style.spanBold}>Email:</span> {user.userEmail}</p>
                    </div>
                </>
            ) 
            : 
            admin ? (
                <>
                    <h1>Hola <span className={style.nombreUser}>{admin.userFirstName}</span>!</h1>
                    <div className={style.dataPerfil}>
                    <h3>Tus datos son:</h3>
                    <p><span className={style.spanBold}>Nombre Empresa:</span> {admin.userFirstName}</p>
                    <p><span className={style.spanBold}>Email:</span> {admin.userEmail}</p>
                    </div>
                </>
            ) 
            : operator ? 
                <>
                <h1>Hola <span className={style.nombreUser}>{operator.nombre}</span>!</h1>
                <div className={style.dataPerfil}>
                    <h3>Tus datos son:</h3>
                    <p><span className={style.spanBold}>Nombre:</span> {operator.userFirstName}</p>
                    <p><span className={style.spanBold}>Apellido:</span> {operator.userLastName}</p>
                    <p><span className={style.spanBold}>Email:</span> {operator.userEmail}</p>
                </div>
                </>
            :
            <ErrorPage/> 
        }
        </div>
        {(admin || operator) && <PanelAdmin/>}
        {user && <UserReservas/>}
        </div>
    );
};

export default PerfilPage;
