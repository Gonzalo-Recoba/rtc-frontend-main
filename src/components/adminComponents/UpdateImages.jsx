import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../context/globalContext';
import style from '../../styles/formRegisterCancha.module.css';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const UpdateImages = ({ setImages}) => {
    const { uploadImages } = useContext(GlobalContext);
    
    const handleImageUpload = (event) => {
        setImages(event);
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
    </form>
  )
}

export default UpdateImages