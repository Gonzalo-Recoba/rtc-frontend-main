import { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import "../../styles/canchasTable.css";
import EditIcon from '@mui/icons-material/Edit';
import { userType } from '../../utils/localidades';
import styles from "../../styles/panelAdmin.module.css";
import { UserContext } from '../../context/userContext';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const { updateUserRole, state } = useContext(UserContext);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Nombre',
        enableEditing: false,
        muiEditTextFieldProps: ({ cell }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
        }),
      },
      {
        accessorKey: 'lastName',
        header: 'Apellido',
        enableEditing: false,
        muiEditTextFieldProps: ({ cell }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableEditing: false,
        muiEditTextFieldProps: ({ cell }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
        }),
      },
      {
        accessorKey: 'type',
        header: 'Tipo de usuario',
        editVariant: 'select',
        editSelectOptions: userType.map(type => ({ value: type, label: type })),
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
          onChange: (event) => {
            const updatedUser = { ...row.original, type: event.target.value };
            setEditedUser({ ...editedUser, [row.id]: updatedUser });
            if (updatedUser.type !== row.original.type) {
              updateUserRole(row.original.email, updatedUser.type);
            }
          },
        }),
      }
    ],
    [updateUserRole, editedUser, validationErrors]
  );

  const table = useMaterialReactTable({
    columns,
    data: state.allUsers,
    initialState: { columnVisibility: { id: false } },
    editDisplayMode: 'table',
    enableEditing: true,
    enableRowActions: false,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: state.error
      ? { color: 'error', children: 'Error cargando datos' }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (values, table) => {
      const newValidationErrors = validateUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      table.setCreatingRow(null);
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton color="info" onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: state.allUsers.length === 0,
      isSaving: false,
      showAlertBanner: state.error,
      showProgressBars: false,
    },
  });

  return <MaterialReactTable table={table} />;
};

// Función de validación (puedes agregar más reglas si es necesario)
const validateUser = (values) => {
  const errors = {};
  // Aquí puedes agregar validaciones específicas para los campos
  return errors;
};

// Hooks para crear, leer, actualizar y eliminar usuarios

function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        { ...newUserInfo, id: (Math.random() + 1).toString(36).substring(7) },
      ]);
    },
  });
}

function useGetUser() {
  const { state } = useContext(UserContext);
  
  const allUsers = state.allUsers.map(user => {
    return {...user, type: "user"};
  });
  
  const allUsersDataConcat = allUsers.concat(state.operatorList);
  const [allUsersData, setallUsersData] = useState(allUsersDataConcat);

  useEffect(() => {
    setallUsersData(allUsers.concat(state.operatorList));
  }, [state.userList, state.operatorList, allUsers]);

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => allUsersData,
    refetchOnWindowFocus: true,
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newUsers) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((user) => {
          const newUser = newUsers.find((c) => c.id === user.id);
          return newUser ? newUser : user;
        }),
      );
    },
  });
}

function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
  });
}

const queryClient = new QueryClient();

const UsersTable = () => (
  <div className={styles.panelAdminContainer}>
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  </div>
);

export default UsersTable;
