import React from 'react';
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatLichKham from './components/DatLichKham';
import Admin from './components/Admin';
import AuthProvider from './components/Context/AuthProvider';
import QuanLyLichHen from './components/Admin/QuanLyLichHen';
import QuanLyLichTrinh from './components/Admin/QuanLyLichTrinh';
import LoginAdmin from './components/Login/LoginAdmin';
import LoginStaff from './components/Login/LoginStaff/index';
import Staff from './components/Staff';
import LichHenStaff from './components/Staff/LichHenStaff';
import LichTrinhStaff from './components/Staff/LichTrinhStaff';
import LichTrinhNhanVien from './components/Admin/LichTrinhNhanVien';
import { AuthContext } from './components/Context/AuthProvider';
import QuanLyNhanVien from './components/Admin/QuanLyNhanVien';
import ThongTinNhanVien from './components/Admin/ThongTinNhanVien';

function App() {
  const { pathTenNhanVien } =
    React.useContext(AuthContext) || "";

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/login" element={<LoginStaff />} />

          <Route path="/" element={<Home />} >
            <Route path="/DatLichKham" element={<DatLichKham />} />
          </Route>

          <Route path="/admin" element={<Admin />} >
            <Route path="/admin/nhanvien" element={<QuanLyNhanVien />} />
            <Route path="/admin/LichHen" element={<QuanLyLichHen />} />
            <Route path="/admin/LichTrinh" element={<QuanLyLichTrinh />} />
            <Route
              path={`/admin/LichTrinh/:${pathTenNhanVien}`}
              element={< LichTrinhNhanVien />} />

            <Route
              path={`/admin/nhanvien/:${pathTenNhanVien}`}
              element={< ThongTinNhanVien />} />
          </Route>

          <Route path="/staff" element={<Staff />} >
            <Route path="/staff/LichHen" element={<LichHenStaff />} />
            <Route path="/staff/LichTrinh" element={<LichTrinhStaff />} />

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
