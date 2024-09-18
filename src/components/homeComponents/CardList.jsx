import CardItem from './CardItem'
import style from '../../styles/cardList.module.css'

const CardList = ({items}) => {


  return (
    <div className={style.cardList}>
        {items.map((item)=>(
            <CardItem item={item} key={item.id} />
        ))}
    </div>
  )
}

export default CardList