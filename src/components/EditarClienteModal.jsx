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
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import { storage } from '../utils/Storage';
import SaveIcon from '@mui/icons-material/Save';
import { useCreateClients, useGetClientsBySaime} from '../services/ClientsServices'; 
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAtom, useAtomValue } from 'jotai';
import { useUpdateClients } from '../services/ClientsServices';

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

const Example = ({abrir = false, setOpen, table, row }) => {
    const userDataToken = storage.get('user');
    const [nacionalidades, setNacionalidades] = React.useState([{label:'V', id: 'V'}, {label:'E', id: 'E'}]);
    const token = userDataToken.token;
    const [clientCedula, setClientCedula] = React.useState();
    const [name, setName] = React.useState('');
    const [dataDesdeRow, setDataDesdeRow] = React.useState(row.original);
    const [nacionalidadSelected, setNacionalidadSelected] = React.useState(dataDesdeRow.nacionalidad);

    const handleClose = () => {
        setOpen(false);
        table.setEditingRow(null)
    }

  //call UPDATE hook
  const { mutateAsync: updateCliente, isPending: isUpdatingCliente } =
  useUpdateClients({token});

  //UPDATE action
  const handleSaveCliente = async ({values}) => {
    await updateCliente(values);
    table.setEditingRow(null); //exit editing mode
  };

    return(
        <Modal
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box textAlign={'center'} sx={style}>
                <h3>Editar Cliente</h3>
                <FormControl sx={{ m: 1, width: '20vw', flexDirection: 'row'}} variant="standard">
                    <TextField
                        label="Cedula"
                        variant='standard'
                        id="Cedula"
                        value={dataDesdeRow.cedula}
                        sx={{ width: '70%', mr: 1}}
                        onChange={(e) => {{
                            setDataDesdeRow({ ...dataDesdeRow,
                                cedula: e.target.value
                            })}
                        }}
                    />
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={nacionalidadSelected}
                        sx={{ width: '25%', ml: 1}}
                        onChange={(event) => {
                            setNacionalidadSelected(event.target.value);
                        }}
                        label="Nacionalidad"
                    >
                        {nacionalidades.map(item => {
                            return <MenuItem value={item.label}>{item.id}</MenuItem>
                        })}
                    
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Primer Nombre"
                        variant='standard'
                        id="PrimerNombre"
                        value={dataDesdeRow.primer_nombre}
                        onChange={(e) => {{
                            setDataDesdeRow({ ...dataDesdeRow,
                                primer_nombre: e.target.value
                            })}
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Segundo Nombre"
                        id='SegundoNombre'
                        variant='standard'
                        value={dataDesdeRow.segundo_nombre}
                        onChange={(e) => {{
                            setDataDesdeRow({ ...dataDesdeRow,
                                segundo_nombre: e.target.value
                            })}
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Primer Apellido"
                        id='primerApellido'
                        variant='standard' 
                        value={dataDesdeRow.primer_apellido} 
                        onChange={(e) => {{
                            setDataDesdeRow({ ...dataDesdeRow,
                                primer_apellido: e.target.value
                            })}
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                <TextField
                    label="Segundo Apellido"
                    id={'segundoApellido'}
                    variant='standard'
                    value={dataDesdeRow.segundo_apellido}
                    onChange={(e) => {{
                        setDataDesdeRow({ ...dataDesdeRow,
                            segundo_apellido: e.target.value
                        })}
                    }}

                />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Fecha de Nacimiento"
                        id={'segundoApellido'}
                        type='date'
                        form
                        variant='standard'
                        value={dataDesdeRow.fecha_nacimiento}
                        onChange={(e) => {{
                            setDataDesdeRow({ ...dataDesdeRow,
                                fecha_nacimiento: e.target.value
                            })}
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Correo"
                        id={'correo'}
                        variant='standard'
                        value={dataDesdeRow.email}
                        onChange={(e) => {{
                            setDataDesdeRow({ ...dataDesdeRow,
                                email: e.target.value
                            })}
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                    <TextField
                        label="Telefono"
                        id={'Cantidad'}
                        variant='standard'
                        value={dataDesdeRow.phone}
                        onChange={(e) => {{
                            setDataDesdeRow({ ...dataDesdeRow,
                                phone: e.target.value
                            })}
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '50%'}} variant="outlined">
                    <Stack direction={'row'} spacing={2} m={1} justifyContent={'center'}>
                        <Button
                        variant="contained"
                        onClick={() => {
                            handleSaveCliente({values: dataDesdeRow})
                        }}>Guardar</Button>
                        <Button
                        variant="contained"
                        onClick={() => {
                            handleClose()
                        }}>Cancelar</Button>
                    </Stack>
                </FormControl> 
            </Box>
        </Modal>
    )
}

const queryClient = new QueryClient();

export default function EditarClieteModal( {abrir, setOpen, table, row}) {

  return (
    <div>
        <QueryClientProvider client={queryClient}>
            <Example abrir={abrir} setOpen={setOpen} table={table} row={row}/>
        </QueryClientProvider>  
    </div>
  );
}