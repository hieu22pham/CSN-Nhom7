import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Table, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

function ThongTinNhanVien() {
  const navigate = useNavigate([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [lichTrinhCongViec, setLichTrinhCongViec] = useState([]);
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [form] = Form.useForm();
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const { user: { uid } } = useContext(AuthContext);
  const { tenNhanVien, setTenNhanVien } =
    React.useContext(AuthContext);

  const fetchLichTrinhCongViec = () => {
    const data = db.collection("NhanVien");
    data
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());

        const a = [];
        productsData.forEach((item) => {
          if (item.HoTenNhanVien === `${tenNhanVien}`) {
            a.push(item);
          } else {
            console.log(item.HoTenNhanVien === `${tenNhanVien}`);
          }
        });

        setLichTrinhCongViec(a);
        console.log(lichTrinhCongViec);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const fetchTenNhanVien = () => {
    const data = db.collection("TaiKhoanNhanVien");
    data
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        setDanhSachNhanVien(productsData);

      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchLichTrinhCongViec = useMemo(() => fetchLichTrinhCongViec, [lichTrinhCongViec]);
  const memoizedFetchTaiKhoanNhanVien = useMemo(() => fetchTenNhanVien, [DanhSachNhanVien]);

  useEffect(() => {
    memoizedFetchLichTrinhCongViec();
    memoizedFetchTaiKhoanNhanVien();
  }, [lichTrinhCongViec.length || DanhSachNhanVien.length]);

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        const NgayLamViec = values.NgayLamViec;
        const formattedNgayLamViec = NgayLamViec ? NgayLamViec.format('DD-MM-YYYY') : null;

        const newProductData = {
          ...form.getFieldsValue(),
          NgayLamViec: formattedNgayLamViec,
        };
        addDocument("NhanVien", newProductData);
        const categoryRef = db.collection("NhanVien");
        memoizedFetchLichTrinhCongViec();
        const categorySnapshot = categoryRef.get();
        if (!categorySnapshot.exists) {
          categoryRef.doc('dummyDoc').set({});
        }
        form.resetFields();
        setIsAddProductVisible(false);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsAddProductVisible(false);
  };

  const handleDeleteDoc = (item) => {
    setIsModalOpen(true);
    setSelectedProduct(item);
  };

  const handleOkDelete = () => {
    setLoading(true);
    const batch = db.batch();

    deleteDocument("NhanVien", selectedProduct.createdAt);

    setLoading(false);
    setIsModalOpen(false);
    memoizedFetchLichTrinhCongViec();
    memoizedFetchTaiKhoanNhanVien();
  };


  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
  };

  const handleTenNhanVien = (item) => {
    const result = item;
    result = result
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Loại bỏ dấu cách
    result = result.replace(/\s/g, "");
    setTenNhanVien(item);
    navigate(`/admin/LichTrinh/${item}`);
  }

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
      <div className='AllLichTrinh'>
        {/* <Button className='btnAddProductCate' onClick={addProduct}><span>Thêm lịch trình</span></Button> */}
        <Modal
          title='Tạo lịch trình'
          visible={isAddProductVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout='vertical'>
            {/* Form fields */}
            <Space wrap>
              <Form.Item
                label='Tên nhân viên'
                name='HoTenNhanVien'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn tên nhân viên!',
                  },
                ]}
              >
                <Select
                  defaultValue={false}
                  style={{
                    width: 200,
                    height: 'auto',
                  }}
                  onChange={handleChange}
                  dropdownMatchSelectWidth={false}
                >
                  {DanhSachNhanVien.map((item) => (
                    item.HoTenNhanVien && (
                      <Option key={item.HoTenNhanVien} value={item.HoTenNhanVien}>
                        {item.title}
                      </Option>
                    )
                  ))}
                </Select>

              </Form.Item>
            </Space>

            <Form.Item name="NgayLamViec" label="Ngày làm việc " {...config}>
              <DatePicker placeholder="Chọn ngày" />
            </Form.Item>
          </Form>
        </Modal >
        <h2 className='tittle'>Thông tin nhân viên: </h2>
        <div className='lichTrinhCongViec__admin'>
          <Row>
            {lichTrinhCongViec.map((item) => (
              <Col key={item.id} span="8">
                <Modal
                  title="Thông báo!"
                  onOk={() => handleOkDelete(item.createdAt)}
                  onCancel={handleCancelDelete}
                  visible={isModalOpen}
                  confirmLoading={loading}
                  footer={[
                    <Button key="back" onClick={handleCancelDelete}>
                      Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOkDelete}>
                      Đồng ý
                    </Button>,
                  ]}
                ></Modal>
                <div className='lich__admin__item'>
                  <div className='lich__admin__name'>
                    <h3>Họ tên: {item.HoTenNhanVien}</h3>
                    <h3>Giới tính: {item.gioiTinh}</h3>
                    <h3>Ngày sinh: {item.ngaySinh}</h3>
                    <h3>Số điện thoại: {item.sdt}</h3>
                    <h3>Email: {item.email}</h3>
                    <h3>Địa chỉ: {item.diaChi}</h3>
                    <h3>Vị trí làm việc: {item.viTriLamViec}</h3>
                    <h3>Kinh nghiệm: {item.kinhNghiem}</h3>
                    <h3>Hồ sơ thuế: {item.hoSoThue}</h3>
                    <h3>Số bảo hiểm xã hội: {item.baoHiemXaHoi}</h3>
                  </div>
                </div>

              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  )
}

export default ThongTinNhanVien;