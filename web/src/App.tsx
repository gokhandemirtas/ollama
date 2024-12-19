import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './admin/Admin';
import Prompt from './user/Prompt';
import TopNav from './core/components/TopNav';

export default function App() {
  return (
    <>
      <TopNav />
      <section className="grid justify-items-center my-16">
        <Router>
          <Routes>
            <Route path="/prompt" element={<Prompt />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </section>
    </>
  )
}
