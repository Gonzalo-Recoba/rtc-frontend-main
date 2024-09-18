import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../context/globalContext';
import style from '../../styles/formRegisterCancha.module.css';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const UploadImages = ({setShowFormCreate, setShowFormDataCancha}) => {
    const { uploadImages } = useContext(GlobalContext);
    const [images, setImages] = useState(null);


    const handleImageUpload = (event) => {
        setImages(event);
    };
    
    const registrarCancha = (e) => {
        uploadImages(images)
        setShowFormCreate(false)
        };


    return (
        <form className={style.inputModal} >
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={"image-upload"}
                        multiple
                        type="file"
                        onChange={(e)=>handleImageUpload(e.target.files)}
                    />
                    <label htmlFor={"image-upload"}>
                        <p>Adjuntar imagenes</p>
                            <AddToPhotosIcon />
                    </label>
                    <div className={style.buttonsContainer}>
                        <button type="button" className={style.submitButton} onClick={()=>{setShowFormDataCancha(true)}}><ArrowBackIosIcon/>Volver</button>
                        <button type="button" className={style.submitButton} onClick={(e)=>{registrarCancha(e)}}>Registrar</button>
                        <button type="button" className={style.cancelButton} onClick={()=>setShowFormCreate(false)}>Cancelar</button>
                    </div>
                </form>
    )
}

export default UploadImages