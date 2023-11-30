import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
const { Option } = Select;

function QuanLyLichTrinh() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const { cate } = useContext(AuthContext);
  const [productsCate, setProductsCate] = useState([]);
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [form] = Form.useForm();
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const { user: { uid } } = useContext(AuthContext);

  const fetchMessagesData = () => {
    const messagesRef = db.collection("LichTrinhCongViec");
    messagesRef
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        setProductsCate(productsData);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

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

  const memoizedFetchMessagesData = useMemo(() => fetchMessagesData, [productsCate]);
  const memoizedFetchTaiKhoanNhanVien = useMemo(() => fetchTenNhanVien, [DanhSachNhanVien]);

  useEffect(() => {
    // Fetch data from Firestore when the component mounts
    memoizedFetchMessagesData();
    memoizedFetchTaiKhoanNhanVien();
  }, [productsCate.length || DanhSachNhanVien.length]);

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
        // addDocument("products", { ...form.getFieldsValue(), category: [cate.category] });
        const categoryRef = db.collection("LichTrinhCongViec");
        memoizedFetchMessagesData();
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
    // const categoryRef = db.collection(cate.category).doc(selectedProduct.createdAt);
    // batch.delete(categoryRef);

    // const productsRef = db.collection("products").doc(selectedProduct.createdAt);
    // batch.delete(productsRef);
    setLoading(false);
    setIsModalOpen(false);
    memoizedFetchMessagesData();
    memoizedFetchTaiKhoanNhanVien();
  };


  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
  };

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

            <Form.Item name="NgayLamViec" label="Ngày làm việc " {...config}>
              <DatePicker placeholder="Chọn ngày" />
            </Form.Item>
            {/* <Form.Item label='URL ảnh' name='photoURL'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập URL ảnh!',
                },
              ]}
            >
              <Input placeholder='Nhập URL' required />
            </Form.Item>
            <Form.Item label='Giá gốc' name='priceOriginal'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá gốc sản phẩm!',
                },
              ]}
            >
              <Input placeholder='Nhập giá gốc sản phẩm' required />
            </Form.Item>
            <Form.Item label='Giá bán' name='priceDiscount'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá bán sản phẩm!',
                },
              ]}
            >
              <Input placeholder='Nhập giá bán sản phẩm' required />
            </Form.Item>
            <Form.Item label='Mô tả' name='description'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mô tả!',
                },
              ]}
            >
              <Input placeholder='Nhập mô tả' required />
            </Form.Item> */}
          </Form>
        </Modal >
        <h2 className='tittle'>Tất cả lịch trình</h2>
        <div className='productsCate__admin'>
          <Row>
            {productsCate.map((item) => (
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
                {item.HoTenNhanVien && (
                  <div className='productsCate__admin__item'>
                    <div className='productsCate__admin_name'>
                      <h3>{item.HoTenNhanVien}</h3>
                      <h3>{item.NgayLamViec}</h3>
                    </div>
                    <button className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</button>
                    <div className='productsCate__admin_image'>

                    </div>
                  </div>
                )}

              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  )
}

export default QuanLyLichTrinh;