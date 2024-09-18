import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useMemo, useState, useEffect } from 'react';
import { IsCreatingClientAtom } from '../atoms/ClienteAtom';
import { 
  Container, 
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  TextField,
} from '@mui/material';
import { openAtom } from '../atoms/OpenAtom';
import { useAtomValue, useAtom } from 'jotai';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { MaterialReactTable, useMaterialReactTable, MRT_EditActionButtons,} from 'material-react-table';
import _ from 'lodash';
import { storage } from '../utils/Storage';
import CrearClieteModal from '../components/CrearClienteModal';
import EditarClieteModal from '../components/EditarClienteModal';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { 
  useGetClients,
  useCreateClients,
  useUpdateClients,
  useDeleteClients,
} from '../services/ClientsServices';
import dayjs from 'dayjs';

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato YYYY-MM-DD
  if (!date.match(dateRegex)) {
      return false;
  }
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};
function validateCliente(client) {
  return {
    primer_nombre: !validateRequired(client.primer_nombre)
    ? 'Ingrese el Nombre del Cliente'
    : '',

    primer_apellido: !validateRequired(client.primer_apellido)
    ? 'Ingrese el Apellido del Cliente'
    : '',

    nacionalidad: !validateRequired(client.nacionalidad)
    ? 'Selecione una Nacionalidad'
    : '',

    fecha_nacimiento: !validateDate(client.fecha_nacimiento)
    ? 'Ingrese un Formato de Fecha Valido. Ejemplo: 2024-02-20'
    : '',

    email: !validateEmail(client.email) ? 'Formato de Correo Incorrecto' : '',
  };
}


const Example = () => {

  const [validationErrors, setValidationErrors] = useState({});
  const userData = storage.get('user');
  const token = userData.token;
  const [clientes, setClientes] = useState([]);
  const [nacionalidades, setNacionalidades] = useState(['V', 'E']);
  const [openCrearClienteModal, setOpenCrearClienteModal] = React.useState(false);
  const [openEditarClienteModal, setOpenEditarClienteModal] = React.useState(false);
  const isCreatingClient = useAtomValue(IsCreatingClientAtom);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'nacionalidad',
        header: 'Nacionalidad',
        editVariant: 'select',
        editSelectOptions: nacionalidades,
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.nacionalidad,
          helperText: validationErrors?.nacionalidad,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nacionalidad: undefined,
            }),
        },
      },
      {
        accessorKey: 'cedula',
        header: 'Cedula',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.cedula,
          helperText: validationErrors?.cedula,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              cedula: undefined,
            }),
        },
      },
      {
        accessorKey: 'primer_nombre',
        header: 'Primer Nombre',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.primer_nombre,
          helperText: validationErrors?.primer_nombre,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              primer_nombre: undefined,
            }),
        },
      },
      {
        accessorKey: 'segundo_nombre',
        header: 'Segundo Nombre',
        muiEditTextFieldProps: {
          error: !!validationErrors?.segundo_name,
          helperText: validationErrors?.segundo_name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              segundo_name: undefined,
            }),
        },
      },
      {
        accessorKey: 'primer_apellido',
        header: 'Primer Apellido',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.primer_apellido,
          helperText: validationErrors?.primer_apellido,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              primer_apellido: undefined,
            }),
        },
      },
      {
        accessorKey: 'segundo_apellido',
        header: 'Segundo Apellido',
        muiEditTextFieldProps: {
          error: !!validationErrors?.segundo_apellido,
          helperText: validationErrors?.segundo_apellido,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              segundo_apellido: undefined,
            }),
        },
      },
      {
        accessorKey: 'fecha_nacimiento',
        header: 'Fecha Nacimiento',
        editVariant: 'date',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.fecha_nacimiento,
          helperText: validationErrors?.fecha_nacimiento,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              fecha_nacimiento: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Correo',
        muiEditTextFieldProps: {
          required: true,
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
        accessorKey: 'phone',
        header: 'Telefono',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.phone,
          helperText: validationErrors?.phone,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              phone: undefined,
            }),
        },
      },
    ],
    [validationErrors],
  );

  const {
    data: fetchedData = [],
    isError: isLoadingClienteError,
    isFetching: isFetchingCliente,
    isLoading: isLoadingCliente,
  } = useGetClients({token});

  useEffect(() => {
    if(fetchedData != ''){
      let tempCliente = []
      tempCliente = fetchedData.data.map((item) => {
        return item;
      })
      setClientes(tempCliente)
    }
  }, [fetchedData, clientes]);


  //call DELETE hook
  const { mutateAsync: deleteCliente, isPending: isDeletingCliente } =
  useDeleteClients({token});

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Seguro de que quiere borrar este Cliente?')) {
      deleteCliente(row.original.id);
    }
  };

  
  const table = useMaterialReactTable({
    columns,
    data: clientes,
    createDisplayMode: 'modal', // ('modal', and 'custom' are also available)
    editDisplayMode: 'modal', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableFilters: false,
    enableDensityToggle: false,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    renderEditRowDialogContent: ({ table, row, }) => (
      <>  
        <EditarClieteModal abrir={openEditarClienteModal}  table={table} row={row} setOpen={setOpenEditarClienteModal}/>    
      </>
    ),
    muiToolbarAlertBannerProps: isLoadingClienteError
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
    renderRowActions: ({ row, table, }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton onClick={() =>{
            setOpenEditarClienteModal(true);
            table.setEditingRow(row)}}>
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
    renderTopToolbarCustomActions: ({ table }) => (
     <>
      <Button
        variant="contained"
        onClick={() => {
          setOpenCrearClienteModal(true);
        }}
      >
        Crear Cliente
      </Button>
        <CrearClieteModal abrir={openCrearClienteModal}  table={table} setOpen={setOpenCrearClienteModal}/>
     </> 
    ),
    initialState: {
      density:'compact',
      columnPinning: {
          left: ['mrt-row-expand'],
          right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading: isLoadingCliente,
      isSaving: isDeletingCliente,
      showAlertBanner: isLoadingClienteError,
      showProgressBars: isFetchingCliente,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

export default function ClientsPage(){

  const open = useAtomValue(openAtom);

  return(
    <Container sx={{ marginTop: '79px', marginLeft: open === false? '40px':'200px'}}>
        <Box display={'flex'} justifyContent={'left'} height={'10vh'}>
        </Box>
        <Box height={'81.9vh'} maxWidth={'70vw'}>
          <Box flexGrow={1} sx={{ height: '500px', minWidth: '50vw', maxWidth: '90vw'}}>
            <QueryClientProvider client={queryClient}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Example/>
              </LocalizationProvider>
            </QueryClientProvider>
          </Box>
        </Box>
    </Container>
  )
}