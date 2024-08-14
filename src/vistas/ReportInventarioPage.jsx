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
import { userDataAtom } from '../atoms/UserDataAtom';



export default function ReportsLocalPage(){
    const open = useAtomValue(openAtom);
    const [marca, setMarca] = React.useState('');
    const [local, setLocal] = React.useState('');
    
    const [fechaFin, setFechaFin] = React.useState(dayjs());
    const [fechaInicio, setFechaInicio] = React.useState(dayjs());

    const handleChangeLocal = (event) => {
        setLocal(event.target.value);
    };

    const handleChangeMarca = (event) => {
        setMarca(event.target.value);
    };

    
    const [searchProduct, setSearchProduct] = React.useState('');


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nombre', width: 174 },
        { field: 'upc', headerName: 'UPC', width: 140 },
    ];
    const userData = useAtomValue(userDataAtom)
    const [products, setProducts] = React.useState([])
      
    React.useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", userData.token);
        
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
        
        fetch("http://34.234.73.134:8088/api/products", requestOptions)
          .then((response) => response.json())
          .then((result) => setProducts(result))
          .catch((error) => console.error(error));

    }, []);


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
                    <InputLabel id="demo-simple-select-autowidth-label">Local</InputLabel>
                    <Select
                    value={local}
                    onChange={handleChangeLocal}
                    autoWidth
                    label="Local"
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={23}>Todos</MenuItem>
                    <MenuItem value={24}>Margarita</MenuItem>
                    <MenuItem value={25}>Caracas</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box height={'81.9vh'} maxWidth={'70vw'}>
                <Box display={'flex'}>
                    <Stack alignItems={'baseline'} spacing={2} width={'30vw'} flexDirection={'row'}>
                        <IconButton>
                            <PictureAsPdfRoundedIcon sx={{ fontSize: 40 }}/> 
                        </IconButton>
                        <IconButton>
                            <PictureAsPdfRoundedIcon sx={{ fontSize: 40 }}/> 
                        </IconButton>
                    </Stack>
                    <Stack alignItems={'self-end'} spacing={2} m={2} width={'60vw'}>
                        <SearchBar setSearchData={setSearchProduct}></SearchBar>
                    </Stack>
                </Box>

                {/*<div style={{display: 'flex', height: 400, justifyContent: 'center'}}>
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
                </div>*/}
            </Box>
        </Container>
    )
}