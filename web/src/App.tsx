import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Characters from './characters/Characters';
import HttpErrorHandler from './core/components/HttpErrorAlert';
import { Layout } from './core/components/Layout';
import ProgressBar from './core/components/ProgressBar';
import Prompt from './user/Prompt';
import Uploader from './admin/Uploader';
import { Uploads } from './admin/Uploads';

export default function App() {
  return (
    <>
      <HttpErrorHandler />
      <ProgressBar />
      <Layout className="grid justify-items-center my-1">
        <Router>
          <Routes>
            <Route path="/prompt" element={<Prompt />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/new-upload" element={<Uploader />} />
            <Route path="/characters" element={<Characters />} />
          </Routes>
        </Router>
      </Layout>
    </>
  )
}
