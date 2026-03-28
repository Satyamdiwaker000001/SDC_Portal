import {  BrowserRouter, Route, Routes } from 'react-router-dom'
// import Login from './pages/login.tsx';
import Dashboard from './pages/Dashboard.tsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
