import { useForm } from "react-hook-form";
import { useContext } from "react";
import { UserContext } from '../../context/userContext';
import style from '../../styles/formRegisterAdmin.module.css';
import userLogoForm from '../../utils/images/svg/userLogoForm.svg';
import correoLogo from '../../utils/images/svg/correoLogo.svg';
import candadoInput from '../../utils/images/svg/candadoInput.svg';
import login from '../../utils/images/svg/login.svg';

const FormRegisterUser = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const { createUser } = useContext(UserContext);

    const onSubmit = (data) => {
        const { passwordConfirmation, ...userData } = data;
        createUser(userData);
        reset();
    };
    

    const password = watch('userPassword');

    return (
        <div>
            <h2 className={style.rolForm}>User</h2>
            <form onSubmit={handleSubmit(onSubmit)} className={style.containerForm}>
                <div className={style.inputModal}>
                    <div className={style.inputContainer}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            id="nombre"
                            className={style.inputField}
                            {...register("userFirstName", {
                                required: {
                                    value: true,
                                    message: "El nombre es requerido",
                                },
                                minLength: {
                                    value: 3,
                                    message: "El mínimo que tiene que tener es de 3 caracteres",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "El máximo que tiene que tener es de 50 caracteres",
                                },
                            })}
                        />
                        <img src={userLogoForm} alt="User Logo Icon" className={style.inputIcon} />
                    </div>
                    {errors.nombre && <span className={style.error}>{errors.nombre.message}</span>}
                </div>
                <div className={style.inputModal}>
                    <div className={style.inputContainer}>
                        <input
                            type="text"
                            placeholder="Apellido"
                            id="apellido"
                            className={style.inputField}
                            {...register("userLastName", {
                                required: {
                                    value: true,
                                    message: "El apellido es requerido",
                                },
                                minLength: {
                                    value: 3,
                                    message: "El mínimo que tiene que tener es de 3 caracteres",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "El máximo que tiene que tener es de 50 caracteres",
                                },
                            })}
                        />
                        <img src={userLogoForm} alt="User Logo Icon" className={style.inputIcon} />
                    </div>
                    {errors.apellido && <span className={style.error}>{errors.apellido.message}</span>}
                </div>
                <div className={style.inputModal}>
                    <div className={style.inputContainer}>
                        <input
                            type="text"
                            placeholder="Email"
                            id="emailUser"
                            className={style.inputField}
                            {...register("userEmail", {
                                required: {
                                    value: true,
                                    message: "El email es requerido",
                                },
                                pattern: {
                                    value: /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                    message: "Introduce un email válido",
                                },
                            })}
                        />
                        <img src={correoLogo} alt="Correo Logo Icon" className={style.inputIcon} />
                    </div>
                    {errors.emailUser && <span className={style.error}>{errors.emailUser.message}</span>}
                </div>
                <div className={style.inputModal}>
                    <div className={style.inputContainer}>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className={style.inputField}
                            {...register("userPassword", {
                                required: {
                                    value: true,
                                    message: "La contraseña es requerida",
                                },
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe tener al menos 6 caracteres",
                                },
                                maxLength: {
                                    value: 15,
                                    message: "La contraseña no puede tener más de 15 caracteres",
                                },
                            })}
                        />
                        <img src={candadoInput} alt="Candado Logo Icon" className={style.inputIcon} />
                    </div>
                    {errors.password && <span className={style.error}>{errors.password.message}</span>}
                </div>
                <div className={style.inputModal}>
                    <div className={style.inputContainer}>
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            className={style.inputField}
                            {...register("passwordConfirmation", {
                                required: {
                                    value: true,
                                    message: "Confirmar contraseña es requerido",
                                },
                                validate: (value) =>
                                    value === password || "Las contraseñas no coinciden",
                            })}
                        />
                        <img src={candadoInput} alt="Candado Logo Icon" className={style.inputIcon} />
                    </div>
                    {errors.passwordConfirmation && <span className={style.error}>{errors.passwordConfirmation.message}</span>}
                </div>
                <button type="submit" className={style.loginButton}><img src={login} alt="Login icon"/>Registrar</button>
            </form>
        </div>
    );
};

export default FormRegisterUser;
