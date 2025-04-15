import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './pages/Home';
import TherapistPage from './pages/TherapistPage';
import ClientPage from './pages/ClientPage';
import SessionPage from './pages/SessionPage';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Therapist Client Management System</h1>

        {/* Navigation */}
        <nav>
          <Link to="/"><button>Home</button></Link>
          <Link to="/therapists"><button>Therapists</button></Link>
          <Link to="/clients"><button>Clients</button></Link>
          <Link to="/sessions"><button>Sessions</button></Link>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/therapists" element={<TherapistPage />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/sessions" element={<SessionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;