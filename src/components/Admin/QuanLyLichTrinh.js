import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

function QuanLyLichTrinh() {
  const navigate = useNavigate([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [lichTrinhCongViec, setLichTrinhCongViec] = useState([]);
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [form] = Form.useForm();
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const { user: { uid } } = useContext(AuthContext);
  const { setTenNhanVien, setPathTenNhanVien } =
    React.useContext(AuthContext);

  const fetchLichTrinhCongViec = () => {
    const data = db.collection("LichTrinhCongViec");
    data
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        setLichTrinhCongViec(productsData);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const fetchTenNhanVien = () => {
    const data = db.collection("NhanVien");
    data
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        setDanhSachNhanVien(productsData);
        console.log("Ds:" + DanhSachNhanVien);
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
        addDocument("LichTrinhCongViec", newProductData);
        const categoryRef = db.collection("LichTrinhCongViec");
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

  const addProduct = () => {
    setIsAddProductVisible(true);
  }

  const handleDeleteDoc = (item) => {
    setIsModalOpen(true);
    setSelectedProduct(item);
  };

  const handleOkDelete = () => {
    setLoading(true);
    const batch = db.batch();

    deleteDocument("LichTrinhCongViec", selectedProduct.createdAt);

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
    var result = item;
    result = result
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Loại bỏ dấu cách
    result = result.replace(/\s/g, "");
    setTenNhanVien(item);
    setPathTenNhanVien(result)
    navigate(`/admin/LichTrinh/${result}`);
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
        <Button className='btnAddProductCate' onClick={addProduct}><span>Thêm lịch trình</span></Button>
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
            <Form.Item
              label='Tên công việc'
              name='tenCongViec'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên công việc!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Tên công việc' required />
            </Form.Item>
            <Form.Item
              label='Ca làm việc'
              name='caLamViec'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập ca làm việc!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập ca làm việc' required />
            </Form.Item>
            <Form.Item name="NgayLamViec" label="Ngày làm việc " {...config}>
              <DatePicker placeholder="Chọn ngày" />
            </Form.Item>
          </Form>
        </Modal >
        <h2 className='tittle'>Chọn nhân viên: </h2>
        <div className='danhSachLichHen__admin'>
          <Row>
            {DanhSachNhanVien.map((item) => (
              <Col key={item.id} span="8">
                <Modal
                  title="Thông báo!"
                  onOk={() => handleOkDelete(item.createdAt)}
                  onCancel={handleCancelDelete}
                  visible={isModalOpen}
                  confirmLoading={loading}
                  footer={[
                    <Button type="primary" key="back" onClick={handleCancelDelete}>
                      Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOkDelete}>
                      Đồng ý
                    </Button>,
                  ]}
                ></Modal>
                {item.HoTenNhanVien &&
                  <div className='border'>
                    <div className='nhanVien__admin'>
                      {
                        item.HoTenNhanVien && (
                          <div>
                            <h3>{item.HoTenNhanVien}</h3>
                            <Button onClick={() => handleTenNhanVien(item.HoTenNhanVien)}>Xem chi tiết</Button>
                            {/* <button className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</button>  */}
                          </div>
                        )
                      }
                    </div>
                  </div>
                }
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  )
}

export default QuanLyLichTrinh;