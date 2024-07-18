import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import JSONFormatter from './json-formatter/index.tsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JSONFormatter />
  </React.StrictMode>,
)
