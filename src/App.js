import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatLichKham from './components/DatLichKham';
import Admin from './components/Admin';
import Login from './components/Login';
import AuthProvider from './components/Context/AuthProvider';
import AppProvider from './components/Context/AppProvider';
import AccountStaff from './components/Admin/AccountStaff';
import QuanLyLichHen from './components/Admin/QuanLyLichHen';
import QuanLyLichTrinh from './components/Admin/QuanLyLichTrinh';

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Home />} >
              <Route path="/DatLichKham" element={<DatLichKham />} />
            </Route>

            <Route path="/admin" element={<Admin />} >
              <Route path="/admin/user" element={<AccountStaff />} />
              <Route path="/admin/LichHen" element={<QuanLyLichHen />} />
              <Route path="/admin/LichTrinh" element={<QuanLyLichTrinh />} />
            </Route>
          </Routes>
          {/* Add more routes if needed */}
        </AppProvider>
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
