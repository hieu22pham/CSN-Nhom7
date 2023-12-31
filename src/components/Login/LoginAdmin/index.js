import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import firebase, { auth } from '../../../firebase/config';
import { addDocument } from '../../Service/AddDocument';
import { Form, Input, Checkbox, Space, Badge, Alert, message, ConfigProvider } from 'antd';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography;
export const fbProvider = new firebase.auth.FacebookAuthProvider();

function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const onFinish = async (e) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      setShowSuccessAlert(true);
      setTimeout(() => { }, 7000);
      setShowSuccessAlert(false);
      navigate("/admin")
    } catch (error) {
      setShowErrorAlert(true);
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
                <Input placeholder='Email của bạn' onChange={(e) => setEmail(e.target.value)} />
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
                <Input.Password placeholder='Mật khẩu' onChange={(e) => setPassword(e.target.value)} />
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
        </div>
      </div >
    </>
  )
}

export default LoginAdmin;