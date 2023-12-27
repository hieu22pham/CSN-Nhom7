import "./styles.css";
import { useAuth } from "../Context/AuthProvider";
import dayjs from 'dayjs';
import React from "react";
import { AuthContext } from "../Context/AuthProvider";
import { Input, Form, Button } from "antd";
import dayLocaleData from 'dayjs/plugin/localeData';
import { DatePicker, Space, Alert, Select } from 'antd';
import { useState, useEffect, useMemo } from "react";
import { db } from '../../firebase/config';
import { addDocument } from "../Service/AddDocument";
const options = [];

for (let i = 8; i <= 17; i++) {
  if (i != 12) {
    options.push({
      value: i + " giờ",
      label: i + " giờ",
    });
  }
}

dayjs.extend(dayLocaleData);
const { Option } = Select;
export default function DatLichKham() {
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [lichKhamData, setLichKhamData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [form] = Form.useForm();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const onChange = (date, dateString) => {
    const formattedNgayDenKham = date ? date.format('DD-MM-YYYY') : null;
    const a = [];
    DanhSachNhanVien.map((item) => {
      if (item.NgayLamViec == formattedNgayDenKham && !a.includes(item.HoTenNhanVien)) {
        a.push(item.HoTenNhanVien);
      }
    })
    form.resetFields(['HoTenNhanVien'])
    setDateData(a);
  };

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        const NgayDenKham = values.NgayDenKham;
        const formattedNgayDenKham = NgayDenKham ? NgayDenKham.format('DD-MM-YYYY') : null;

        const newProductData = {
          ...form.getFieldsValue(),
          NgayDenKham: formattedNgayDenKham,
        };

        addDocument("LichKham", newProductData);
        setShowSuccessAlert(true);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  };

  const fetchLichKhamData = () => {
    const data = db.collection('LichKham');
    data
      .get()
      .then((querySnapshot) => {
        const products = querySnapshot.docs.map((doc) => doc.data());
        setLichKhamData(products); // Update state with the data
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const fetchTenNhanVien = () => {
    const data = db.collection("LichTrinhCongViec");
    data
      .get()
      .then((querySnapshot) => {
        const lichKhamData = querySnapshot.docs.map((doc) => doc.data());
        setDanhSachNhanVien(lichKhamData);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchLichKhamData = useMemo(() => fetchLichKhamData, [lichKhamData]);
  const memoizedFetchTaiKhoanNhanVien = useMemo(() => fetchTenNhanVien, [DanhSachNhanVien]);

  useEffect(() => {
    memoizedFetchLichKhamData();
    memoizedFetchTaiKhoanNhanVien();

    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        form.resetFields();
      }, 8000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [lichKhamData.length, showSuccessAlert]);

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Vui lòng chọn ngày!',
      },
    ],
  };

  const configSelect = {
    placeholder: "Ok",
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
            message="Đặt lịch khám thành công!"
            type="success"
            showIcon
            onClose={() => setShowSuccessAlert(false)} // Optional: add a close button
          />
        </Space>
      )}
      <Form className="formDatLich" form={form} layout='vertical'>
        {/* Form fields */}
        <h2>Đặt lịch khám trực tuyến</h2>
        <Form.Item label='Họ tên' name='HoTen'
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
        <Form.Item label='E-mail' name='Email'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập Email!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập Email' />
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
        <Form.Item label='Thời gian khám' name='ThoiGianKham'
          rules={[
            {
              required: true,
              message: 'Vui lòng thời gian khám!',
            },
          ]}
        >
          <Select
            id="selectName"
            placeholder="Nhân viên y tế"
            defaultValue={false}
            style={{
              width: 200,
            }}
            dropdownMatchSelectWidth={false}
            options={options}
          >
            {dateData.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="NgayDenKham" label="Ngày đến khám" {...config}>
          <DatePicker onChange={onChange} />
        </Form.Item>
        {/* <Form.Item label='Chọn tên nhân viên y tế' name='HoTenNhanVien'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn tên nhân viên y tế!',
            },
          ]}
        >
          <Select
            id="selectName"
            placeholder="Nhân viên y tế"
            defaultValue={false}
            style={{
              width: 200,
            }}
            dropdownMatchSelectWidth={false}
          >
            {dateData.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item> */}
        <Form.Item label='Mô tả tình trạng bệnh:' name='TinhTrangBenh'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tình trạng bệnh!',
            },
          ]}
        >
          <Input className="inputWidth" placeholder='Nhập tình trạng bệnh' required />
        </Form.Item>

        <Button type='primary' className="btnDatLich" onClick={handleSubmit}>Gửi</Button>
      </Form>

    </>
  );
}
