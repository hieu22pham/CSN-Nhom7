import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Badge, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const options = [];

for (let i = 8; i <= 17; i++) {
  if (i !== 12) {
    options.push({
      value: i + " giờ",
      label: i + " giờ",
    });
  }
}


function ChiTietLHDaPhanCong() {
  const [danhSachNhanViens, setDanhSachNhanViens] = useState([]);
  const [dateData, setDateData] = useState([]);
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState({});
  const [formSua] = Form.useForm();

  const fetchLichTrinhCongViec = () => {
    const data = db.collection("LichHenDaPhanCong");
    data
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());

        const a = [];
        productsData.forEach((item) => {
          if (item.HoTenNhanVien === `${tenNhanVien}`) {
            a.push(item);
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

    deleteDocument("LichHenDaPhanCong", selectedProduct.createdAt);

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

  // sửa
  const handleEditDoc = (item) => {
    setIsEditModalOpen(true);
    setSelectedProductForEdit(item);
    formSua.validateFields()
      .then((values) => {
        const updatedProductData = {
          ...values,
        };
      })
  };

  const handleOkEdit = () => {
    setLoading(true);
    formSua.validateFields()
      .then((values) => {
        const updatedProductData = {
          ...values,
        };

        const existingProductRef = db.collection("LichHenDaPhanCong").where('createdAt', '==', selectedProductForEdit.createdAt).limit(1);

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
                    form.setFieldsValue(updatedProductData);
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

  const onChange = (date, dateString) => {
    const moment = require('moment');
    const formattedNgayDenKham = date ? moment(date).format('DD-MM-YYYY') : null;
    const uniqueNhanVienNames = Array.from(new Set(danhSachNhanViens
      .filter(item => item.NgayLamViec === formattedNgayDenKham)
      .map(item => item.HoTenNhanVien)));
    setDateData(uniqueNhanVienNames);
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
        <Modal
          title='Sửa thông tin lịch hẹn'
          visible={isEditModalOpen}
          onOk={handleOkEdit}
          onCancel={handleCancelEdit}
        >
          <Form form={formSua} layout='vertical' initialValues={selectedProductForEdit}>
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
              <Input className="inputWidth" placeholder='Nhập thời gian khám' required />
            </Form.Item>

            <Form.Item name="NgayDenKham" label="Ngày đến khám">
              <Input className="inputWidth" placeholder='Nhập ngày đến khám' required />
            </Form.Item>
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
          </Form>
        </Modal>
        <h2 className='tittle'>Thông tin lịch hẹn: </h2>
        <h3>Tên nhân viên: {tenNhanVien}</h3>
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
                <div className='margin'>
                  <div className='lich__admin__item1'>
                    <Badge.Ribbon className='badge'
                      text={`${item.trangThaiCuocHen}`}
                      color="red"
                    >
                      <div className='lich__admin__name1'>
                        <h3>Họ tên: {item.HoTen}</h3>
                        <h3>Giới tính: {item.GioiTinh}</h3>
                        <h3>Ngày sinh: {item.NgaySinh}</h3>
                        <h3>Ngày sinh: {item.SoDienThoai}</h3>
                        <h3>Thời gian khám: {item.ThoiGianKham}</h3>
                        <h3>Ngày đến khám: {item.NgayDenKham}</h3>
                        <h3>Tình trạng bệnh: {item.TinhTrangBenh}</h3>
                      </div>
                      <Button className='btn_Sua2' onClick={() => handleEditDoc(item)}>Sửa</Button>
                      <Button type="primary" danger className='btn_delete2' onClick={() => handleDeleteDoc(item)}>Xóa</Button>
                    </Badge.Ribbon>
                  </div>
                </div>

              </Col>
            ))}
          </Row>
        </div>
      </div >
    </>
  )
}

export default ChiTietLHDaPhanCong;