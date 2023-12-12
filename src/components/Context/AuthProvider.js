import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { Spin } from 'antd';
import { Location } from 'react-router-dom';
import { db } from '../../firebase/config';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lichKham, setLichKham] = useState([]);
  const [cate, setCate] = useState('');
  const [textProduct, setTextProduct] = useState('');
  const [product, setProduct] = useState('');
  const [tenHienThi, setTenHienThi] = useState('');
  const [tenNhanVien, setTenNhanVien] = useState('');
  const [pathTenNhanVien, setPathTenNhanVien] = useState('');


  React.useEffect(() => {
    const data = db.collection('LichKham');
    data
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setLichKham(data); // Lưu trữ dữ liệu vào state
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  }, []);

  React.useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged((user) => {
      if (user) {
        const providerId = user.providerData[0].providerId;

        if (providerId === 'password') {
          const { displayName, email, uid, photoURL } = user;
          setUser({
            displayName,
            email,
            uid,
            photoURL,
          });
          setIsLoading(false);
          if ((location.pathname === '/admin')) {
            navigate('/admin');
          }
        }
      }
      else {
        setIsLoading(false);
        if (!user && (location.pathname === '/')) {
          navigate('/');
        }
        if (!user && (location.pathname === '/login')) {
          navigate('/login');
        }
      }
    }
    );

    return () => {
      unsubscibed();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user, setUser, lichKham, cate, setLichKham, product, setProduct
      , textProduct, setTextProduct, tenHienThi, setTenHienThi, tenNhanVien, setTenNhanVien
      , pathTenNhanVien, setPathTenNhanVien
    }}>
      {isLoading ? <Spin style={{ position: 'fixed', inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);