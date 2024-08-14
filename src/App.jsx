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
import { userDataAtom } from './atoms/UserDataAtom';

function App() {

  const userData = useAtomValue(userDataAtom);

  const adminRoute = (
    <Route path='/home' element={<MiniDrawer/>}>
      <Route index element={<VendorPage/>}/>
      <Route path='reporteVendedor' element={<ReportsVendorPage/>}/>
      <Route path='reporteLocal' element={<ReportsLocalPage/>}/>
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
        <Route path='/' element={<LoginPage/>}/>
        {userData.role === 'admin'? adminRoute : userData.role === 'seller'? sellerRoute : userData.role === 'depositary'? depositaryRoute: ''}
      </Routes>
  </BrowserRouter>
  )
}

export default App
