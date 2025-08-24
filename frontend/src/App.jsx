import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import ProtectedRoutes from './components/ProtectedRoutes'


// Optional: clear storage before Register
function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Home */}
        <Route
          path='/'
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />

        {/* Public routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
