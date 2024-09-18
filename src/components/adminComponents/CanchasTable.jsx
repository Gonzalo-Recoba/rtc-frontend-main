import { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import { Box, IconButton, Tooltip,} from '@mui/material';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import "../../styles/canchasTable.css"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {deportes } from '../../utils/localidades';
import styles from "../../styles/panelAdmin.module.css"
import { GlobalContext } from '../../context/globalContext';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { Link } from 'react-router-dom';
import {routes} from '../../utils/route'

const Table = ({setShowFormEdit}) => {
  const { state, getDetail, deleteCancha, dispatch } = useContext(GlobalContext);
  const {state: userState} = useContext(UserContext)
  const [validationErrors, setValidationErrors] = useState({});
  const [editedCancha, setEditedCancha] = useState({});
  const url = import.meta.env.VITE_API_URL;
  
  const editCancha = (id) => {
    if (id) {
      axios.get(url + `detail/${id}`)
        .then(res => {
            dispatch({ type: 'PITCH_DETAIL', payload: res.data });
            dispatch({ type: 'PRECREATE_CANCHA', payload: res.data});
            setShowFormEdit(true)
        })
        .catch(error => {
            console.error("Error fetching detail:", error);
        });
    }
  }

  // const verReservas = (id) =>{
  //     if (id) {
  //       reservasPorCancha(id)
  //       axios.get(url + `/api/v1/clients/reservations/pitch/${id}`,
  //         {headers: {
  //           Authorization: `Bearer ${userState.jwt}`
  //       }}
  //       )
  //         .then(res => {
  //           if(res.data.length == 0){
  //             alert("No hay reservas para esta cancha")
  //           } else {
  //               res.data.forEach(reserva => console.log(`
  //                   id reserva: ${reserva.id}
  //                   id cancha: ${reserva.pitchId}
  //                   fecha: ${reserva.date}
  //                   desde: ${reserva.startTime}
  //                   hasta: ${reserva.endTime}
  //                   cliente: ${reserva.userId}
  //                 `));
  //             }
  //             })
  //         .catch(error => {
  //             console.error("Error fetching reservation:", error);
  //         });
  //     }
  // }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 20,
      },
      {
        accessorKey: 'imagePaths[0]',
        header: '',
        Cell: ({ row }) => (
          <Box>
              <img src={row.original.imagePaths[0]} alt={`Foto ${row.original.id}`} style={{ width: '30%', height: '30%', margin: '5px' }} />
          </Box>
        )
      },
      {
        accessorKey: 'pitchName',
        header: 'Nombre Cancha',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value) ? 'Required' : undefined;
            setValidationErrors({ ...validationErrors, [cell.id]: validationError });
            setEditedCancha({ ...editedCancha, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'pitchLocation',
        header: 'Localidad',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value) ? 'Required' : undefined;
            setValidationErrors({ ...validationErrors, [cell.id]: validationError });
            setEditedCancha({ ...editedCancha, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'sport.sport',
        header: 'Tipo de Cancha',
        editVariant: 'select',
        editSelectOptions: deportes,
        size: 30,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'select',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onChange: (event) => {
            const validationError = !validateRequired(event.target.value) ? 'Required' : undefined;
            setValidationErrors({ ...validationErrors, [cell.id]: validationError });
            setEditedCancha({ ...editedCancha, [row.id]: row.original });
          },
        }),
      },
    ],
    [editedCancha, validationErrors],
  );
  
  const {
    data: fetchedCancha = [],
    isError: isLoadingCanchaError,
    isFetching: isFetchingCancha,
    isLoading: isLoadingCancha,
  } = useGetCancha();
    
    


  

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cancha ' + row.original.pitchName + ' ?')){
      if (row.original.id) {
        deleteCancha(row.original.id);
      }
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedCancha,
    initialState: { columnVisibility: { direccion: false, fotos: false, id: false, descripcionDetail: false, mapa: false, horario: false, suelo:false, estacionamiento:false, vestuario: false, buffet:false, inputImages:false } },
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingCanchaError
      ? { color: 'error', children: 'Error cargando datos' }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        
        {/* <Tooltip title="Ver reservas">
          <IconButton color="info" onClick={() => alert("Ver reservas de " + row.original.pitchName)}>
            <TroubleshootIcon />  
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Ver reservas">
        <Link to={`${routes.canchasReservasSinId}${row.id}`}>
          <IconButton color="info">
            <CalendarMonthIcon /> 
          </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton color="info" onClick={() => editCancha(row.id)}>
            <EditIcon /> 
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />  
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: isLoadingCancha,
      showAlertBanner: isLoadingCanchaError,
      showProgressBars: isFetchingCancha,
    },
  });

  return <MaterialReactTable table={table} />;
};



function useGetCancha() {
  const { getAllPitches } = useContext(GlobalContext);

  return useQuery({
    queryKey: ['canchas'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      const data = await getAllPitches(); 
      console.log(data);
      
      return data; 
    },
    refetchOnWindowFocus: false,
  });
}


const queryClient = new QueryClient();

const CanchasTable = ({setShowFormEdit}) => (
  <div className={styles.panelAdminContainer}>
    <QueryClientProvider client={queryClient}>
      <Table setShowFormEdit={setShowFormEdit} />
    </QueryClientProvider>
  </div>
);

export default CanchasTable;

const validateRequired = (value) => !!value.length;
const validateCancha = () => {
  const errors = {};
  return errors;
};