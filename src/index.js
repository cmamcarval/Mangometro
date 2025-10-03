import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './index.css';
import App from './App';
import Login from "./components/Login";
import { auth } from './firebase';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return authenticated ? children : <Navigate to="/login" />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<Login />);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/Mangometro">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/mangometro" element={<RequireAuth><App /></RequireAuth>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


serviceWorkerRegistration.register();