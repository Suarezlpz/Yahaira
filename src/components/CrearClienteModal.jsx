import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { 
    TextField, 
    Container,
    Stack, 
    FormControl, 
    OutlinedInput,
    FormHelperText, 
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import { storage } from '../utils/Storage';
import SaveIcon from '@mui/icons-material/Save';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useCreateClients, useGetClientsBySaime} from '../services/ClientsServices'; 
import { IsCreatingClientAtom } from '../atoms/ClienteAtom';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAtom, useAtomValue } from 'jotai';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  minHeight: '500px',
  maxHeight: '90vh',
};


const Example = ({abrir = false, setOpen }) => {
    const userDataToken = storage.get('user');
    const [nacionalidades, setNacionalidades] = React.useState(['V', 'E']);
    const token = userDataToken.token;
    const [clientCedula, setClientCedula] = React.useState();
    const [nacionalidadSelected, setNacionalidadSelected] = React.useState();
    const [clienteDataBySaime, setClienteDataBySaime] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [primerNombre, setPrimerNombre]  = React.useState('');
    const [primerApellido, setPrimerApellido]  = React.useState('');
    const [segundoApellido, setSegundoApellido]  = React.useState('');
    const [segundoNombre, setSegundoNombre]  = React.useState('');
    const [clientCorreo, setClientCorreo] = React.useState('');
    const [telefono, setTelefono] = React.useState('');
    const [fecha_Nacimiento, setFecha_Nacimiento] = React.useState(dayjs());
    const [isCreatingClientAtom, setIsCreatingClientAtom] = useAtom(IsCreatingClientAtom)
    const [error, setError] = React.useState({
        correo: false,
        cedula: false,
        pNombre: false,
        pApellido: false,
        telefono: false,
    });
    const newClient = {
        cedula: clientCedula,
        nacionalidad: nacionalidadSelected,
        nombre: primerNombre,
        primerApellido: primerApellido,
        segundoApellido: segundoApellido,
        segundoNombre: segundoNombre,
        fechaNacimiento: dayjs(fecha_Nacimiento).format('YYYY-MM-DD'),
        correo: clientCorreo,
        telefono: telefono,
    }

    const validateError = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setError({...error, 
            correo: !emailRegex.test(value)
        });
    };

    const handleClose = () => {
        setOpen(false);
        setClienteDataBySaime([])
        setClientCedula('')
        setTelefono('')
        setClientCorreo('')
    }

    function handleGetClienteBySaime() {
        useGetClientsBySaime({
            token: token, 
            cedula: clientCedula, 
            nacionalidad: nacionalidadSelected,
        })
        .then(datos => {
            setClienteDataBySaime(datos);
            setIsLoading(false);
            console.log(clienteDataBySaime)
        })
        .catch(error => {
            console.log(error);
            setIsLoading(false);
        });
    }
    const { mutateAsync: createClient, isPending: isCreatingClient } = useCreateClients({token})

    const handleCreateClient = async ({ values }) => {
        setIsCreatingClientAtom(isCreatingClient)
        await createClient(values);
        handleClose();
    };

    React.useEffect(() => {
        if(clienteDataBySaime != ''){ 
            let tempFecha = clienteDataBySaime.data.fecha_nacimiento
            setFecha_Nacimiento(dayjs(tempFecha));
            setPrimerNombre(clienteDataBySaime.data.primer_nombre);
            setPrimerApellido(clienteDataBySaime.data.primer_apellido);
            setSegundoNombre(clienteDataBySaime.data.segundo_nombre);
            setSegundoApellido(clienteDataBySaime.data.segundo_apellido);
        }
    }, [clienteDataBySaime]);

    return(
        <Modal
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box textAlign={'center'} sx={style}>
                <h3>Nuevo Cliente</h3>
                <FormControl sx={{ m: 1, width: '20vw', flexDirection: 'row',}} variant="outlined">
                    <TextField
                        label="Cedula"
                        required= {true}
                        variant='standard'
                        value={clientCedula}
                        sx={{ width: '50%', mr: 1}}
                        error={error.cedula}
                        helperText={error.cedula ? 'Este Campo es Obligatorio' : ''}
                        onChange={(e) => {
                            setClientCedula(e.target.value);
                            if (e.target.value === '') {
                                setError({...error,
                                    cedula: true
                                });
                            } else {
                                setError({...error,
                                    cedula: false
                                });
                            }
                        }}
                    />
                    <Autocomplete
                        disablePortal
                        options={nacionalidades}
                        sx={{ width: '35%', ml: 1}}
                        onChange={(event, newValue) => {
                            setNacionalidadSelected(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} variant='standard' label="Nacionalidad" />}
                    />
                    <IconButton
                        sx={{ width: '5%', ml: 1}}   
                        onClick={() => {
                            handleGetClienteBySaime()
                        }}                    
                    >
                        <SearchIcon/>
                    </IconButton>
                </FormControl>
                {clienteDataBySaime.length == 0? "":<>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                <TextField
                        label="Primer Nombre"
                        variant='standard'
                        required= {true}
                        value={primerNombre}
                        error={error.pNombre}
                        helperText={error.pNombre ? 'Este Campo es Obligatorio' : ''}
                        onChange={(e) => {
                            setPrimerNombre(e.target.value)
                            if (e.target.value === '') {
                                setError({...error,
                                    pNombre: true
                                });
                            } else {
                                setError({...error,
                                    pNombre: false
                                });
                            }
                        }}

                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Segundo Nombre"
                        variant='standard'
                        value={segundoNombre}
                        onChange={(e) => {
                            setSegundoNombre(e.target.value)
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Primer Apellido"
                        required= {true}
                        variant='standard' 
                        value={primerApellido}
                        error={error.pApellido}
                        helperText={error.pApellido ? 'Este Campo es Obligatorio' : ''}
                        onChange={(e) => {
                            setPrimerApellido(e.target.value)
                            if (e.target.value === '') {
                                setError({...error,
                                    pApellido: true
                                });
                            } else {
                                setError({...error,
                                    pApellido: false
                                });
                            }
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                <TextField
                    label="Segundo Apellido"
                    variant='standard'
                    value={segundoApellido}
                    onChange={(e) => {
                        setSegundoApellido(e.target.value)
                    }} 
                />
                </FormControl>
                {fecha_Nacimiento === ''? '':
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <DateField
                        label="Fecha de Nacimiento"
                        variant='standard'
                        format='YYYY-MM-DD'
                        value={fecha_Nacimiento}
                        onChange={(newValue) => {
                            setFecha_Nacimiento(dayjs(newValue))
                        }}
                    />
                </FormControl>}
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Correo"
                        variant='standard'
                        required={true}
                        error={error.correo}
                        helperText={error.correo ? 'Por favor ingresa un correo válido' : ''}
                        value={clientCorreo}
                        onChange={(e) => {
                            setClientCorreo(e.target.value)
                            validateError(e.target.value)
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Telefono"
                        required={true}
                        value={telefono}
                        variant='standard'
                        error={error.telefono}
                        helperText={error.telefono ? 'Este Campo es Necesario' : ''}
                        onChange={(e) => {
                            setTelefono(e.target.value)
                            if (e.target.value === '') {
                                setError({...error,
                                    telefono: true
                                });
                            } else {
                                setError({...error,
                                    telefono: false
                                });
                            }
                        }}
                    />
                </FormControl>
                </>}
                <FormControl sx={{ m: 1, width: '50%'}} variant="outlined">
                    <Stack direction={'row'} spacing={2} m={1} justifyContent={'center'}>
                        <Button
                        variant="contained"
                        disabled={clienteDataBySaime.length == 0? true: false}
                        onClick={() => {
                            if(telefono == '' || primerNombre == '' || primerApellido == '' || clientCorreo == '' || clientCedula == ''){
                                alert('Hay Campos sin LLenar')
                            }else{
                                handleCreateClient({values: newClient}) 
                            }
                        }}>Guardar</Button>
                        <Button
                        variant="contained"
                        onClick={() => {
                            handleClose()
                        }}>Cancelar</Button>
                    </Stack>
                </FormControl>
            </Box>
            </LocalizationProvider>
        </Modal>
    )
}

const queryClient = new QueryClient();

export default function CrearClieteModal( {abrir, setOpen }) {

  return (
    <div>
        <QueryClientProvider client={queryClient}>
            <Example abrir={abrir} setOpen={setOpen}/>
        </QueryClientProvider>  
    </div>
  );
}