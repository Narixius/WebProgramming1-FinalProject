import { Routes, Route } from "react-router-dom";
import {Login} from './pages/Login'
import {Manage} from './pages/manage'
import React from "react";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/auth" element={<Login />} />
            <Route path="/*" element={<Manage/>} />
        </Routes>
    </div>
  )
}

export default App
