import { useState } from 'react'
import { 
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import LoginPage from './vistas/LoginPage';
import VendorPage from './vistas/VendorPage';
import ReportsVendorPage from './vistas/ReportsVendorPage';
import ReportsLocalPage from './vistas/ReportInventarioPage';
import MiniDrawer from './components/Drawer';
import '../src/App.css'
import FreeSoloCreateOptionDialog from './components/AutocompleteEjemplo'
import { useAtom, useAtomValue } from 'jotai';
import TiendasPage from './vistas/TiendasPage';
import { storage } from './utils/Storage';
import ProductTypesPage from './vistas/ProductTypesPage';
import BrandsPage from './vistas/BrandsPage';
import UsuariosPage from './vistas/UsuariosPage';
import ClientsPage from './vistas/ClientsPage';
import AttributesPage from './vistas/AttributePage';

function App({inInitiallyLogged}) {
  const [isLogged, setIsLogged] = useState (inInitiallyLogged)

  const userData = storage.get('user')

  const adminRoute = (
    <Route path='/home' element={<MiniDrawer/>}>
      <Route index element={<VendorPage/>}/>
      <Route path='reporteVendedor' element={<ReportsVendorPage/>}/>
      <Route path='reporteLocal' element={<ReportsLocalPage/>}/>
      <Route path='tiendas' element={<TiendasPage/>}/>
      <Route path='users' element={<UsuariosPage/>}/>
      <Route path='brands' element={<BrandsPage/>}/>
      <Route path='product_types' element={<ProductTypesPage/>}/>
      <Route path='attributes' element={<AttributesPage/>}/>
      <Route path='clients' element={<ClientsPage/>}/>
      <Route path='autocomplete' element={<FreeSoloCreateOptionDialog/>}/>
    </Route>
  )
  const sellerRoute = (
    <Route path='/home' element={<MiniDrawer/>}>
      <Route index element={<VendorPage/>}/>
    </Route>
  )
  const depositaryRoute = (
    <Route path='/home' element={<MiniDrawer/>}>
      <Route index element={<ReportsLocalPage/>}/>
    </Route>
  )

  return (
    <BrowserRouter>
      <Routes>
        {isLogged? (userData.role === 'admin'? adminRoute : userData.role === 'seller'? sellerRoute : userData.role === 'depositary'? depositaryRoute: ''):<Route path='/' element={<LoginPage/>}/>}
      </Routes>
  </BrowserRouter>
  )
}

export default App
