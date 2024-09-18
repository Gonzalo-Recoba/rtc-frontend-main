import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import CalendarioReservaProvisorio from '../components/bookingComponents/CalendarioReservaProvisorio';

const BookingPage = () => {
    const { state } = useContext(UserContext);
    const navigate = useNavigate();

    if (!state.user && !state.operator && !state.admin) {
        navigate('/'); 
        return null; 
    }

    return (
    <>
        <CalendarioReservaProvisorio/>
    </>
)
};

export default BookingPage;