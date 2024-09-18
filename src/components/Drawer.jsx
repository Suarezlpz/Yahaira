import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai'
import { openAtom } from '../atoms/OpenAtom';
import { Container } from '@mui/material';
import { storage } from '../utils/Storage';


export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = useAtom(openAtom);
  const userData = storage.get('user')
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
              <ListItem disablePadding sx={{ display: 'block' }}>
                {userData.role === 'admin' || userData.role === 'seller'
                ? <ListItemButton
                    onClick={() =>{
                      navigate('/home')
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Vendedor'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                : ''}
                {userData.role === 'admin'
                ? <>
                    <ListItemButton
                      onClick={() =>{
                        navigate('/home/tiendas')
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <InboxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={'Tiendas'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>{
                        navigate('/home/clients')
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <InboxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={'Clientes'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>{
                        navigate('/home/users')
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <InboxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={'Usuarios'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>{
                        navigate('/home/brands')
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <InboxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={'Marcas'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>{
                        navigate('/home/product_types')
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <InboxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={'Tipo de Producto'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>{
                        navigate('/home/attributes')
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <InboxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={'Atributos'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() =>{
                        navigate('/home/reporteVendedor')
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                          <InboxIcon/>
                      </ListItemIcon>
                      <ListItemText primary={'Reportes de Venta'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </>
                :''}
                {userData.role === 'admin' || userData.role === 'depositary'
                ? <ListItemButton
                    onClick={() =>{
                      
                      userData.role === 'admin'? navigate('/home/reporteLocal') : userData.role === 'depositary'? navigate('/home'): ''

                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                    <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Reporte de Inventario'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                :''}
                <ListItemButton
                    onClick={() =>{
                      console.log('jelou')
                      storage.clear()
                      navigate('/')
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Salir'} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>

              </ListItem>
          </List>
        </Drawer>
      </Box>
      <Box>
        <Outlet></Outlet>
      </Box>
    </Container>
  );
}


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);