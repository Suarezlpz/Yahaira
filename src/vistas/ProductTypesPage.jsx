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
  useGetProductTypes,
  useCreateProductTypes,
  useUpdateProductTypes,
  useDeleteProductTypes, } from '../services/ProductTypesServices';

const validateRequired = (value) => !!value.length;
function validateProductType(product_types) {
  return {
    name: !validateRequired(product_types.name)
      ? 'Ingrese el Nombre del Tipo de Producto'
      : '',
  };
}

const Example = () => {

  const [validationErrors, setValidationErrors] = useState({});
  const userData = storage.get('user');
  const token = userData.token;
  const [productTypes, setProductTypes] = useState([]);

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
    isError: isLoadingTProductTypeError,
    isFetching: isFetchingProductTypes,
    isLoading: isLoadingProductTypes,
  } = useGetProductTypes({token});

  /*useEffect(() => {
    if(fetchedData != ''){
      let tempProductType = []
      tempProductType = fetchedData.data.map((item) => {
        return item;
      })
      setProductTypes(tempProductType)
    }
  }, [fetchedData, productTypes]);*/

  //call CREATE hook
  const { mutateAsync: createProductType, isPending: isCreatingProductType } = useCreateProductTypes({token});

  //CREATE action
  const handleCreateProductType = async ({ values, table }) => {
    const newValidationErrors = validateProductType(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createProductType(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //call UPDATE hook
  const { mutateAsync: updateProductType, isPending: isUpdatingProductType } =
  useUpdateProductTypes({token});

  //UPDATE action
  const handleSaveProductType = async ({ values, table }) => {
    const newValidationErrors = validateProductType(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateProductType(values);
    table.setEditingRow(null); //exit editing mode
  };

  //call DELETE hook
  const { mutateAsync: deleteProductType, isPending: isDeletingProductType } =
  useDeleteProductTypes({token});

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Seguro de que quiere borrar este tipo de producto?')) {
      deleteProductType(row.original.id);
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
    onCreatingRowSave: handleCreateProductType,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveProductType,
    onEditingRowCancel: () => setValidationErrors({}),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Editar Tipo de Producto</DialogTitle>
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
    muiToolbarAlertBannerProps: isLoadingTProductTypeError
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
        <DialogTitle variant="h4">Crear Tipo de Producto</DialogTitle>
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
        Crear Tipo de Producto
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
      isLoading: isLoadingProductTypes,
      isSaving: isCreatingProductType || isUpdatingProductType || isDeletingProductType,
      showAlertBanner: isLoadingTProductTypeError,
      showProgressBars: isFetchingProductTypes,
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