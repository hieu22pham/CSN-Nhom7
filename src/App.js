import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatLichKham from './components/DatLichKham';
import Admin from './components/Admin';
import AuthProvider from './components/Context/AuthProvider';
import AppProvider from './components/Context/AppProvider';
import AccountStaff from './components/Admin/AccountStaff';
import QuanLyLichHen from './components/Admin/QuanLyLichHen';
import QuanLyLichTrinh from './components/Admin/QuanLyLichTrinh';
import LoginAdmin from './components/Login/LoginAdmin';
import LoginStaff from './components/Login/LoginStaff/index';
import Staff from './components/Staff';
import LichHenStaff from './components/Staff/LichHenStaff';
import LichTrinhStaff from './components/Staff/LichTrinhStaff';

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login/admin" element={<LoginAdmin />} />
            <Route path="/login" element={<LoginStaff />} />

            <Route path="/" element={<Home />} >
              <Route path="/DatLichKham" element={<DatLichKham />} />
            </Route>

            <Route path="/admin" element={<Admin />} >
              <Route path="/admin/user" element={<AccountStaff />} />
              <Route path="/admin/LichHen" element={<QuanLyLichHen />} />
              <Route path="/admin/LichTrinh" element={<QuanLyLichTrinh />} />
            </Route>

            <Route path="/staff" element={<Staff />} >
              <Route path="/staff/LichHen" element={<LichHenStaff />} />
              <Route path="/staff/LichTrinh" element={<LichTrinhStaff />} />

            </Route>
          </Routes>
          {/* Add more routes if needed */}
        </AppProvider>
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
