import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from '@/App'
import { CurrencyProvider } from '@/i18n/CurrencyContext'
import { LanguageProvider } from '@/i18n/LanguageContext'
import '@/index.css'

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CurrencyProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>
)
