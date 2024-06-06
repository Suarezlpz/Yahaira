import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Container, Stack, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import SearchBar from '../components/SearchBar';
import { openAtom } from '../atoms/OpenAtom';
import { useAtomValue, useAtom } from 'jotai';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import IconButton from '@mui/material/IconButton';

export default function ReportsVendorPage(){
    const open = useAtomValue(openAtom);
    const [marca, setMarca] = React.useState('');
    const [vendedor, setVendedor] = React.useState('');
    
    const [fechaFin, setFechaFin] = React.useState(dayjs());
    const [fechaInicio, setFechaInicio] = React.useState(dayjs());

    const handleChangeVendedor = (event) => {
        setVendedor(event.target.value);
    };

    const handleChangeMarca = (event) => {
        setMarca(event.target.value);
    };

    const columns = [
        { field: 'id', headerName: 'Codigo', width: 70 },
        { field: 'nombre', headerName: 'Nombre', width: 174 },
        { field: 'fecha', headerName: 'Fecha de Venta', width: 140 },
        { field: 'precio', headerName: 'Precio de Venta', width: 140 },
        { field: 'vendedor', headerName: 'Vendedor', width: 140 },
    ];
      
    const rows = [
        { id: 1, nombre: 'Low basketball shoes', fecha: fechaInicio, precio: 35, vendedor: 'vendedor 1'},
        { id: 2, nombre: 'Adidas Campus ADV', fecha: fechaInicio, precio: 42, vendedor:'vendedor 1'},
        { id: 3, nombre: 'Zapatillas Skate', fecha: fechaInicio, precio: 45, vendedor: 'vendedor 2'},
        { id: 4, nombre: 'VL Court 2.0', fecha: fechaInicio, precio: 16,vendedor: 'vendedor 2'},
      
    ];

    return(
        <Container sx={{ marginTop: '79px', marginLeft: open === false? '40px':'200px'}}>
            <Box display={'flex'} justifyContent={'left'} height={'10vh'}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack direction={'row'} spacing={2} margin={4}>
                        <DatePicker
                        label="Fecha Inicio"
                        value={fechaInicio}
                        onChange={(newValue) => setFechaInicio(newValue)}
                        />
                        <DatePicker
                        label="Fecha Fin"
                        value={fechaFin}
                        onChange={(newValue) => setFechaFin(newValue)}
                        />
                    </Stack>
                </LocalizationProvider>
                
                <FormControl sx={{ marginTop: 4, minWidth: 130, maxWidth: 200}}>
                    <InputLabel id="demo-simple-select-autowidth-label">Marca</InputLabel>
                    <Select
                    value={marca}
                    onChange={handleChangeMarca}
                    autoWidth
                    label="Marca"
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Adidas</MenuItem>
                    <MenuItem value={21}>ReeBok</MenuItem>
                    <MenuItem value={22}>NewBalance</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 4, minWidth: 130, maxWidth: 200}}>
                    <InputLabel id="demo-simple-select-autowidth-label">Vendedor</InputLabel>
                    <Select
                    value={vendedor}
                    onChange={handleChangeVendedor}
                    autoWidth
                    label="Vendedor"
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={23}>Todos</MenuItem>
                    <MenuItem value={24}>Vendedor1</MenuItem>
                    <MenuItem value={25}>Vendedor2</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box height={'80vh'} maxWidth={'70vw'}>
                <Box   display={'flex'}>
                    <Stack alignItems={'baseline'} spacing={2} width={'30vw'} flexDirection={'row'}>
                        <IconButton>
                            <PictureAsPdfRoundedIcon sx={{ fontSize: 40 }}/> 
                        </IconButton>
                        <IconButton>
                            <PictureAsPdfRoundedIcon sx={{ fontSize: 40 }}/> 
                        </IconButton>
                    </Stack>-
                    <Stack alignItems={'self-end'} spacing={2} m={2} width={'60vw'}>
                        <SearchBar></SearchBar>
                    </Stack>
                </Box>
                <div style={{display: 'flex', height: 400, justifyContent: 'center'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </div>
            </Box>
        </Container>
    )
}