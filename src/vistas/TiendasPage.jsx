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
  useGetTiendas,
  useCreateTienda,
  useUpdateTienda,
  useDeleteTienda,
} from '../services/TiendasServices';
import CrearTiendaModal from '../components/CrearTiendaModal';
import EditarTiendaModal from '../components/EditarTiendaModal';

const validateRequired = (value) => !!value.length;
function validateTienda(store) {
  return {
    name: !validateRequired(store.name)
      ? 'Ingrese el Nombre de la Tienda'
      : '',
  };
}

const Example = () => {

  const [validationErrors, setValidationErrors] = useState({});
  const userData = storage.get('user');
  const token = userData.token;
  const [tiendas, setTiendas] = useState([]);  
  const [openEditarTiendaModal, setOpenEditarTiendaModal] = useState(false);
  const [openCrearTiendaModal, setOpenCrearTiendaModal] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
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
    ],
    [validationErrors],
  );

  const {
    data: fetchedData = [],
    isError: isLoadingTiendaError,
    isFetching: isFetchingTienda,
    isLoading: isLoadingTienda,
  } = useGetTiendas({token});

  useEffect(() => {
    if(fetchedData != ''){
      let tempTienda = []
      tempTienda = fetchedData.data.map((item) => {
        return item;
      })
      setTiendas(tempTienda)
    }
  }, [fetchedData, tiendas]);

  //call DELETE hook
  const { mutateAsync: deleteTienda, isPending: isDeletingTienda } =
  useDeleteTienda({token});

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Seguro de que quiere borrar esta Tienda?')) {
      deleteTienda(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: tiendas,
    createDisplayMode: 'modal', // ('modal', and 'custom' are also available)
    editDisplayMode: 'modal', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableFilters: false,
    enableDensityToggle: false,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    renderEditRowDialogContent: ({ table, row,  }) => (
      <>
        <EditarTiendaModal abrir={openEditarTiendaModal}  table={table} row={row} setOpen={setOpenEditarTiendaModal}/>   
      </>
    ),
    muiToolbarAlertBannerProps: isLoadingTiendaError
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
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => {
            setOpenEditarTiendaModal(true);
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
    renderTopToolbarCustomActions: ({ table, row }) => (
      <><Button
        variant="contained"
        onClick={() => {
          setOpenCrearTiendaModal(true);
          //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Crear Tienda
      </Button>
        <CrearTiendaModal abrir={openCrearTiendaModal}  table={table} row={row} setOpen={setOpenCrearTiendaModal}/>    
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
      isLoading: isLoadingTienda,
      isSaving: isDeletingTienda,
      showAlertBanner: isLoadingTiendaError,
      showProgressBars: isFetchingTienda,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

export default function ProductTypesPage(){

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