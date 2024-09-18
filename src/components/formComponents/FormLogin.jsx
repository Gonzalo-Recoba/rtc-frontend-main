import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../context/userContext'; 
import style from '../../styles/formLogin.module.css'; 
import candadoInput from '../../utils/images/svg/candadoInput.svg';
import correoLogo from '../../utils/images/svg/correoLogo.svg';
import loginImage from '../../utils/images/svg/login.svg';

const FormLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const { state, login } = useContext(UserContext); 
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (state.error) {
            setErrorMessage(state.error);
        }
    }, [state.error]);

    const onSubmit = async (data) => {
        try {
            await login(data);
            reset(); 
        } catch (error) {
            setErrorMessage('Error en el login');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className={style.containerForm}>
                <div className={style.inputModal}>
                    <div className={style.inputContainer}>
                        <input 
                            type="text"
                            id="email"
                            placeholder="Email"
                            className={style.inputField}
                            {...register("userEmail", {
                                required: "El email es requerido",
                                pattern: {
                                    value: /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                    message: "Introduce un email válido",
                                },
                            })}
                        />
                        <img src={correoLogo} alt="Logo Correo" className={style.inputIcon} />
                    </div>
                    {errors.email && <span className={style.error}>{errors.email.message}</span>}
                </div>

                <div className={style.inputModal}>
                    <div className={style.inputContainer}>
                        <input 
                            type="password"
                            id="password"
                            placeholder="Contraseña"
                            className={style.inputField}
                            {...register("userPassword", {
                                required: "La contraseña es requerida",
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe tener al menos 6 caracteres",
                                },
                            })}
                        />
                        <img src={candadoInput} alt="Logo Candado" className={style.inputIcon} />
                    </div>
                    {errors.password && <span className={style.error}>{errors.password.message}</span>}
                </div>

                {errorMessage && <span className={style.error}>{errorMessage}</span>}

                <button type="submit" className={style.loginButton}><img src={loginImage} alt="Login" /> Ingresar</button>
            </form>
        </div>
    );
};


export default FormLogin;
