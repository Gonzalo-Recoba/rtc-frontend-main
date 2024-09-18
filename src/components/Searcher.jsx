import { useRef, useContext, useEffect, useState } from 'react';
import style from '../styles/searcher.module.css';
import { GlobalContext } from '../context/globalContext';
import { deportesSelectSearch } from '../utils/localidades';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from '../utils/debounce';

const Searcher = () => {
    const { searchPitch, dispatch } = useContext(GlobalContext);
    const [location, setLocation] = useState("");
    const [selectedDeporte, setSelectedDeporte] = useState(deportesSelectSearch[0]);
    const searchInputRef = useRef(null);
    
    const debouncedSearchPitch = useRef(debounce((loc, sport) => {
        if (sport === 'Todos' && (!loc || loc.trim() === '')) {
            return dispatch({ type: 'SEARCHED_PITCH', payload: [] });
        }
        searchPitch(loc, sport);
    }, 400)).current;

    useEffect(() => {
        debouncedSearchPitch(location, selectedDeporte);
    }, [location, selectedDeporte, debouncedSearchPitch]);

    const handleLupaClick = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    return (
        <div className={style.searcher}>
            <h5 className={style.text}>Buscá tu cancha</h5>
            <div className={style.searchContainer}>
                <input
                    type='search'
                    ref={searchInputRef}
                    className={style.search}
                    placeholder='localidad'
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                />
                <select
                    className={style.selectInput}
                    onChange={(e) => setSelectedDeporte(e.target.value)}
                    value={selectedDeporte}>
                    {deportesSelectSearch.map((deporte, index) => (
                        <option key={index} value={deporte}>
                            {deporte}
                        </option>
                    ))}
                </select>
                <SearchIcon
                    alt='Search'
                    className={style.lupa}
                    onClick={handleLupaClick}
                    sx={{ fontSize: 36 }}
                />
            </div>
        </div>
    );
};

export default Searcher;
