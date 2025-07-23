import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Loginpages';
import DashboardPage from './Pages/Dashboard';

  
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
} 

export default App;
 