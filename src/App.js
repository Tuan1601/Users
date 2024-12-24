// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Home from './components/Dashboard/Home';
import UploadDocument from './components/Documents/UploadDocument';
import Profile from './components/Profile/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/documents/upload" element={<UploadDocument />} />
        <Route path="/profile" element={<Profile />} />


      </Routes>
    </Router>
  );
};

export default App;
