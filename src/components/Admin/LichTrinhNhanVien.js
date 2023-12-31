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

function LichTrinhNhanVien() {
  const navigate = useNavigate([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState({});
  const [formSua] = Form.useForm();

  const [lichTrinhCongViec, setLichTrinhCongViec] = useState([]);
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [form] = Form.useForm();
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const { user: { uid } } = useContext(AuthContext);
  const { tenNhanVien, setTenNhanVien } =
    React.useContext(AuthContext);

  const fetchLichTrinhCongViec = () => {
    const data = db.collection("LichTrinhCongViec");
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

  const handleEditDoc = (item) => {
    setIsEditModalOpen(true);
    setSelectedProductForEdit(item);
  };

  const handleOkEdit = () => {
    setLoading(true);
    formSua.validateFields()
      .then((values) => {
        const updatedProductData = {
          ...values,
        };

        const existingProductRef = db.collection("LichTrinhCongViec").where('createdAt', '==', selectedProductForEdit.createdAt).limit(1);

        existingProductRef.get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const firstDoc = querySnapshot.docs[0];
              if (firstDoc) {
                const existingProduct = firstDoc.data();

                // Update the existing product data
                firstDoc.ref.update(updatedProductData)
                  .then(() => {
                    console.log("Document successfully updated!");
                    memoizedFetchLichTrinhCongViec();
                    formSua.setFieldsValue(updatedProductData);
                    setIsEditModalOpen(false);
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error);
                  });
              } else {
                console.error("Error: Empty document array.");
              }
            } else {
              console.log("Product not found");
            }
          })
      })
      .catch((error) => {
        console.error("Error checking document existence:", error);
      });
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
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
        <h2 className='tittle'>Danh sách lịch trình: </h2>
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
                <Modal
                  title='Sửa thông tin hàng'
                  visible={isEditModalOpen}
                  onOk={handleOkEdit}
                  onCancel={handleCancelEdit}
                >
                  <Form form={formSua} layout='vertical' initialValues={selectedProductForEdit}>
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
                    <Form.Item name="NgayLamViec" label="Ngày làm việc " >
                      <Input className="inputWidth" placeholder='Nhập ngày làm việc' required />

                    </Form.Item>
                  </Form>
                </Modal>
                <div className='lich__admin__item'>
                  <div className='lich__admin__name'>
                    <h3>{item.HoTenNhanVien}</h3>
                    <h3>Tên công việc: {item.tenCongViec}</h3>
                    <h3>Ca làm việc: {item.caLamViec}</h3>
                    <h3>Ngày làm việc: {item.NgayLamViec}</h3>
                  </div>
                  <Button className='btn_Sua3' onClick={() => handleEditDoc(item)}>Sửa</Button>
                  <Button type="primary" danger className='btn_delete3' onClick={() => handleDeleteDoc(item)}>Xóa</Button>
                </div>

              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  )
}

export default LichTrinhNhanVien;