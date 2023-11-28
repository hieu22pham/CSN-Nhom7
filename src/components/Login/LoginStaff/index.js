import React, { useMemo, useEffect } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import firebase, { auth } from '../../../firebase/config';
import { addDocument } from '../../Service/AddDocument';
import { Form, Input, Checkbox, Space, Badge, Alert, message, ConfigProvider } from 'antd';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';

const { Title } = Typography;
export const fbProvider = new firebase.auth.FacebookAuthProvider();

function LoginStaff() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const { tenHienThi, setTenHienThi } =
    React.useContext(AuthContext);

  const fetchTenNhanVien = () => {
    const messagesRef = db.collection("TaiKhoanNhanVien");
    messagesRef
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        setDanhSachNhanVien(productsData);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchTaiKhoanNhanVien = useMemo(() => fetchTenNhanVien, [DanhSachNhanVien]);

  useEffect(() => {
    memoizedFetchTaiKhoanNhanVien();
  }, []);

  const onFinish = async (e) => {
    try {
      const tenDangNhap = document.getElementById("tenDangNhap").value;
      const matKhau = document.getElementById("matKhau").value;

      DanhSachNhanVien.map((item) => {
        if (tenDangNhap == item.TaiKhoan && matKhau == item.MatKhau && item.HoTenNhanVien != "") {
          // navigate("/");
          setShowSuccessAlert(true);
          setTimeout(() => { }, 7000);
          setShowSuccessAlert(false);
          setTenHienThi(item.HoTenNhanVien)
          navigate("/staff")

        } else {
          // navigate("/");
          console.log(tenHienThi)
        }
      });
    } catch (error) {
      setShowErrorAlert(true);
      console.log(error)
    }
  };

  return (
    <>
      <Space direction="vertical" style={{
        position: "absolute", width: '200px',
        marginLeft: "555px", marginTop: "293px"
      }}>

        {showErrorAlert && (
          <Badge key={"red"} color={"red"} text={"Sai mật khẩu"} />
        )}
      </Space>

      <Space direction="vertical" style={{
        position: "absolute", width: '200px',
        marginTop: "50px"
      }}>
        {showSuccessAlert && (
          <Alert message="Đăng nhập thành công!" type="success" showIcon />
        )}
      </Space>
      <div className='login'>
        {/* <div className='login-logo'>
          <img className='logo' src="data:image/png;base64,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" />
        </div> */}
        <div className='login-content'>
          <h3 className='textLogin'>Đăng nhập</h3>
          <Row justify={"center"} gutter={20}>
            <Form
              name="basic"
              labelCol={{
              }}
              wrapperCol={{
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                style={{ width: "282px", marginBottom: "35px" }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập Email!',
                  },
                ]}
              >
                <Input id="tenDangNhap" placeholder='Email của bạn' onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="password"
                style={{ width: "282px", marginBottom: "35px" }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu!',
                  },
                ]}
              >
                <Input.Password id="matKhau" placeholder='Mật khẩu' onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                  offset: 7,
                }}
              >
                <Checkbox style={{ position: "absolute", top: "-17px", left: "-82px" }}>Ghi nhớ</Checkbox>
              </Form.Item>
              <Button className='quenMk' type="text" block>
                Quên mật khẩu?
              </Button>

              <Form.Item
                wrapperCol={{
                  offset: 7,
                }}
              >
                <Button className='button-login' type="primary" htmlType="submit">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Row>
          {/* <Row className="rowGg" justify={"center"} >
            <Button className='loginGoogle'>Đăng nhập bằng Google</Button>
          </Row>
          <Row justify={"center"} gutter={40}>
            <Button onClick={handleFbLogin}>Đăng nhập bằng Facebook</Button>
          </Row> */}
        </div>
      </div >
    </>
  )
}

export default LoginStaff;