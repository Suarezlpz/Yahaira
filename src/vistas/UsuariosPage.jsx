import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { 
  Container, 
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { openAtom } from '../atoms/OpenAtom';
import { useAtomValue, useAtom } from 'jotai';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { MaterialReactTable, useMaterialReactTable, MRT_EditActionButtons } from 'material-react-table';
import _ from 'lodash';
import { storage } from '../utils/Storage';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { 
  useGetUsers,
  useCreateUsers,
  useUpdateUsers,
  useDeleteUsers, } from '../services/UsuariosServices';

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
function validateBrands(user) {
  return {
    name: !validateRequired(user.name)
      ? 'Ingrese el Nombre del Usuario'
      : '',
    email: !validateEmail(user.email) ? 'Formato de Correo Incorrecto' : '',
    role: !validateRequired(user.role) ? 'Ingrese el Rol del Usuario' : '',
  };
}

const Example = () => {

  const [validationErrors, setValidationErrors] = useState({});
  const userData = storage.get('user');
  const roles = ['admin', 'seller', 'depositary', 'manager'];
  const token = userData.token;
  const [users, setUsers] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        editVariant: 'select',
        editSelectOptions: roles,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.role,
          helperText: validationErrors?.role,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              role: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Correo',
        muiEditTextFieldProps: {
          required: true,
          type: 'email',
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'password',
        header: 'Contraseña',
        enableEditing: false,
      },
    ],
    [validationErrors],
  );

  const {
    data: fetchedData = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers({token});

  useEffect(() => {
    if(fetchedData != ''){
      let tempUsers = []
      tempUsers = fetchedData.data.map((item) => {
        return item;
      })
      setUsers(tempUsers)
    }
  }, [fetchedData, users]);

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUsers({token});

  //CREATE action
  const handleCreateUsers = async ({ values, table }) => {
    const newValidationErrors = validateBrands(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
  useUpdateUsers({token});

  //UPDATE action
  const handleSaveBrands = async ({ values, table }) => {
    const newValidationErrors = validateBrands(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
  useDeleteUsers({token});

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Seguro de que quiere borrar este Usuario?')) {
      deleteUser(row.original.id);
    }
  };

  
  const table = useMaterialReactTable({
    columns,
    data: users,
    createDisplayMode: 'modal', // ('modal', and 'custom' are also available)
    editDisplayMode: 'modal', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableFilters: false,
    enableDensityToggle: false,
    getRowId: (row) => row.id,
    onCreatingRowSave: handleCreateUsers,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBrands,
    onEditingRowCancel: () => setValidationErrors({}),
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error al cargar la data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '300px',
      },
    },
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Editar Usuario</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => 
            table.setEditingRow(row)
            }>
            <EditIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={() => {openDeleteConfirmModal(row)}}>
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Crear Nuevo Usuario</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
            table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Crear Usuario
      </Button>
    ),
    initialState: {
      density:'compact',
      columnPinning: {
        left: ['mrt-row-expand'],
        right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

export default function UsuariosPage(){

  const open = useAtomValue(openAtom);

  return(
    <Container sx={{ marginTop: '79px', marginLeft: open === false? '40px':'200px'}}>
        <Box display={'flex'} justifyContent={'left'} height={'10vh'}>
        </Box>
        <Box height={'81.9vh'} maxWidth={'70vw'}>
          <Box flexGrow={1} sx={{ height: '500px', minWidth: '50vw', maxWidth: '90vw'}}>
            <QueryClientProvider client={queryClient}>
              <Example/>
            </QueryClientProvider>
          </Box>
        </Box>
    </Container>
  )
}