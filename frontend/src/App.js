import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateIou from './pages/CreateIou';
import RequestHelp from './pages/RequestHelp';
import Search from './pages/Search';
import Login from './pages/Login';

function App() {
  // 1. Check if user is already saved in LocalStorage (so refreshing doesn't log you out)
  const savedUser = JSON.parse(localStorage.getItem('skillIouUser'));
  const [currentUser, setCurrentUser] = useState(savedUser);

  // 2. Login Function
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('skillIouUser', JSON.stringify(user)); // Save to browser
  };

  // 3. Logout Function
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skillIouUser');
  };

  // If NOT logged in, show only Login Page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Navbar onLogout={handleLogout} /> 
      <div style={{ marginTop: '20px' }}>
        <Routes>
          {/* Pass the currentUser ID to the pages */}
          <Route path="/" element={<Dashboard currentUserId={currentUser.id} />} />
          <Route path="/create-iou" element={<CreateIou currentUserId={currentUser.id} />} />
          <Route path="/request-help" element={<RequestHelp currentUserId={currentUser.id} />} />
          <Route path="/search" element={<Search currentUserId={currentUser.id} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;