import '../../styles/carousel.css';

const CarouselCardItem = ({ item }) => {
  const { imagePaths, nombre } = item;

  return (
    <div className="card-item">
      <img src={imagePaths[0]} alt={nombre} className="card-image" />
    </div>
  );
};

export default CarouselCardItem;
