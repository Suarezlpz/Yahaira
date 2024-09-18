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
    MenuItem
} from '@mui/material';
import Fab from '@mui/material/Fab';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import { storage } from '../utils/Storage';
import { useGetProductTypes } from '../services/ProductTypesServices';
import { useGetBrands } from '../services/BrandsServices';
import { useGetTiendas } from '../services/TiendasServices';
import { CreateProducts } from '../services/GetProducts';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  minHeight: '500px',
  maxHeight: '80vh',
};


const Example = ({row, table, abrir = false, setOpen }) => {
    const userDataToken = storage.get('user');
    const token = userDataToken.token;
    const [name, setName] = React.useState('');
    const [productType, setPrpductType] = React.useState([]);
    const [productTypeSelected, setProductTypeSelected] = React.useState(0)
    const [brands, setBrands] = React.useState([]);
    const [brandSelected, setBrandSelected] = React.useState("")
    const [tiendas, setTiendas] = React.useState([]);
    const [skus, setSkus] = React.useState([{sku: '', price: '', cantidad:'', tienda:''}]);
    let dataFormateada = [];
    const [dataDesdeRow, setDataDesdeRow]= React.useState('')
    const newRow = row.original;

    const {
        data: fetchedBrands = [],
        isError: isLoadingBrandError,
        isFetching: isFetchingBrand,
        isLoading: isLoadingBrand,
    } = useGetBrands({token});

    const {
        data: fetchedTienda = [],
        isError: isLoadingTiendaError,
        isFetching: isFetchingTienda,
        isLoading: isLoadingTienda,
    } = useGetTiendas({token});

    const {
        data: fetchedPreodutTypes = [],
        isError: isLoadingTProductTypeError,
        isFetching: isFetchingProductTypes,
        isLoading: isLoadingProductTypes,
    } = useGetProductTypes({token});
    

    let tempNewProduct = {
        'name': name,
        'brand': brandSelected,
        'type': productTypeSelected,
        'skus': skus,
    }
    
    React.useEffect(() => {

        if(fetchedBrands != ''){
            let tempBrands = []
            tempBrands = fetchedBrands.data.map((item) => {
            return({
                label: item.name,
                id: item.id
            })
            })
            console.log(tempBrands, 'tempBrands')
            setBrands(tempBrands)
        }

        if(fetchedPreodutTypes != ''){
            let TempPrpductType = []
            TempPrpductType = fetchedPreodutTypes.map((item) => {
              return item;
            })
            console.log(TempPrpductType, 'TempPrpductType')
            setPrpductType(TempPrpductType)
        }

        if(fetchedTienda != ''){
            let tempTienda = []
            tempTienda = fetchedTienda.data.map((item) => {
            return item;
            })
            console.log(tempTienda, 'tempTienda')
            setTiendas(tempTienda)
        }

        if(newRow !== ''){
            let tempRow = []
            tempRow = newRow.subRows.map((item) => {
            return item;
            })
            dataFormateada = tempRow.map((nameSubRow) => {
                return nameSubRow.subRows.map((upcSubRow) => {
                    return upcSubRow.subRows.map((skusSubrow => ({
                        nombre: nameSubRow.name,
                        upc: upcSubRow.upc,
                        marca: skusSubrow.marca,
                        tipo: skusSubrow.productType,
                        skus: [{
                            sku: skusSubrow.sku,
                            precio: skusSubrow.price,
                            cantidad: skusSubrow.amount,
                            tienda: skusSubrow.tienda
                        }] 
                    }))).flat();
                }).flat();
             }).flat();

            setDataDesdeRow(dataFormateada);
            setName(dataFormateada[0].nombre)
            setBrandSelected(dataFormateada[0].marca);
            setProductTypeSelected(dataFormateada[0].tipo)
            console.log(dataFormateada, 'dataFormateada')
            setSkus(dataFormateada.map(item => {return item.skus}).flat())
        }

    }, [newRow, fetchedBrands, fetchedPreodutTypes, fetchedTienda]);

    const handleClose = () => {
        setOpen(false);
        table.setEditingRow(null)
    }

    return(
        <Modal
            open={abrir}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container textAlign={'center'} sx={style}>
                <Stack textAlign={'center'}><h2>Editar Producto</h2></Stack>
                {dataDesdeRow !== ''? 
                    (<Box textAlign={'center'}>
                        <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <TextField
                                    label="Nombre"
                                    variant='standard'
                                    value={name}
                                    onChange={(e) =>
                                        setName(prev => {
                                            let conf = [ ...prev ]
                                                conf = e.target.value
                                            return conf
                                        })}
                                    id="outlined-start-adornment"
                                    sx={{ width: '25ch' }}
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <TextField
                                    label="UPC"
                                    disabled = 'true'
                                    value={dataDesdeRow[0].upc}
                                    variant='standard'
                                    id="outlined-start-adornment"
                                    sx={{ width: '25ch' }}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                            {isLoadingBrand ? "" : 
                                <><InputLabel id="demo-simple-select-standard-label">Marca</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={brandSelected}
                                    onChange={(event) => {
                                        setBrandSelected(event.target.value);
                                    }}
                                    label="Age"
                                >
                                    {brands.map(item => {
                                        return <MenuItem value={item.id}>{item.label}</MenuItem>
                                    })}
                                
                                </Select></>}
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                                {brands.length == 0 ? "": 
                                    <><InputLabel id="demo-simple-select-standard-label">Tipo</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={productTypeSelected}
                                        onChange={(event) => {
                                            setProductTypeSelected(event.target.value);
                                        }}
                                        label="Age"
                                    >
                                        {productType.map(item => {
                                            return <MenuItem value={item.id}>{item.name}</MenuItem>
                                        })}
                                    </Select></>
                                }
                            </FormControl>
                        </Box>
                        <Box maxHeight={'400px'} minHeight={'200px'} sx={{overflowY: 'scroll', scrollbarColor:'blue'}}>
                            {skus.map((item, index) => {
                                return<>
                                <Box>
                                    <Stack direction={'row'} spacing={2} m={1}>
                                        <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                                            <TextField
                                                label="SKU"
                                                id={index + 'sku'}
                                                variant='standard'
                                                value={item.sku}
                                                onChange={(e) => {

                                                    setSkus(prev => {
                        
                                                    let conf = [ ...prev ]
                        
                                                        conf[index].sku = e.target.value
                        
                                                        return conf
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                                        <TextField
                                            label="Precio"
                                            id={index + 'Precio'}
                                            variant='standard'   
                                            value={item.precio}
                                            onChange={(e) => {

                                                setSkus(prev => {
                    
                                                let conf = [ ...prev ]
                    
                                                    conf[index].price = e.target.value
                    
                                                    return conf
                                                })
                                            }}
                                        />
                                        </FormControl>
                                        <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                                        <TextField
                                            label="Cantidad"
                                            id={index + 'Cantidad'}
                                            value={item.cantidad}
                                            variant='standard'
                                            onChange={(e) => {

                                                setSkus(prev => {
                    
                                                let conf = [ ...prev ]
                    
                                                    conf[index].cantidad = e.target.value
                    
                                                    return conf
                                                })
                                            }}
                                        />
                                        </FormControl>
                                        <FormControl sx={{ m: 1, width: '20vw' }} variant='standard'>
                                            {isLoadingTienda? "" : 
                                            <><InputLabel id="demo-simple-select-standard-label">Tienda</InputLabel>
                                            <Select
                                                labelId={index + 'tienda'}
                                                id={index + 'tienda'}
                                                value={skus[index].tienda}
                                                onChange={(event, newValue) => {
                                                    setSkus(prev => {
                    
                                                        let conf = [ ...prev ]
                            
                                                            conf[index].tienda = newValue.id
                            
                                                            return conf
                                                        })
                                                }}
                                                label="Tienda"
                                            >
                                                {tiendas.map(item => {
                                                    return <MenuItem value={item.id}>{item.name}</MenuItem>
                                                })}
                                            </Select></>}
                                        </FormControl>
                                        <IconButton   
                                        onClick={() => {
                                            setSkus(prev => {
                                            let conf = [...prev]
                                            conf.splice(index, 1);

                                            return conf
                                            })
                                        }}                    
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Stack>
                                </Box></>
                            })}
                        </Box>
                        <Box height={'5vh'}></Box>
                        <Fab color="primary" sx={{position: 'absolute', bottom: 16, right: 18,}}
                            aria-label="add" onClick={() =>{
                                setSkus(prev => {

                                    let conf = [...prev]
                
                                    conf.push({sku:'' , cantidad:'', price:'', tienda:''})

                                    return conf
                
                                })

                            }}> 
                            <AddBoxIcon />
                        </Fab>
                        <Fab color="primary" sx={{position: 'absolute', bottom: 16, right: 80,}} aria-label="add" 
                            onClick={() =>{
                                CreateProducts({data: tempNewProduct})
                                .then(datos => console.log(datos))
                                .catch(datos => console.log(datos))
                            }}>
                            <SaveIcon />
                        </Fab>
                        <Fab color='error' sx={{position: 'absolute', bottom: 16, left: 18,}} aria-label="add" 
                            onClick={() =>{
                                handleClose()
                            }}>
                        <CloseIcon/>
                        </Fab>
                    </Box>)
                : ''}
            </Container>
        </Modal>
    )
}

const queryClient = new QueryClient();

export default function EditarProductoModal( {abrir, setOpen, row, table}) {
  return (
    <div>
        <Box>
            <QueryClientProvider client={queryClient}>
                <Example row={row} table={table} abrir={abrir} setOpen={setOpen}></Example>
            </QueryClientProvider>
        </Box>
    </div>
  );
}