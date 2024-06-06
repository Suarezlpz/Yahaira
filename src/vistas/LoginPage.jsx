import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginImg from '../assets/img/avatar_usuario.png'
import { Container } from '@mui/material';

export default function LoginPage() {

    const [showPassword, setShowPassword] = React.useState(false);
    const [userName, setUserName] = React.useState('')
    const [contraseña, setContraseña] = React.useState('')



    const navigate = useNavigate();
    
    return (
        <Container sx={{marginBottom:'300px', textAlign: 'center'}}>
            <img src={LoginImg} style={{width:'150px'}}/>
            <Box>
                <TextField
                sx={{ m: 1, width: '25ch' }}
                label="Usuario"
                variant="standard"
                value={userName}
                onChange={(event) => {
                    setUserName(event.target.value);
                  }}
                />
            </Box>
            <Box>            
                <TextField
                sx={{ m: 1, width: '25ch' }}
                label="Clave"
                variant="standard"
                type={showPassword ? 'text' : 'password'}
                value={contraseña}
                onChange={(event) => {
                    setContraseña(event.target.value);
                  }}
                />
            </Box>
            <Box>
                <Button 
                sx={{ m: 1, width: '25ch' }}
                variant="outlined"
                disabled = {contraseña === '' || userName === '' ? true: false}
                onClick={()=>{
                    navigate('/')
                }}
                >Entrar</Button>
            </Box>
        </Container>
    );
}