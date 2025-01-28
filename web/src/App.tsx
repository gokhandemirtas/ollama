import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import CharacterDesigner from './character-designer/CharacterDesigner';
import Characters from './characters/Characters';
import Conversations from './conversation/Conversations';
import FileUploader from './admin/FileUploader';
import HttpErrorHandler from './core/components/HttpErrorAlert';
import { Layout } from './core/components/Layout';
import ProgressBar from './core/components/ProgressBar';
import { Uploads } from './admin/Uploads';
import useCharacterMetaStore from './core/store/character-meta.store';
import { useEffect } from 'react';
import useHealthCheckStore from './core/store/health-check.store';

export default function App() {
  const { fetchHealthCheckResults } = useHealthCheckStore();
  const { fetchCharacterMeta } = useCharacterMetaStore();

  useEffect(() => {
    fetchHealthCheckResults();
    fetchCharacterMeta();
  }, [fetchHealthCheckResults, fetchCharacterMeta]);

  return (
    <>
      <HttpErrorHandler />
      <ProgressBar />
      <Layout className="grid justify-items-center my-1">
        <Router>
          <Routes>
            <Route path="/prompt" element={<Conversations />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/new-upload" element={<FileUploader />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/designer" element={<CharacterDesigner />} />
            <Route path="/" element={<Conversations />} />
          </Routes>
        </Router>
      </Layout>
    </>
  )
}
