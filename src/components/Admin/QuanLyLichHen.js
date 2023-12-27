import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import dayjs from 'dayjs';

const { Option } = Select;

const options = [];

for (let i = 8; i <= 17; i++) {
  if (i != 12) {
    options.push({
      value: i + " giờ",
      label: i + " giờ",
    });
  }
}

function QuanLyLichHen() {
  const [dateData, setDateData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState({});
  const [formSua] = Form.useForm();

  const [form] = Form.useForm();
  const [danhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const { lichKham, setlichKham, check, setCheck } =
    React.useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPhanCongOpen, setIsModalPhanCongOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLichHen, setSelectedLichHen] = useState([]);
  const [selectedPhanCong, setSelectedPhanCong] = useState([]);

  const [danhSachLichHen, setDanhSachLichHen] = useState([]);
  const { user: { uid } } = useContext(AuthContext);

  const fetchLichKhamData = () => {
    const dsLichKham = db.collection("LichKham");
    dsLichKham
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setDanhSachLichHen(data);

        // const a = [];
        // danhSachLichHen.map((item) => {
        //   if (!a.includes(item.HoTenNhanVien)) {
        //     a.push(item.HoTenNhanVien);
        //   }
        // })
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };


  const fetchDanhSachNhanVienCoLichTrinh = () => {
    const dsLichTrinh = db.collection("LichTrinhCongViec");
    dsLichTrinh
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());

        const a = [];
        data.forEach((item) => {
          // if (selectedPhanCong.NgayDenKham == item.NgayLamViec) {
          //   a.push(item);
          //   console.log("PC:" + item.NgayLamViec);
          //   console.log("Ngay kham: " + `${selectedPhanCong.NgayDenKham}`)
          // } else {
          //   console.log("PC NO:" + item.NgayLamViec);
          //   console.log("Ngay kham: " + `${selectedPhanCong.NgayDenKham}`)
          // }

          a.push(item)
        })

        setDanhSachNhanVien(a);
        console.log("danh sach: " + danhSachNhanVien);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchLichKhamData = useMemo(() => fetchLichKhamData, [danhSachLichHen]);
  const memoizedFetchDanhSachNhanVienCoLichTrinh = useMemo(() => fetchDanhSachNhanVienCoLichTrinh, [danhSachNhanVien] || [selectedPhanCong]);

  useEffect(() => {
    memoizedFetchLichKhamData();
    memoizedFetchDanhSachNhanVienCoLichTrinh();
  }, [lichKham.length || selectedPhanCong || danhSachLichHen.length || danhSachNhanVien.length]);

  const handleDeleteDoc = (item) => {
    setIsModalOpen(true);
    setSelectedLichHen(item);
  };

  const handleOkDelete = () => {
    setLoading(true);
    const batch = db.batch();

    deleteDocument("LichKham", selectedLichHen.createdAt);
    setLoading(false);
    setIsModalOpen(false);
    memoizedFetchLichKhamData();
  };


  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  // 
  const handlePhanCongDoc = (item) => {
    setIsModalPhanCongOpen(true);
    setSelectedPhanCong(item);
    console.log("phan cong: " + selectedPhanCong.NgayDenKham)
  };

  const handleOkPhanCong = () => {
    setLoading(true);
    const batch = db.batch();

    const newProductData = {
      ...form.getFieldsValue(),
    };

    const phanCong = {
      ...selectedPhanCong,
      HoTenNhanVien: newProductData.HoTenNhanVien
    }

    deleteDocument("LichKham", selectedPhanCong.createdAt);
    addDocument("LichHenDaPhanCong", phanCong);
    form.resetFields();
    setLoading(false);
    setIsModalPhanCongOpen(false);
    memoizedFetchDanhSachNhanVienCoLichTrinh();
  };


  const handleCancelPhanCong = () => {
    setIsModalPhanCongOpen(false);
  };

  const handleChange = (value) => {
  };

  // sửa
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

        const existingProductRef = db.collection("LichKham").where('createdAt', '==', selectedProductForEdit.createdAt).limit(1);

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
                    memoizedFetchLichKhamData();
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
        <h2 className='tittle'>Tất cả lịch hẹn</h2>
        <div className='danhSachLichHen__admin'>
          <Row>
            {danhSachLichHen.map((item) => (
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
                  title="Thông báo phân công!"
                  onOk={() => handleOkPhanCong(item.createdAt)}
                  onCancel={handleCancelPhanCong}
                  visible={isModalPhanCongOpen}
                  confirmLoading={loading}
                  footer={[
                    <Button key="back" onClick={handleCancelPhanCong}>
                      Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOkPhanCong}>
                      Đồng ý
                    </Button>,
                  ]}
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
                          {danhSachNhanVien.map((item) => (
                            item.HoTenNhanVien && (selectedPhanCong.NgayDenKham == item.NgayLamViec)
                            && (
                              <Option key={item.HoTenNhanVien} value={item.HoTenNhanVien}>
                                {item.title}
                              </Option>
                            )
                          ))}
                        </Select>

                      </Form.Item>
                    </Space>
                  </Form>
                </Modal>

                <Modal
                  title='Sửa thông tin hàng'
                  open={isEditModalOpen}
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
                {item.HoTen && (
                  <div className='lich__admin__item1'>
                    <div className='lich__admin__name1'>
                      <h3>Họ tên: {item.HoTen}</h3>
                      <h3>Giới tính: {item.GioiTinh}</h3>
                      <h3>Ngày sinh: {item.NgaySinh}</h3>
                      <h3>Ngày sinh: {item.SoDienThoai}</h3>
                      <h3>Thời gian khám: {item.ThoiGianKham}</h3>
                      <h3>Ngày đến khám: {item.NgayDenKham}</h3>
                      <h3>Tình trạng bệnh: {item.TinhTrangBenh}</h3>
                    </div>
                    <Button className='btn_phanCong' onClick={() => handlePhanCongDoc(item)}>Phân công</Button>
                    <Button className='btn_Sua' onClick={() => handleEditDoc(item)}>Sửa</Button>
                    <Button type="primary" danger className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</Button>
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

export default QuanLyLichHen;