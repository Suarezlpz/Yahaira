import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, Container, Stack} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { DataGrid } from '@mui/x-data-grid';
import { productoAtom } from '../atoms/productoAtom';

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

export default function AgregarProductoModal( {abrir = false, setOpen, submit}) {

    const handleClose = () => {
        setOpen(false);
        setNuevoProducto('');
      }

  const [nuevoProductoModal, setNuevoProductoModal]= useAtom(productoAtom);

  function handleSubmit() {
    console.log('nuevo producto desde el modal', nuevoProducto);
    handleClose();
    submit()
  }

  const [nuevoProducto, setNuevoProducto] = React.useState({
    id: '',
    nombre: '',
    precio: '',
    talla: '',
    cantidad: '',
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
            Agregar Producto
          </Typography>
          <Box>
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Codigo"
            variant="standard"
            value={nuevoProducto.id}
            type="number"
            onChange={(event) =>
                setNuevoProducto({
                ...nuevoProducto,
                id: event.target.value,
              })}
            />
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Nombre"
            variant="standard"
            value={nuevoProducto.cedula}
            onChange={(event) =>
                setNuevoProducto({
                ...nuevoProducto,
                nombre: event.target.value,
              })}
            />
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Precio"
            variant="standard"
            value={nuevoProducto.precio}
            onChange={(event) =>
                setNuevoProducto({
                ...nuevoProducto,
                precio: event.target.value,
              })}
            />
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Talla"
            variant="standard"
            value={nuevoProducto.direccion}
            onChange={(event) =>
                setNuevoProducto({
                ...nuevoProducto,
                talla: event.target.value,
              })}
            />
            <TextField
            sx={{ m: 1, width: '25ch' }}
            label="Cantidad"
            variant="standard"
            type="number"
            value={nuevoProducto.telefono}
            onChange={(event) =>
                setNuevoProducto({
                ...nuevoProducto,
                cantidad: event.target.value,
              })}
            />
          </Box>
          <Stack marginTop={5} spacing={2} direction={'row'} display={'flex'} justifyContent={'center'}>
                    <Button
                    onClick={() => {
                      handleClose();
                      setNuevoProducto('');
                    }}
                    variant="contained">Cancelar</Button>
                    <Button
                    variant="contained"
                    onClick={() => {
                      setNuevoProductoModal(nuevoProducto);
                      handleSubmit();
                    }}>Guardar</Button>
                </Stack>
        </Box>
      </Modal>
    </div>
  );
}