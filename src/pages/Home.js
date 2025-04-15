import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../HomePage.css';

function HomePage() {
  const [stats, setStats] = useState({
    therapists: 4,
    clients: 5,
    sessions: 3,
  });

  return (
    <div className="home-container">
      <h1>Welcome to Therapist Client Management System</h1>
      <div className="quick-stats">
        <div className="stat-box">
          <h3>{stats.therapists}</h3>
          <p>Therapists</p>
        </div>
        <div className="stat-box">
          <h3>{stats.clients}</h3>
          <p>Clients</p>
        </div>
        <div className="stat-box">
          <h3>{stats.sessions}</h3>
          <p>Sessions</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
