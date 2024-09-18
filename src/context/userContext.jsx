import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";

const initialState = {
    admin: JSON.parse(localStorage.getItem('admin')) || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    operator: JSON.parse(localStorage.getItem('operator')) || null,
    allUsers: [],
    error: null,
    jwt: localStorage.getItem('jwt') || null
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_ADMIN': {
            localStorage.setItem('admin', JSON.stringify(action.payload));
            return {
                ...state,
                admin: action.payload,
                jwt: action.payload.jwt || state.jwt
            };
        }
        case 'SET_OPERATOR': {
            localStorage.setItem('operator', JSON.stringify(action.payload));
            return {
                ...state,
                operator: action.payload,
                jwt: action.payload.jwt || state.jwt
            };
        }
        case 'SET_USER': {
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
                jwt: action.payload.jwt || state.jwt
            };
        }
        case 'LOG_OUT': {
            localStorage.removeItem('jwt');
            localStorage.removeItem('admin');
            localStorage.removeItem('user');
            localStorage.removeItem('operator');
            return {
                ...state,
                admin: null,
                user: null,
                operator: null,
                jwt: null
            };
        }
        case 'LOG_IN': {
            const role = action.payload.role;
            if (role === 'ADMIN') {
                localStorage.setItem('admin', JSON.stringify(action.payload));
            } else if (role === 'CLIENT') {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else if (role === 'OPERATOR') {
                localStorage.setItem('operator', JSON.stringify(action.payload));
            }
            localStorage.setItem('jwt', action.payload.jwt);
            return {
                ...state,
                admin: role === 'ADMIN' ? action.payload : state.admin,
                user: role === 'CLIENT' ? action.payload : state.user,
                operator: role === 'OPERATOR' ? action.payload : state.operator,
                jwt: action.payload.jwt
            };
        }
        case 'GET_ALL_USERS': {
            return {
                ...state,
                allUsers: action.payload
            };
        }
        case 'SET_ERROR': {
            return {
                ...state,
                error: action.payload
            };
        }
        default:
            throw new Error('Unknown action type');
    }
}

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const createUser = (userObject) => {
        axios.post(`${import.meta.env.VITE_API_URL}auth/signup`, userObject, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.data.status === true) {
                localStorage.setItem('jwt', res.data.jwt);
                dispatch({ type: 'SET_USER', payload: res.data });
                console.log(res.data.jwt);
            } else {
                throw new Error('Error creating user');
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    const login = (loginObject) => {
        axios.post(`${import.meta.env.VITE_API_URL}auth/login`, loginObject)
        .then(res => {
            if (res.data.status === true) {
                dispatch({ type: 'LOG_IN', payload: res.data });
            } else {
                throw new Error('Error en el login');
            }
        })
        .catch(error => {
            if (error.response && error.response.status === 403) {
                dispatch({ type: 'SET_ERROR', payload: "Email NO registrado" });
            } else {
                dispatch({ type: 'SET_ERROR', payload: "Error en el servidor" });
            }
        });
    };

    const logout = () => {
        dispatch({ type: 'LOG_OUT' });
    };

    const fetchUsersIfAdmin = useCallback(async () => {
        if (state.admin && state.jwt) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/admin/get/user`, {
                    headers: {
                        Authorization: `Bearer ${state.jwt}`
                    }
                });
                if (response.data.length > 0) {
                    const filteredUsers = response.data.filter(user => {
                        return user.roles.includes('CLIENT') || user.roles.includes('OPERATOR');
                    });
                    dispatch({ type: 'GET_ALL_USERS', payload: filteredUsers });
                }
            } catch (error) {
                console.log('There was an error!', error);
            }
        }
    }, [state.admin, state.jwt]);
    
    

    const updateUserRole = async (email, newRole) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}api/v1/admin/edit/user/doadmin/${email}`, {
                role: newRole
            }, {
                headers: {
                    Authorization: `Bearer ${state.jwt}`
                }
            });
            fetchUsersIfAdmin();
        } catch (error) {
            console.log('Error updating user role:', error);
        }
    };

    useEffect(() => {
        fetchUsersIfAdmin();
    }, [state.admin, state.jwt, fetchUsersIfAdmin]);

    return (
        <UserContext.Provider value={{ state, createUser, updateUserRole, logout, dispatch, login  }}>
            {children}
        </UserContext.Provider>
    );
};
