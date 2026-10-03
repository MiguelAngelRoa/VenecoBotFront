import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import IndexChat from './components/IndexChat/IndexChat'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IndexChat/>
  </StrictMode>,
)
