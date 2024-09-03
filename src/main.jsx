import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { storage } from './utils/Storage.js';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const accessToken = storage.get('user');
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App is inInitiallyLogged = {!!accessToken}/>
    </QueryClientProvider>
  </React.StrictMode>,
)
