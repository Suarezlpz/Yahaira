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

export default function AttributesModal( {abrir = false, setOpen}) {

    const handleClose = () => {
        setOpen(false);
    }


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
                    Atributos
                </Typography>
                <Box>

                </Box>
                <Stack marginTop={5} spacing={2} direction={'row'} display={'flex'} justifyContent={'center'}>
                    <Button
                        onClick={() => {handleClose()}}
                    />
                </Stack>
            </Box>
        </Modal>
    </div>
  );
}