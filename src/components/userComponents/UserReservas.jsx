import { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import { Box, IconButton, Tooltip,} from '@mui/material';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import "../../styles/canchasTable.css"
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import styles from "../../styles/panelAdmin.module.css"
import { GlobalContext } from '../../context/globalContext';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { Link } from 'react-router-dom';
import {routes} from "../../utils/route"


const Table = () => {
  const { state:  globalState, getDetail } = useContext(GlobalContext);
  const {state: userState} = useContext(UserContext)
  const url = import.meta.env.VITE_API_URL;

  const deleteReservation = (id) =>{
    const confirm = window.confirm("¿Desea cancelar la reserva en la cancha" + id + "?")
    if(confirm){
      axios.delete(url+`api/v1/clients/reservations/${id}` , {headers: {Authorization: `Bearer ${userState.jwt}`}})
      .then(() => {
          alert(`Reserva eliminada.`);
      })
      .catch(err=> console.log(err))
    }
  }


    const infoReservas = [
        {
          "id": 0,
          "date": "2024-09-09",
          "startTime": {
            "hour": 0,
            "minute": 0,
            "second": 0,
            "nano": 0
          },
          "endTime": {
            "hour": 0,
            "minute": 0,
            "second": 0,
            "nano": 0
          },
          "fullPrice": 0,
          "userId": 0,
          "pitchId": 0 //Aqui con el id de la cancha hacer un getDetail(pitchId) y poner la info de la cancha (nombre, localidad, deporte, fecha, imagen[0])
        }
      ]

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 20,
      },
      {
        accessorKey: 'date',
        header: 'Fecha',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'date',
        }),
      },
      {
        accessorKey: 'startTime',
        header: 'Desde',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'date',
        }),
      },
      {
        accessorKey: 'endTime',
        header: 'Hasta',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'date',
        }),
      },
      {
        accessorKey: 'fullPrice',
        header: 'Precio',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
        }),
      }
    ],
    [],
  );
  
  const {
    data: fetchedReserva = [],
    isError: isLoadingReservaError,
    isFetching: isFetchingReserva,
    isLoading: isLoadingCancha,
  } = useGetReservas();


  const table = useMaterialReactTable({
    columns,
    data: fetchedReserva,
    initialState: { columnVisibility: { id: false} },
    enableEditing: false,
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingReservaError
      ? { color: 'error', children: 'Error cargando datos' }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '300px',
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Ver detalles">
          <Link to={routes.detailSinId+row.original.pitchId}>
          <IconButton color="info">
            <InfoIcon />  
          </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Cancelar reserva">
          <IconButton color="error" onClick={() => deleteReservation(row.original.id)}>
            <DeleteIcon />  
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: isLoadingCancha,
      showAlertBanner: isLoadingReservaError,
      showProgressBars: isFetchingReserva,
    },
  });

  return <MaterialReactTable table={table} />;
};



function useGetReservas() {
  const { state, dispatch, getUserReservas } = useContext(GlobalContext);
  const { state: userState } = useContext(UserContext);
  const userId = userState.user?.userId || userState.operator?.userId || userState.admin?.userId;


  return useQuery(
      ['reservas', userId],  
      () => {
          if (userId) {
              return getUserReservas(userId);  
          }
          return Promise.resolve([]); 
      },
      {
          enabled: !!userId,
          refetchOnWindowFocus: false,
          onSuccess: (data) => {
              dispatch({ type: 'HISTORIAL_RESERVA', payload: data });
              console.log(data)
          },
          onError: (err) => {
              console.error(err);
          }
      }
  );
}


const queryClient = new QueryClient();

const UserReservas = () => (
  <>
  <div className={styles.panelAdminContainer}>
    <h2>Mis reservas</h2>
    <QueryClientProvider client={queryClient}>
      <Table />
    </QueryClientProvider>
  </div>
  
  </>
);

export default UserReservas;

const validateRequired = (value) => !!value.length;
const validateReserva = () => {
  const errors = {};
  return errors;
};