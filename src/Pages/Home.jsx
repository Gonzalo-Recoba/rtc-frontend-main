import CardListContainer from "../components/homeComponents/CardListContainer"
import Carousel from '../components/carouselComponents/Carousel'
import Searcher from '../components/Searcher'
import style from '../styles/searcher.module.css'

const Home = () => {

  return (
    <>
      <Carousel />
      <div className={style.searcherHomePage}>
        <Searcher />
      </div>
      <CardListContainer />
    </>
  )
}

export default Home