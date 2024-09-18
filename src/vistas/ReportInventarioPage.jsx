import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
    Container, 
    Stack, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Select from '@mui/material/Select';
import { openAtom } from '../atoms/OpenAtom';
import { useAtomValue, useAtom } from 'jotai';
import IconButton from '@mui/material/IconButton';
import { userDataAtom } from '../atoms/UserDataAtom';
import { GetProducts } from '../services/GetProducts';
import { MaterialReactTable,  useMaterialReactTable, MRT_EditActionButtons} from 'material-react-table';
import _ from 'lodash';
import NuevoProductoModal from '../components/NuevoProductoModal';
import EditarProductoModal from '../components/EditarProductoModal';
import Fab from '@mui/material/Fab';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { storage } from '../utils/Storage';



const MaterialTable = () => {

    const [groupsPrecessed, setGroupsPrecessed] = React.useState(false);
    const getUserData = storage.get('user');
    const token = getUserData.token;
    const [openEditarProductoModal, setOpenEditarProductoModal] = React.useState(false);

    let tempRows = []
    let newData = []
    
    const [products, setProducts] = React.useState([''])
    const productsData = products.data

    const columns = ([
        {
            accessorKey: 'id',
            header: 'ID',
            size: 20,
            enableEditing: false,
            
        },
        {
            accessorKey: 'name',
            header: 'PRODUCTO',
            size: 150, 
        },
        {
            accessorKey: 'upc',
            header: 'UPC',
            grow: false,
            size: 150,
        },
        {
            accessorKey: 'amount',
            header: 'CANTIDAD',
        },
        {
            accessorKey: 'price',
            header: 'PRECIO',
        },
        {
            accessorKey: 'productType',
            header: 'TIPO',
        },
        {
            accessorKey: 'talla',
            header: 'TALLA',
        },
        {
            accessorKey: 'color',
            header: 'COLOR',
        },
        {
            accessorKey: 'sku',
            header: 'SKU',
        },
        {
            accessorKey: 'tienda',
            header: 'TIENDA',
        },
        {
            accessorKey: 'marca',
            header: 'MARCA',
        },
        ]);

    if(getUserData != ''){
        React.useEffect(() => {
            GetProducts({ token: token})
            .then(datos => setProducts(datos))
            .catch(datos => console.log(datos))
        }, []);
    }
    if(products != ''){
        tempRows = products.data.map((item) => {
            return item;
        });

        newData = tempRows.map((item) => {
            return item.skus.map(sku => ({
                id: item.id,
                name: item.name,
                marca: item.brand_id,
                upc: item.upc,
                amount: sku.available_in_stores[0].amount,
                price: sku.price,
                sku: sku.sku,
                color: sku.attribute_options[0].value,
                talla: sku.attribute_options[1].value,
                productType: item.product_type_id,
                tienda: sku.available_in_stores[0].store_id,
            }));
        }).flat();
    }

    React.useEffect(() => {
        const rows = newData;
        const groups = _.groupBy(rows, 'id');
        const processedGroups = Object.entries(groups).map(([k, v]) => {
            const groupsByUPC = _.groupBy(v, 'name');
            const subRows = Object.entries(groupsByUPC).map(([k2, v2]) => {
                const groupsByName = _.groupBy(v2, 'upc');
                const subRows2 = Object.entries(groupsByName).map(([k3, v3]) => {
                return {
                    upc: k3,
                    subRows: v3.map((v4) => ({
                        upc: v4.sku + ' - Talla: '+ v4.talla +' - Color: '+  v4.color,
                        productType: v4.productType,
                        amount: v4.amount,
                        talla: v4.talla,
                        color: v4.color,
                        price: v4.price,
                        sku: v4.sku,
                        tienda: v4.tienda,
                        marca: v4.marca

                    }))
                };
            });
            return {
            name: k2,
            subRows: subRows2
            };
        });
        return {
            id: k,
            upc: v[0].upc,
            name: v[0].name,
            subRows: subRows
        };
        });
    
        if (!_.isEqual(processedGroups, groupsPrecessed)) {
        setGroupsPrecessed(processedGroups);
        }
    
    }, [newData, groupsPrecessed, products]);

    const table = useMaterialReactTable({
        columns,
        data: groupsPrecessed,
        enableFilters: false,
        enableDensityToggle: false,
        enableHiding: false,
        getRowId: (row) => row.id,
        getSubRows:(originalRow) => originalRow.subRows,
        enableEditing: true,
        initialState: {
            density:'compact',
            columnPinning: {
                left: ['mrt-row-expand'],
                right: ['mrt-row-actions'],
            },
            columnVisibility: {
                productType: false,
                talla: false,
                color: false,
                sku: false,
                tienda: false,
            }
        },
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Editar">
                <IconButton onClick={() => {
                    setOpenEditarProductoModal(true);
                    table.setEditingRow(row);
                }}>
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
        renderEditRowDialogContent: ({ table, row}) => (
            <>
               <EditarProductoModal abrir={openEditarProductoModal}  table={table} row={row} setOpen={setOpenEditarProductoModal}/>
               {console.log(row, 'asdasd')}
            </>
          ),
        enableExpanding: true,
        muiTableContainerProps:{sx: { maxHeight: 400 }},
        paginateExpandedRows: false,
    })
    
    return  (<>
    <MaterialReactTable table={table} />
    </>)
};
    

export default function ReportsLocalPage(){
    const open = useAtomValue(openAtom);
    const [openNuevoProductoModal, setOpenNuevoProductoModal] = React.useState(false);

    return(
        <Container sx={{ marginTop: '79px', marginLeft: open === false? '40px':'200px'}}>
            <Box height={'92vh'} maxWidth={'70vw'}>
                <Box flexGrow={1} sx={{ height: '500px', minWidth: '50vw', maxWidth: '90vw'}}>
                    <MaterialTable></MaterialTable>
                </Box>
                <Fab color="primary" sx={{position: 'absolute', bottom: 16, right: 18,}} 
                    aria-label="add" onClick={() =>{
                        setOpenNuevoProductoModal(true);
                    }}>
                    <AddBoxIcon />
                </Fab>
            </Box>
            <NuevoProductoModal abrir={openNuevoProductoModal} setOpen={setOpenNuevoProductoModal}/>
            
        </Container>
    )
}
