import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

function loadContactModal() {
  if (document.querySelector('script[data-contact-modal]')) return

  const script = document.createElement('script')
  script.src = '/contact-modal.js'
  script.async = true
  script.dataset.contactModal = 'true'
  document.body.appendChild(script)
}

loadContactModal()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
