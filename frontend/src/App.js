import React from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import PrivateRoute from "./components/PrivateRoute";
import Planning from "./pages/Planning";
import ChatCoach from "./pages/ChatCoach";
import Portfolio from "./pages/Portfolio";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/chat-coach" element={<ChatCoach />} />
        <Route path="/portfolio" element={<Portfolio />} />
        
        <Route 
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
