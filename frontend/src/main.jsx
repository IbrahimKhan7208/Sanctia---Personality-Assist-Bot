import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'

posthog.init('phc_H2JgIGNCXIr1ChH3svFhfcRU7LuEmccXbFntbqq8Kia',
  {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    autocapture: false,
    capture_pageview: false,
    debug: true
  }
)

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
