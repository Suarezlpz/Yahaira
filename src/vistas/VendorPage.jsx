import React, { useState } from 'react';
import { Button, Container, ListItemAvatar, ListItemButton, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SearchBar from '../components/SearchBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { openAtom } from '../atoms/OpenAtom';
import { useAtomValue, useAtom } from 'jotai';
import BasicModal from '../components/NuevoClienteModal';
import { clienteAtom } from '../atoms/ClienteAtom';
import AgregarProductoModal from '../components/AgregarProductoModal';
import { DataGrid } from '@mui/x-data-grid';
import { productoAtom } from '../atoms/productoAtom';


export default function VendorPage(){

    const [searchCliente, setSearchCliente] = useState('');
    const [selectCliente, setSelectCliente] = useState('');
    const [openClienteModal, setOpenClienteModal] = useState(false);
    const [openProductoModal, setOpenProductoModal] = useState(false);
    const navigate = useNavigate();
    const open = useAtomValue(openAtom);

    const nuevoClienteModal = useAtomValue(clienteAtom)
    const [cliente, setCliente] = React.useState(
        clientesList
    );

    const handleSubmit = (event) => {
        const insertAt = 0; 
        const nextcliente = [ ...cliente.slice(0, insertAt),
        { 
            cedula: parseInt(nuevoClienteModal.cedula), 
            nombre: nuevoClienteModal.nombre, 
            telefono: parseInt(nuevoClienteModal.telefono), 
            direccion: nuevoClienteModal.direccion,
        },
        ...cliente.slice(insertAt)
        ]; setCliente(nextcliente);
        console.log('actuliza cliente',cliente);
      };

    const nuevoProductoModal = useAtomValue(productoAtom)
    const [producto, setProducto] = React.useState(
        rows
    );

    const handleProducto = (event) => {
        const insertAt = 0; 
        const nextProducto = [
        ...producto.slice(0, insertAt),
        { 
            id: parseInt(nuevoProductoModal.id), 
            nombre: nuevoProductoModal.nombre, 
            precio: parseInt(nuevoProductoModal.precio), 
            talla: nuevoProductoModal.talla,
            cantidad: nuevoProductoModal.cantidad,
        },
        ...producto.slice(insertAt)
        ]; setProducto(nextProducto);
        console.log('actuliza producto',producto);
    };
    
    const filteredCliente = cliente.filter((item) =>
        item.cedula.toString().includes(searchCliente.toLowerCase())
    );

    const local = ['Nueva Esparta', 'Caracas', 'Zulia', 'Merida', 'Falcon'];

    
    return (
        <Container sx={{display:'flex', marginTop: '79px', marginLeft: open === false? '40px':'100px'}}>
            <BasicModal abrir={openClienteModal} setOpen={setOpenClienteModal} submit={handleSubmit}/>
            <Box sx={{height: '91.9vh', width: '50vw', textAlign: 'center'}}>
                <SearchBar setSearchData={setSearchCliente}></SearchBar>
                <List sx={{minHeight: '300px', maxHeight: '500px'}}>
                { 
                    filteredCliente.map((item) => (
                        <ListItem>
                            <ListItemButton
                            onClick={()=> {
                                setSelectCliente(item);
                                console.log(selectCliente);
                            }}>
                                <ListItemText  key={item.cedula}>
                                    Cedula: {item.cedula} Nombre: {item.nombre}, Telefono: {item.telefono}
                                </ListItemText> 
                            </ListItemButton>
                        </ListItem> 
                    ))
                }
                </List>

                <Button
                variant="contained"
                onClick={()=>{
                    navigate('/reporteVendedor')
                }}>
                    Reportes</Button>
                <Button
                disabled={filteredCliente.length !== 0? true: false}
                sx={{marginLeft: '5px'}}
                variant="contained"
                onClick={()=>{ 
                    setOpenClienteModal(true);
                }}>
                    Agregar Cliente</Button>
            </Box>
            <Box sx={{width:'50%'}}>
                {selectCliente === ''? <h2 style={{marginTop: 175}}>Seleccione un cliente</h2> : 
                <div>

                    <List sx={{minHeight: '300px', maxHeight: '500px'}}>
                        {
                            'Productos'
                        }
                        <div style={{display: 'flex', height: 400, justifyContent: 'center', marginTop: '20px'}}>
                            <DataGrid
                                rows={producto}
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
                    </List>
                    <h2 style={{textAlign: 'right', marginRight:'10px'}}>Total: {'100'}$</h2>
                    <Stack direction={'row'} spacing={2}>
                        <Button
                        onClick={() => {
                            setSelectCliente('');
                        }}
                        variant="contained">Limpiar</Button>
                        <Button
                        onClick={() => {
                            setOpenProductoModal(true);
                        }}
                        variant="contained">Agregar Producto</Button>
                        <Button
                        variant="contained"
                        onClick={() => {
                            
                        }}
                        >Guardar</Button>
                    </Stack>
                </div>
                }
            </Box>
            <AgregarProductoModal abrir={openProductoModal} setOpen={setOpenProductoModal} submit={handleProducto}></AgregarProductoModal>
        </Container>
    );
}

const clientesList = [
    {cedula: 111111, nombre: 'Jose', telefono: 41212121, direccion: 'Narnia'},
    {cedula: 222222, nombre: 'Pedro', telefono: 41200000, direccion: 'Narnia'},
    {cedula: 333333, nombre: 'Juan', telefono: 4121111111, direccion: 'Narnia'},
    {cedula: 444444, nombre: 'Jesus', telefono: 412222222, direccion: 'Narnia'},
];

const columns = [
    { field: 'id', headerName: 'Codigo', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 174 },
    { field: 'precio', headerName: 'Precio de Venta', width: 140 },
    { field: 'talla', headerName: 'Talla', width: 140 },
    { field: 'cantidad', headerName: 'Cantidad', width: 140 },
];
const rows = [
    { id: 1, nombre: 'Low basketball shoes', precio: 35, talla: 42, cantidad: 1},
    { id: 2, nombre: 'Adidas Campus ADV', precio: 42, talla: 40, cantidad:12},
    { id: 3, nombre: 'Zapatillas Skate', precio: 45, talla: 43, cantidad: 13},
    { id: 4, nombre: 'VL Court 2.0', precio: 16, talla: 42.5, cantidad: 11},
];