import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import {UserContext} from './userContext'

const initialState = { preCreateCancha: null, dataDetail: [], searchedPitch: [], pitchDetail: [], error: null, filteredReservas: [], reservasUser: null, createReserva: null, surfaces: null };

function reducer(state, action) {
    switch (action.type) {
        case 'DATA_DETAIL':
            return { ...state, dataDetail: action.payload, error: null };
        case 'SEARCHED_PITCH':
            return { ...state, searchedPitch: action.payload, error: null };
        case 'PITCH_DETAIL':
            return { ...state, pitchDetail: action.payload };
        case 'SEARCH_ERROR':
            return { ...state, searchedPitch: [], error: action.payload };
        case 'PRECREATE_CANCHA':
            return { ...state, preCreateCancha: action.payload, error: null};
        case 'CREATE_CANCHA':
            return { ...state, dataDetail: [...state.dataDetail, action.payload], error: null};
        case 'DELETE_CANCHA':
            return { ...state, dataDetail: action.payload, error: null};
        case 'FILTERED_RESERVAS':
            return { ...state, filteredReservas: action.payload }
        case 'HISTORIAL_RESERVA':
            return {...state, reservasUser: action.payload }
        case 'CREATE_RESERVA': 
            return {...state, createReserva: action.payload}
        case 'GET_SURFACES':
            return {...state, surfaces: action.payload}
        default:
            throw new Error('Unknown action type');
    }
}

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const urlApi = import.meta.env.VITE_API_URL
    const [state, dispatch] = useReducer(reducer, initialState);
    const {state: userState} = useContext(UserContext)

    //Todas las canchas de home (Accesibles con anonimo)
    // console.log(state.dataDetail)

    //Detalle de cancha (Especifica)
    // console.log(state.pitchDetail);

    //Ver las reservas de cancha especifica
    // console.log(state.filteredReservas);

    //Ver historial del usuario
    // console.log(state.reservasUser);

    const getAllPitches = useCallback(() => {
        return axios.get(urlApi)
            .then(response => {
                dispatch({ type: 'DATA_DETAIL', payload: response.data || [] });
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching dataDetail:', error);
                throw error; 
            });
    }, [urlApi]);
    
    useEffect(() => {
        getAllPitches(); 
    }, [getAllPitches]);
    
    

    useEffect(() => {
        if (userState.admin || userState.operator) {
            axios.get(`${urlApi}api/v1/operator/surfaces`, {
                headers: {
                    Authorization: `Bearer ${userState.jwt}`,
                },
            })
            .then((res) => {
                dispatch({ type: 'GET_SURFACES', payload: res.data });
            })
            .catch((error) => {
                console.error("Error fetching surfaces:", error);
            });
        }
    }, [urlApi, userState.jwt, userState.admin, userState.operator]);

    const getDetail = useCallback((id) => {
        axios.get(urlApi + `detail/${id}`)
            .then(res => {
                dispatch({ type: 'PITCH_DETAIL', payload: res.data });
            })
            .catch(error => {
                console.error("Error fetching detail:", error);
            });
    }, [urlApi]);
    
    const searchPitch = useCallback((location, deporte) => {
        const params = {};
        if (location) {
            params.location = location;
        }
        if (deporte !== 'Todos') {
            params.sport = deporte;
        }
    
        axios.get(`${urlApi}search`, { params })
            .then(res => {
                if (res.data.length > 0) {
                    dispatch({ type: 'SEARCHED_PITCH', payload: res.data });
                } else {
                    dispatch({ type: 'SEARCH_ERROR', payload: 'No se encontraron resultados.' });
                }
            })
            .catch(err => console.error('Error al realizar la búsqueda', err));
    }, [urlApi]);
    

    const createCancha = (canchaObject) => {
        axios.post(`${import.meta.env.VITE_API_URL}api/v1/operator/pitches`, canchaObject, {
            headers: {
                Authorization: `Bearer ${userState.jwt}`
            }
        })
        .then(res => {
            if (res.status == 201) {
                console.log(res.data)
                dispatch({ type: 'PRECREATE_CANCHA', payload: res.data});
                getAllPitches()
            } else {
                throw new Error('Error creating cancha', res.data.status);
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    const uploadImages = (images) =>{
        if(images!=null){
        const formData = new FormData();
        const ran = Math.random();
        for (let i = 0; i < images.length; i++) {
            formData.append('file', images[i])
            // formData.append("name", `pitch${state.preCreateCancha.id}_image${i+ran}`)
        }
        axios.post(`${urlApi}api/v1/operator/pitches/${state.preCreateCancha.id}/images`, formData, {
                headers: {
                    Authorization: `Bearer ${userState.jwt}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                if (res.status == 200) {
                    getAllPitches()
                } else {
                    throw new Error('Error creating cancha');
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    }

    const updateCancha = (canchaObject, id) => {
        console.log(id, canchaObject)
        axios.put(`${urlApi}api/v1/operator/pitches/${id}`, canchaObject, {
            headers: {
                Authorization: `Bearer ${userState.jwt}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status == 201) {
                    getAllPitches()
                } else {
                    throw new Error('Error creating user');
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const deleteCancha = (id)=>{
        axios.delete(urlApi+`api/v1/operator/pitches/${id}` , {headers: {Authorization: `Bearer ${userState.jwt}` }})
        .then(res => {
            alert(`Cancha eliminada.`)
            getAllPitches()
        })
        .catch(err=> console.log(err))
    }

    const reservasPorCancha = useCallback((id) => {
        axios.get(urlApi + `api/v1/clients/reservations/pitch/${id}`, {
            headers: {
                Authorization: `Bearer ${userState.jwt}` 
            }
        })
            .then(res => dispatch({ type: 'FILTERED_RESERVAS', payload: res.data })) 
            .catch(err => console.log(err));
    }, [urlApi, userState.jwt]);
    
    
    const getUserReservas = useCallback((id) => {
        if (!id) {
            return Promise.resolve([]);
        }
    
        return axios.get(`${urlApi}api/v1/clients/reservations/user/${id}`, {
            headers: {
                Authorization: `Bearer ${userState.jwt}`
            }
        })
        .then(res => {
            dispatch({ type: 'HISTORIAL_RESERVA', payload: res.data });
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return [];
        });
    }, [userState.jwt, urlApi]);
    
    
    const createReserva = (objectReserva) => {
        axios.post(urlApi + `api/v1/clients/reservations`, objectReserva, {
            headers: {
                Authorization: `Bearer ${userState.jwt}`
            }
        })
        .then(res => dispatch({type: 'CREATE_RESERVA', payload: res.data}))
        .catch(err => console.error(err));
    };
    

    return (
        <GlobalContext.Provider value={{ state, getDetail, searchPitch, createCancha, uploadImages, updateCancha, deleteCancha, dispatch, reservasPorCancha, getUserReservas, createReserva, getAllPitches }}>
            {children}
        </GlobalContext.Provider>
    );
};
