import "./styles.css";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Input, Form } from "antd";
import dayLocaleData from 'dayjs/plugin/localeData';
import { DatePicker, Space, Alert, Button } from 'antd';
import { useState, useEffect, useMemo } from "react";
import { db } from '../../firebase/config';
import { addDocument } from "../Service/AddDocument";

dayjs.extend(dayLocaleData);
export default function AccountStaff() {
  const messagesRef = db.collection('TaiKhoanNhanVien');
  const [productsData, setProductsData] = useState([]);
  const [form] = Form.useForm();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        const NgayDenKham = values.NgayDenKham;
        const formattedNgayDenKham = NgayDenKham ? NgayDenKham.format('DD-MM-YYYY') : null;

        const newProductData = {
          ...form.getFieldsValue(),
          NgayDenKham: formattedNgayDenKham,
        };

        addDocument("TaiKhoanNhanVien", newProductData);
        setShowSuccessAlert(true);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  };

  const fetchMessagesData = () => {
    messagesRef
      .get()
      .then((querySnapshot) => {
        const products = querySnapshot.docs.map((doc) => doc.data());
        setProductsData(products); // Update state with the data
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchMessagesData = useMemo(() => fetchMessagesData, [productsData]);

  useEffect(() => {
    memoizedFetchMessagesData();
    console.log(productsData);

  }, [productsData.length]);

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Vui lòng chọn ngày!',
      },
    ],
  };

  return (
    <>
      {showSuccessAlert && (
        <Space
          direction="vertical"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "20%",
          }}
        >
          <Alert
            message="Success Tips"
            type="success"
            showIcon
            onClose={() => setShowSuccessAlert(false)} // Optional: add a close button
          />
        </Space>
      )}
      <Form className="formDatLich" form={form} layout='vertical'>
        {/* Form fields */}
        <h2>Tạo tài khoản</h2>
        <Form.Item label='Mã nhân viên' name='MaNhanVien'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mã nhân viên!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập mã nhân viên' required />
        </Form.Item>
        <Form.Item label='Họ tên nhân viên' name='HoTenNhanVien'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ tên!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập họ tên' required />
        </Form.Item>
        <Form.Item label='Giới tính' name='GioiTinh'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giới tính!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập giới tính' required />
        </Form.Item>
        <Form.Item label='Ngày sinh' name='NgaySinh'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập ngày sinh!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập ngày sinh' required />
        </Form.Item>

        <Form.Item label='Số điện thoại' name='SoDienThoai'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập số điện thoại' required />
        </Form.Item>
        <Form.Item label='Tài khoản' name='TaiKhoan'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tài khoản!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập tài khoản' required />
        </Form.Item>

        <Form.Item label='Mật khẩu' name='MatKhau'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!',
            },
          ]}
        >
          <Input.Password className="inputWidth" />
        </Form.Item>

        <button onClick={handleSubmit}>Gửi</button>
      </Form>

    </>
  );
}
