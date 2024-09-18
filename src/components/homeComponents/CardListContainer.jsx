import { useContext } from 'react';
import { GlobalContext } from '../../context/globalContext';
import CardList from './CardList';

const CardListContainer = () => {
    const { state } = useContext(GlobalContext);
    const items = state.searchedPitch.length > 0 ? state.searchedPitch : state.dataDetail;

    return (
        <div>
            {state.error ? (
                <p style={{textAlign: 'center', padding: '3rem', color: 'red', textDecoration: 'underline'}}>{state.error}</p>
            ) : items.length > 0 ? (
                <CardList items={items} />
            ) : (
                <p style={{textAlign: 'center', padding: '3rem', color: 'red', textDecoration: 'underline'}}>No hay datos disponibles para mostrar.</p>
            )}
        </div>
    );
};


export default CardListContainer;
