import { useState, useEffect, useCallback, useContext } from 'react';
import CarouselCardItem from './CarouselCardItem';
import { Link } from 'react-router-dom';
import { routes } from '../../utils/route';
import '../../styles/carousel.css';
import arrowButtonMore from '../../utils/images/svg/arrowButtonMore.svg';
import { GlobalContext } from '../../context/globalContext';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); 
  const { state } = useContext(GlobalContext);

  useEffect(() => {
    if (state.dataDetail.length > 0) {
      setLoading(false); 
    }
  }, [state.dataDetail]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % state.dataDetail.length);
  }, [state.dataDetail.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);


  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return <div className='loadingCarousel'>Cargando...</div>;
  }

  if (state.dataDetail.length === 0) {
    return <div className='loadingCarousel'>No hay elementos disponibles</div>;
  }

  const currentItem = state.dataDetail[currentIndex];

  if (!currentItem) {
    return <div>Error: No se pudo cargar el item</div>;
  }

  return (
    <div className="carousel">
      <div className="carousel-images">
        <CarouselCardItem key={currentItem.id} item={currentItem} />
      </div>
      <div className="card-info">
        <Link to={`${routes.detailSinId}${currentItem.id}`} className="next-button">
          <button className="button-ver-mas">
            <img src={arrowButtonMore} alt="Ver más" /> Ver más
          </button>
        </Link>
      </div>
      <div className="dots">
        {state.dataDetail.map((item, index) => (
          <span
            key={item.id}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
