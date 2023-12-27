import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import "./styles.css"

const { Option } = Select;

function QuanLyNhanVien() {
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState({});
  const [formSua] = Form.useForm();

  const fetchLichTrinhCongViec = () => {
    const data = db.collection("NhanVien");
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

  useEffect(() => {
    memoizedFetchLichTrinhCongViec();
  }, [lichTrinhCongViec.length || DanhSachNhanVien.length]);

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        const newProductData = {
          ...form.getFieldsValue(),
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

    deleteDocument("NhanVien", selectedProduct.createdAt);

    setLoading(false);
    setIsModalOpen(false);
    memoizedFetchLichTrinhCongViec();
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

  const handleXemNhanVien = (item) => {
    var result = item;
    result = result
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Loại bỏ dấu cách
    result = result.replace(/\s/g, "");
    setTenNhanVien(item);
    setPathTenNhanVien(result)
    navigate(`/admin/nhanvien/${result}`);
  }

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

        const existingProductRef = db.collection("NhanVien").where('createdAt', '==', selectedProductForEdit.createdAt).limit(1);

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

  return (
    <>
      <div className='AllLichTrinh'>
        <Button className='btnAddProductCate' onClick={addProduct}><span>Thêm nhân viên</span></Button>
        <Modal
          title='Thêm nhân viên'
          visible={isAddProductVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
              Đồng ý
            </Button>,
          ]}
        >
          <Form form={form} layout='vertical'>
            {/* Form fields */}
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
              <Input className="inputWidth" placeholder='Nhập giới tính' required />
            </Form.Item>
            <Form.Item
              label='Url ảnh'
              name='url'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập url ảnh!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập url' required />
            </Form.Item>
            <Form.Item
              label='Giới tính'
              name='gioiTinh'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giới tính!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập giới tính' required />
            </Form.Item>
            <Form.Item
              label='Ngày sinh'
              name='ngaySinh'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập ngày sinh!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập ngày sinh' required />
            </Form.Item>
            <Form.Item
              label='Số điện thoại'
              name='sdt'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập số điện thoại' required />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Email!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập Email' required />
            </Form.Item>
            <Form.Item
              label='Địa chỉ'
              name='diaChi'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập địa chỉ' required />
            </Form.Item>
            <Form.Item
              label='Vị trí làm việc'
              name='viTriLamViec'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vị trí làm việc!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập vị trí làm việc' required />
            </Form.Item><Form.Item
              label='Chuyên môn'
              name='chuyenMon'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập chuyên môn!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập chuyên môn' required />
            </Form.Item>
            <Form.Item
              label='Kinh nghiệm'
              name='kinhNghiem'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập kinh nghiệm!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập kinh nghiệm' required />
            </Form.Item>
            <Form.Item
              label='Hồ sơ thuế'
              name='hoSoThue'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập hồ sơ thuế!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập hồ sơ thuế' required />
            </Form.Item>
            <Form.Item
              label='Số bảo hiểm xã hội'
              name='baoHiemXaHoi'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số bảo hiểm xã hội!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập số bảo hiểm xã hội' required />
            </Form.Item>
            <Form.Item
              label='Tài khoản'
              name='taiKhoan'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tài khoản!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập tài khoản' required />
            </Form.Item>
            <Form.Item
              label='Mật khẩu'
              name='matKhau'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input className="inputWidth" placeholder='Nhập mật khẩu' required />
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
                <Modal
                  title='Sửa thông tin hàng'
                  visible={isEditModalOpen}
                  onOk={handleOkEdit}
                  onCancel={handleCancelEdit}
                >
                  <Form form={formSua} layout='vertical' initialValues={selectedProductForEdit}>
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
                      <Input className="inputWidth" placeholder='Nhập giới tính' required />
                    </Form.Item>
                    <Form.Item
                      label='Url ảnh'
                      name='url'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập url ảnh!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập url' required />
                    </Form.Item>
                    <Form.Item
                      label='Giới tính'
                      name='gioiTinh'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập giới tính!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập giới tính' required />
                    </Form.Item>
                    <Form.Item
                      label='Ngày sinh'
                      name='ngaySinh'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập ngày sinh!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập ngày sinh' required />
                    </Form.Item>
                    <Form.Item
                      label='Số điện thoại'
                      name='sdt'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập số điện thoại!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập số điện thoại' required />
                    </Form.Item>
                    <Form.Item
                      label='Email'
                      name='email'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập Email!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập Email' required />
                    </Form.Item>
                    <Form.Item
                      label='Địa chỉ'
                      name='diaChi'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập địa chỉ!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập địa chỉ' required />
                    </Form.Item>
                    <Form.Item
                      label='Vị trí làm việc'
                      name='viTriLamViec'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập vị trí làm việc!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập vị trí làm việc' required />
                    </Form.Item><Form.Item
                      label='Chuyên môn'
                      name='chuyenMon'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập chuyên môn!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập chuyên môn' required />
                    </Form.Item>
                    <Form.Item
                      label='Kinh nghiệm'
                      name='kinhNghiem'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập kinh nghiệm!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập kinh nghiệm' required />
                    </Form.Item>
                    <Form.Item
                      label='Hồ sơ thuế'
                      name='hoSoThue'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập hồ sơ thuế!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập hồ sơ thuế' required />
                    </Form.Item>
                    <Form.Item
                      label='Số bảo hiểm xã hội'
                      name='baoHiemXaHoi'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập số bảo hiểm xã hội!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập số bảo hiểm xã hội' required />
                    </Form.Item>
                    <Form.Item
                      label='Tài khoản'
                      name='taiKhoan'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập tài khoản!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập tài khoản' required />
                    </Form.Item>
                    <Form.Item
                      label='Mật khẩu'
                      name='matKhau'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập mật khẩu!',
                        },
                      ]}
                    >
                      <Input className="inputWidth" placeholder='Nhập mật khẩu' required />
                    </Form.Item>
                  </Form>
                </Modal>
                {item.HoTenNhanVien &&
                  <div className='border'>
                    <div className='nhanVien__admin'>
                      {item.HoTenNhanVien && (
                        <div >
                          <h3>{item.HoTenNhanVien}</h3>
                          <Button type="primary" className=' btn' onClick={() => handleXemNhanVien(item.HoTenNhanVien)}>Xem chi tiết</Button>
                          <Button type="primary" className=' btn backgr' onClick={() => handleEditDoc(item)}>Sửa</Button>
                          <Button type="primary" danger className='none btn' onClick={() => handleDeleteDoc(item)}>Xóa</Button>
                        </div>
                      )}
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

export default QuanLyNhanVien;