import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField, Container, Stack, FormControl, OutlinedInput, FormHelperText, IconButton} from '@mui/material';
import Fab from '@mui/material/Fab';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import { storage } from '../utils/Storage';
import { useGetProductTypes } from '../services/ProductTypesServices';
import { useGetBrands } from '../services/BrandsServices';
import { useGetTiendas } from '../services/TiendasServices';
import { CreateProducts } from '../services/GetProducts';
import SaveIcon from '@mui/icons-material/Save';
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


const Example = () => {
    const userDataToken = storage.get('user');
    const token = userDataToken.token;
    const [name, setName] = React.useState('');
    const [productType, setPrpductType] = React.useState([]);
    const [productTypeSelected, setPrpductTypeSelected] = React.useState()
    const [brands, setBrands] = React.useState([]);
    const [brandSelected, setBrandSelected] = React.useState([])
    const [tiendas, setTiendas] = React.useState();
    const [skus, setSkus] = React.useState([]);
    const [arreglo, setArreglo] = React.useState([
        {sku: '', price: '', cantidad:'', tienda:'',}
    ])
    let tempNewProduct = {
        'name': name,
        'brand': brandSelected,
        'type': productTypeSelected,
        'skus': skus,
    }


    const {
        data: fetchedPreodutTypes = [],
        isError: isLoadingTProductTypeError,
        isFetching: isFetchingProductTypes,
        isLoading: isLoadingProductTypes,
    } = useGetProductTypes({token});

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
    
    React.useEffect(() => {
        if(fetchedBrands != ''){
            let tempBrands = []
            tempBrands = fetchedBrands.data.map((item) => {
            return(item)
            })
            setBrands(tempBrands)
        }
        if(fetchedPreodutTypes != ''){
            let TempPrpductType = []
            TempPrpductType = fetchedPreodutTypes.map((item) => {
              return item;
            })
            setPrpductType(TempPrpductType)
        }
        if(fetchedTienda != ''){
            let tempTienda = []
            tempTienda = fetchedTienda.data.map((item) => {
            return item;
            })
            setTiendas(tempTienda)
        }
        setSkus(arreglo);
    }, [fetchedBrands, fetchedPreodutTypes, arreglo, fetchedTienda]);


    return(
        <Box textAlign={'center'} sx={style}>
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <TextField
                        label="Nombre"
                        id="outlined-start-adornment"
                        sx={{ width: '25ch' }}
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <TextField
                        label="UPC"
                        id="outlined-start-adornment"
                        sx={{ width: '25ch' }}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                   <Autocomplete
                        disablePortal
                        options={brands}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            setBrandSelected(newValue.id);
                        }}
                        renderInput={(params) => <TextField {...params} label="Marca" />}
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <Autocomplete
                        disablePortal
                        options={productType}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            setPrpductTypeSelected(newValue.id);
                        }}
                        renderInput={(params) => <TextField {...params} label="Tipo" />}
                    />
                </FormControl>
            </Box>
            <Box maxHeight={'400px'} minHeight={'200px'} sx={{overflowY: 'scroll', scrollbarColor:'blue'
            }}>
                {skus.map((item, index) => {
                    return<>
                    <Box>
                        <Stack direction={'row'} spacing={2} m={1}>
                            <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                                <TextField
                                    label="SKU"
                                    id={index + 'sku'}
                                    value={item.sku}
                                    onChange={(e) => {

                                        setArreglo(prev => {
              
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
                                value={item.price}
                                onChange={(e) => {

                                    setArreglo(prev => {
          
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
                                onChange={(e) => {

                                    setArreglo(prev => {
          
                                      let conf = [ ...prev ]
          
                                        conf[index].cantidad = e.target.value
          
                                        return conf
                                    })
                                }}
                            />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '20vw' }} variant="outlined">
                                <Autocomplete
                                disablePortal
                                id={index + 'tienda'}
                                options={tiendas}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => {
                                    setArreglo(prev => {
          
                                      let conf = [ ...prev ]
          
                                        conf[index].tienda = newValue.id
          
                                        return conf
                                    })
                                }}
                                renderInput={(params) => <TextField {...params} label="Tienda" />}
                                />
                            </FormControl>
                            <IconButton   
                            onClick={() => {
                                setArreglo(prev => {
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
                    setArreglo(prev => {

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
        </Box>
    )
}

const queryClient = new QueryClient();

export default function NuevoProductoModal( {abrir = false, setOpen, }) {
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
            <QueryClientProvider client={queryClient}>
                <Example></Example>
            </QueryClientProvider>
        </Modal>
    </div>
  );
}