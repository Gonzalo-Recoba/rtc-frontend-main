import React from 'react';
import styles from '../../styles/cardReserva.module.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

const CardReserva = ({ reserva }) => {
  const { date, startTime, endTime, fullPrice } = reserva;
  return (
    <div className={styles.card}>
      <p className={styles.item}><CalendarMonthOutlinedIcon sx={{ color: '#00A991' }}/><strong>Fecha:</strong>{date.replaceAll('-', "/")}</p>
      <p className={styles.item}><AccessTimeIcon sx={{ color: '#00A991' }}/><strong>Hora:</strong>{startTime.slice(0, 5)}-{endTime.slice(0, 5)}</p>
      <p className={styles.item}><AttachMoneyOutlinedIcon sx={{ color: '#00A991' }}/><strong>Precio Total:</strong>${fullPrice}</p>
      {/* <p><strong>☎️ Contacto:</strong> user@reservatucancha.com</p> */}
    </div>
  );
};

export default CardReserva;
