import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './admin/Admin';
import ErrorBoundary from './core/services/ErrorBoundary';
import Prompt from './user/Prompt';
import TopNav from './core/components/TopNav';

export default function App() {
  return (
    <ErrorBoundary>
      <TopNav />
      <section className="grid justify-items-center my-8">
        <Router>
          <Routes>
            <Route path="/prompt" element={<Prompt />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </section>
    </ErrorBoundary>
  )
}
