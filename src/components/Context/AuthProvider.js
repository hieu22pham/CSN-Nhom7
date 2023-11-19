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
  const [categories, setCategories] = useState([]);
  const [cate, setCate] = useState('');
  const [textProduct, setTextProduct] = useState('');
  const [product, setProduct] = useState('');
  const [slideImages, setSlideImages] = useState('');

  React.useEffect(() => {
    const data = db.collection('categories');

    data
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setCategories(data); // Lưu trữ dữ liệu vào state
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  }, []);

  React.useEffect(() => {
    // Kiểm tra trạng thái đăng nhập của người dùng
    const unsubscibed = auth.onAuthStateChanged((user) => {
      if (user) {
        // Xác định providerId của người dùng
        const providerId = user.providerData[0].providerId;

        if (providerId === 'password') {
          // Người dùng đăng nhập bằng tài khoản mật khẩu
          const { displayName, email, uid, photoURL } = user;
          setUser({
            displayName,
            email,
            uid,
            photoURL,
          });
          setIsLoading(false);
          // if (displayName) {
          if ((location.pathname === '/admin')) {
            navigate('/admin');
          }
          // }

          if (location.pathname === '/admin/products') {
            alert("hii")
            navigate('/admin/products');
          }
          if (location.pathname === `/admin/${cate.category}`) {
            console.log("hi")
            navigate(`/admin/${cate.category}`);
          }
          // if (location.pathname === '/') {
          //   navigate('/');
          // }
          // if (location.pathname === '/') {
          //   navigate('/');
          // }
          console.log(user)
        } else if (providerId === 'facebook.com') {
          alert("fb");
          // Người dùng đăng nhập bằng Facebook
          const { displayName, email, uid, photoURL } = user;
          setUser({
            displayName,
            email,
            uid,
            photoURL,
          });
          setIsLoading(false);
          if ((location.pathname === '/')) {
            navigate('/');
          }
          if (location.pathname === `/mobile/${cate?.category}.html`) {
            console.log("hi")
            navigate(`/mobile/${cate?.category}.html`);
          }
        }
      }
      else {
        // reset user info
        // setUser({});
        setIsLoading(false);
        if (!user && (location.pathname === '/')) {
          navigate('/');
        }
        if (!user && (location.pathname === '/login')) {
          navigate('/login');
        }
        if (!user && (location.pathname === `/mobile/${cate?.category}`)) {
          navigate(`/mobile/${cate?.category}`);
        } if (!user && (location.pathname === `/${textProduct}`)) {
          navigate(`/${textProduct}`);
        }
      }

    }
    );

    // clean function
    return () => {
      unsubscibed();
    };
  }, [navigate]);

  // React.useEffect(() => {
  //   // Kiểm tra nếu người dùng chưa đăng nhập và đang ở trang "/admin" hoặc "/login"
  //   // thì chuyển hướng về trang "/" để cho phép truy cập vào các trang này
  //   if (!user && (location.pathname === '/admin' || location.pathname === '/login')) {
  //     navigate('/');
  //   }
  // }, [user, location, navigate]);

  return (
    <AuthContext.Provider value={{
      user, setUser, categories, cate, setCate, product, setProduct
      , textProduct, setTextProduct
    }}>
      {isLoading ? <Spin style={{ position: 'fixed', inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);