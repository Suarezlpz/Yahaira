import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Container, Stack, MenuItem, FormControl, InputLabel} from '@mui/material';
import Select from '@mui/material/Select';
import SearchBar from '../components/SearchBar';
import { openAtom } from '../atoms/OpenAtom';
import { useAtomValue, useAtom } from 'jotai';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import IconButton from '@mui/material/IconButton';
import { userDataAtom } from '../atoms/UserDataAtom';
import { GetProducts } from '../services/GetProducts';
import { MaterialReactTable } from 'material-react-table';
import _ from 'lodash';
import AgregarProductoInventario from '../components/AgregarProductoInventario';
import NuevoProductoModal from '../components/NuevoProductoModal';
import Fab from '@mui/material/Fab';
import AddBoxIcon from '@mui/icons-material/AddBox';


export default function ReportsLocalPage(){
    const open = useAtomValue(openAtom);
    const [marca, setMarca] = React.useState('');
    const [local, setLocal] = React.useState('');
    const [openNuevoProductoModal, setOpenNuevoProductoModal] = React.useState(false);
    const [groupsPrecessed, setGroupsPrecessed] = React.useState([]);


    let tempRows = []
    let newData = []
    

    const userData = useAtomValue(userDataAtom)
    const [products, setProducts] = React.useState([''])
    const productsData = products.data

    if(userData != ''){
        React.useEffect(() => {
            GetProducts({ token: userData.token })
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
                upc: item.upc,
                amount: sku.available_in_stores[0].amount,
                price: sku.price,
                sku: sku.sku,
                color: sku.attribute_options[0].value,
                talla: sku.attribute_options[1].value,
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
                    amount: v4.amount,
                    price: v4.price,
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
            subRows: subRows
        };
        });
    
        // Solo actualizar el estado si los datos han cambiado
        if (!_.isEqual(processedGroups, groupsPrecessed)) {
        setGroupsPrecessed(processedGroups);
        }
    
    }, [newData, groupsPrecessed]);


    return(
        <Container sx={{ marginTop: '79px', marginLeft: open === false? '40px':'200px'}}>
            <Box height={'92vh'} maxWidth={'70vw'}>
                <Box flexGrow={1} sx={{ height: '500px', minWidth: '50vw', maxWidth: '90vw'}}>
                    <MaterialReactTable
                        enableFilters={false}
                        enableDensityToggle = {false}
                        initialState={{density:'compact'}}
                        enableExpanding= {true}
                        columns={columns}
                        data={groupsPrecessed}
                        getSubRows={(originalRow) => originalRow.subRows}
                        muiTableContainerProps={ {sx: { maxHeight: 400 }} }
                        paginateExpandedRows={false}
                    />
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

const columns = ([
    {
      accessorKey: 'id',
      header: 'ID',
      size: 20,
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
  ]);