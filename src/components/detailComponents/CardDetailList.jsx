import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardDetail from './CardDetail';
import Loading from '../Loading';
import { GlobalContext } from '../../context/globalContext';

const CardDetailList = () => {
  const { id } = useParams();
  const { state, getDetail } = useContext(GlobalContext);

  useEffect(() => {
    if (id) {
      getDetail(id);
    }
  }, [id, getDetail]);

  return (
    <>
      {state.pitchDetail && Object.keys(state.pitchDetail).length > 0 ? (
        <CardDetail item={state.pitchDetail} />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default CardDetailList;
