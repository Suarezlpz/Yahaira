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
import ReportsLocalPage from './vistas/ReportsLocalPage';
import MiniDrawer from './components/Drawer';
import '../src/App.css'
import FreeSoloCreateOptionDialog from './components/AutocompleteEjemplo'

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MiniDrawer/>}>
          <Route index element={<VendorPage/>}/>
          <Route path='reporteVendedor' element={<ReportsVendorPage/>}/>
          <Route path='reporteLocal' element={<ReportsLocalPage/>}/>
          <Route path='autocomplete' element={<FreeSoloCreateOptionDialog/>}/>
        </Route>
        <Route path='login' element={<LoginPage/>}/>
      </Routes>
  </BrowserRouter>
  )
}

export default App
