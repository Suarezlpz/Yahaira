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
import { useUpdateTienda } from '../services/TiendasServices';
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
  minHeight: '300px',
  maxHeight: '90vh',
};

const Example = ({abrir = false, setOpen, table, row }) => {
    const userDataToken = storage.get('user');
    const token = userDataToken.token;
    const [tienda, setTienda] = React.useState({name: row.original.name, id: row.original.id});
    const [error, setError] = React.useState(false)

    const handleClose = () => {
        setOpen(false);
        setError(false);
        setTienda([])
        table.setEditingRow(null)
    }
  //call UPDATE hook
  const { mutateAsync: updateTienda, isPending: isUpdatingTienda } =
  useUpdateTienda({token});

  //UPDATE action
  const handleSaveTienda = async ({ values, table }) => {
    if(values.name == ""){
        setError(true);
        alert('Hay campos sin rellenar');
        
    }else{
    await updateTienda(values);
    handleClose()
    }
  };

    return(
        <Modal
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box textAlign={'center'} sx={style}>
                <h3>Editar Tienda</h3>
                <FormControl  sx={{ m: 1, width: '50%'}} variant="outlined">
                    <TextField
                        label="Nombre de la Tienda"
                        variant='standard'
                        required= {true}
                        error={error}
                        helperText={error? 'Este Campo es Necesario': ''}
                        value={tienda.name}
                        onChange={(e) => {
                            setTienda({...tienda, 
                                name: e.target.value
                            })                            
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '50%'}} variant="outlined">
                    <Stack direction={'row'} spacing={2} m={1} justifyContent={'center'}>
                        <Button
                        variant="contained"
                        onClick={() => {
                            handleSaveTienda({values: tienda})
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

export default function EditarTiendaModal( {abrir, setOpen, table, row}) {

  return (
    <div>
        <QueryClientProvider client={queryClient}>
            <Example abrir={abrir} setOpen={setOpen} table={table} row={row}/>
        </QueryClientProvider>  
    </div>
  );
}