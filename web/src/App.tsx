import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './admin/Admin';
import ErrorBoundary from './core/services/ErrorBoundary';
import { ErrorProvider } from './core/services/ErrorContext';
import { Layout } from './core/components/Layout';
import Prompt from './user/Prompt';
import Uploader from './admin/components/uploader/Uploader';
import { Uploads } from './admin/components/uploader/Uploads';

export default function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <Layout className="grid justify-items-center my-1">
          <Router>
            <Routes>
              <Route path="/prompt" element={<Prompt />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/uploads" element={<Uploads />} />
              <Route path="/new-upload" element={<Uploader />} />
            </Routes>
          </Router>
        </Layout>
      </ErrorBoundary>
    </ErrorProvider>
  )
}
