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
  useGetAttributes,
  useCreateAttributes,
  useUpdateAttributes,
  useDeleteAttributes,
} from '../services/AttributesServices';

const validateRequired = (value) => !!value.length;
function validateTienda(store) {
  return {
    name: !validateRequired(store.name)
      ? 'Ingrese el Nombre del Atributp'
      : '',
  };
}

const Example = () => {

  const [validationErrors, setValidationErrors] = useState({});
  const userData = storage.get('user');
  const token = userData.token;
  const [tiendas, setTiendas] = useState([]);

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
    isError: isLoadingAttributeError,
    isFetching: isFetchingAttribute,
    isLoading: isLoadingAttribute,
  } = useGetAttributes({token});


 /* useEffect(() => {
    if(fetchedData != ''){
      let tempTienda = []
      tempTienda = fetchedData.data.map((item) => {
        return item;
      })
      setTiendas(tempTienda)
    }
  }, [fetchedData, tiendas]);*/

  //call CREATE hook
  const { mutateAsync: createAttribute, isPending: isCreatingAttribute } = useCreateAttributes({token});

  //CREATE action
  const handleCreateAttribute = async ({ values, table }) => {
    const newValidationErrors = validateTienda(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createAttribute(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //call UPDATE hook
  const { mutateAsync: updateAttribute, isPending: isUpdatingAttribute } =
  useUpdateAttributes({token});

  //UPDATE action
  const handleSaveAttribute = async ({ values, table }) => {
    const newValidationErrors = validateTienda(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateAttribute(values);
    table.setEditingRow(null); //exit editing mode
  };

  //call DELETE hook
  const { mutateAsync: deleteAttribute, isPending: isDeletingAttribute } =
  useDeleteAttributes({token});

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Seguro de que quiere borrar este Atributo?')) {
      deleteAttribute(row.original.id);
    }
  };

  
  const table = useMaterialReactTable({
    columns,
    data: fetchedData,
    createDisplayMode: 'modal', // ('modal', and 'custom' are also available)
    editDisplayMode: 'modal', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableFilters: false,
    enableDensityToggle: false,
    getRowId: (row) => row.id,
    onCreatingRowSave: handleCreateAttribute,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveAttribute,
    onEditingRowCancel: () => setValidationErrors({}),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Editar Atributo</DialogTitle>
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
    muiToolbarAlertBannerProps: isLoadingAttributeError
      ? {
          color: 'error',
          children: 'Error al cargar el Atributo',
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
          <IconButton onClick={() => table.setEditingRow(row)}>
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
        <DialogTitle variant="h4">Crear Nuevo Atributo</DialogTitle>
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
        Crear Atributo
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
      isLoading: isLoadingAttribute,
      isSaving: isCreatingAttribute || isUpdatingAttribute || isDeletingAttribute,
      showAlertBanner: isLoadingAttributeError,
      showProgressBars: isFetchingAttribute,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

export default function AttributesPage(){

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