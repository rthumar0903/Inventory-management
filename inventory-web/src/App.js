import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />}>
          
        </Route>
          <Route path="/dashboard" element={<Dashboard />} ></Route>
        <Route path="/register" element={<Register/>}></Route>  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
