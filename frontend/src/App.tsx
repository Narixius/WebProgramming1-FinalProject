import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Manage } from './pages/manage'
import React from 'react'
import { Box } from '../components/Box'

function App() {
  return (
    <Box css={{ fontFamily: "'Roboto', sans-serif" }} className='App'>
      <Routes>
        <Route path='/auth' element={<Login />} />
        <Route path='/*' element={<Manage />} />
      </Routes>
    </Box>
  )
}

export default App
