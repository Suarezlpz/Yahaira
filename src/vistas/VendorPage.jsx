import React, { useState } from 'react';
import { Button, Container, ListItemAvatar, ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SearchBar from '../components/SearchBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { openAtom } from '../atoms/OpenAtom';
import { useAtomValue, useAtom } from 'jotai';



export default function VendorPage(){

    const [searchVendedor, setSearchVendedor] = useState('');
    const [searchLocal, setSearchLocal] = useState('');
    const [selectVendedor, setSelectVendedor] = useState('');
    const navigate = useNavigate();

    const open = useAtomValue(openAtom);

    const vendedor = [
        {cedula: 111111, nombre: 'Jose', telefono: 41212121},
        {cedula: 222222, nombre: 'Pedro', telefono: 41200000},
        {cedula: 333333, nombre: 'Juan', telefono: 4121111111},
        {cedula: 444444, nombre: 'Jesus', telefono: 412222222},
    ];

    const filteredVendedor = vendedor.filter((item) =>
        item.nombre.toLowerCase().includes(searchVendedor.toLowerCase())
    );

    const local = ['Nueva Esparta', 'Caracas', 'Zulia', 'Merida', 'Falcon'];

    const filteredLocal = local.filter((item) =>
        item.toLowerCase().includes(searchLocal.toLowerCase())
    );
    

    return (
        <Container sx={{display:'flex', marginTop: '79px', marginLeft: open === false? '40px':'100px'}}>
            <Box sx={{height: '91.9vh', width: '50vw', textAlign: 'center'}}>
                <SearchBar setSearchData={setSearchVendedor}></SearchBar>
                <List sx={{minHeight: '300px'}}>
                { 
                    filteredVendedor.map((item) => (
                        <ListItem>
                            <ListItemButton
                            onClick={()=> {
                                setSelectVendedor(item);
                                console.log(selectVendedor);
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
                disabled={filteredVendedor.length !== 0? true: false}
                sx={{marginLeft: '5px'}}
                variant="contained"
                onClick={()=>{ }}>
                    Agregar Cliente</Button>
            </Box>
            <Box sx={{width:'50%'}}>
                <SearchBar setSearchData={setSearchLocal}></SearchBar>
                <List sx={{minHeight: '300px'}}>
                { 
                    filteredLocal.map((item) => (
                        <ListItem>
                            <ListItemText key={item}>
                                {item}
                            </ListItemText> 
                        </ListItem> 
                    ))
                }
                </List>
                <Stack direction={'row'} spacing={2}>
                    <Button
                    variant="contained">Limpiar</Button>
                    <Button
                    variant="contained"
                    onClick={() => {
                        console.log('oli', filteredVendedor);
                    }}>Guardar</Button>
                </Stack>
            </Box>
        </Container>
    );
}