import { BrowserRouter, Route, Routes } from 'react-router-dom';
// Check karo ki login.tsx small 'l' hai ya capital 'L'
import Login from './pages/login.tsx'; 
import Dashboard from './pages/dashboard.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Entry Point */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;