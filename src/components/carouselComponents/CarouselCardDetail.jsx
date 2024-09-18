import React, { useState } from 'react';
import '../../styles/CarouselCardDetail.css';

const CarouselCardDetail = ({item}) => {
    const {imagePaths} = item;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + imagePaths.length) % imagePaths.length);
    };

    return (
        <div className="carouselDetail">
            <div className="carousel-imagesDetail" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
                {imagePaths.map((image, index) => (
                    <img key={index} src={image} alt={`Foto ${index + 1}`} />
                ))}
            </div>
            <div className="carousel-buttonsDetail">
                <button onClick={prevSlide}>&#10094;</button>
                <button onClick={nextSlide}>&#10095;</button>
            </div>
        </div>
    );
};

export default CarouselCardDetail;