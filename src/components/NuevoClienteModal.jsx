import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, Container, Stack} from '@mui/material';
import { clienteAtom } from '../atoms/ClienteAtom';
import { useAtom, useAtomValue } from 'jotai';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal( {abrir = false, setOpen, submit}) {

  const handleClose = () => {
    setOpen(false);
    setNuevoCliente('');
  }
  const [nuevoClienteModal, setNuevoClienteModal]= useAtom(clienteAtom);

  function handleSubmit() {
    console.log('nuevo cliente desde el modal', nuevoCliente);
    submit();
    handleClose();
  }

  const [nuevoCliente, setNuevoCliente] = React.useState({
    cedula: '',
    nombre: '',
    telefono: '',
    direccion: '',
  });

  return (
    <div>
      <Modal
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box textAlign={'center'} sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nuevo Cliente
          </Typography>
          <Box>
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Cedula / Rif"
            variant="standard"
            value={nuevoCliente.cedula}
            type="number"
            onChange={(event) =>
                setNuevoCliente({
                ...nuevoCliente,
                cedula: event.target.value,
              })}
            />
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Nombre"
            variant="standard"
            value={nuevoCliente.nombre}
            onChange={(event) =>
                setNuevoCliente({
                ...nuevoCliente,
                nombre: event.target.value,
              })}
            />
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Direccion"
            variant="standard"
            multiline
            maxRows={4}
            value={nuevoCliente.direccion}
            onChange={(event) =>
                setNuevoCliente({
                ...nuevoCliente,
                direccion: event.target.value,
              })}
            />
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Telefono"
            variant="standard"
            type="number"
            value={nuevoCliente.telefono}
            onChange={(event) =>
                setNuevoCliente({
                ...nuevoCliente,
                telefono: event.target.value,
              })}
            />
          </Box>
          <Stack marginTop={5} spacing={2} direction={'row'} display={'flex'} justifyContent={'center'}>
                    <Button
                    onClick={() => {
                      handleClose();
                    }}
                    variant="contained">Cancelar</Button>
                    <Button
                    variant="contained"
                    onClick={() => {
                      setNuevoClienteModal(nuevoCliente);
                      handleSubmit();
                    }}>Guardar</Button>
                </Stack>
        </Box>
      </Modal>
    </div>
  );
}