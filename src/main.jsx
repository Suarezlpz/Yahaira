import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { storage } from './utils/Storage.js';

const accessToken = storage.get('user');

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
      <App is inInitiallyLogged = {!!accessToken}/>
  </React.StrictMode>,
)
