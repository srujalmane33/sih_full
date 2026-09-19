import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ZoneProvider, SimulationProvider, UIProvider } from './context';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/feedback/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <ZoneProvider>
          <SimulationProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
            <Toaster
              position="bottom-right"
              theme="light"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                },
              }}
              richColors
              closeButton
            />
          </SimulationProvider>
        </ZoneProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
