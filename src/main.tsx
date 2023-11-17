import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home/index.tsx';
import Tasks from './pages/Tasks/index.tsx';

import './index.css';

// Configurando o QueryClient
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/tasks',
    element: <Tasks />
  }
]);

// Envolve a aplicação com QueryClientProvider, passando o queryClient criado
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
