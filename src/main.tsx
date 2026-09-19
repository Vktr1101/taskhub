import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import UserProvider from "./context/UserProvider.tsx";
import './styles/index.css';
import './styles/layout.css';
import './styles/tasks.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
        <App />
    </UserProvider>
  </StrictMode>,
)
