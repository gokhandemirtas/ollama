import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Characters from './characters/Characters';
import FileUploader from './admin/FileUploader';
import HttpErrorHandler from './core/components/HttpErrorAlert';
import { Layout } from './core/components/Layout';
import ProgressBar from './core/components/ProgressBar';
import Prompt from './conversation/Prompt';
import { Uploads } from './admin/Uploads';
import { useEffect } from 'react';
import useHealthCheckStore from './core/store/health-check.store';

export default function App() {
  const { fetchHealthCheckResults } = useHealthCheckStore();

  useEffect(() => {
    fetchHealthCheckResults();
  }, [fetchHealthCheckResults]);

  return (
    <>
      <HttpErrorHandler />
      <ProgressBar />
      <Layout className="grid justify-items-center my-1">
        <Router>
          <Routes>
            <Route path="/prompt" element={<Prompt />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/new-upload" element={<FileUploader />} />
            <Route path="/characters" element={<Characters />} />
          </Routes>
        </Router>
      </Layout>
    </>
  )
}
