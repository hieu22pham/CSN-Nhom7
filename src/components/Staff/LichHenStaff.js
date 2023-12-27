import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Badge, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./style.css"
import { AuthContext } from '../Context/AuthProvider';
import { useAuth } from '../Context/AuthProvider';
const { Option } = Select;

function LichHenStaff() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCapNhatOpen, setIsModalCapNhatOpen] = useState(false);
  const [form] = Form.useForm();

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [trangThai, setTrangThai] = useState("");

  const { check, setCheck } =
    React.useContext(AuthContext);
  const [lichKham, setLichKham] = useState([]);

  const { user: { uid } } = useContext(AuthContext);
  const { tenHienThi, setTenHienThi } =
    React.useContext(AuthContext);

  const fetchTenNhanVien = () => {
    const data = db.collection("LichHenDaPhanCong");
    data
      .get()
      .then((querySnapshot) => {
        const batch = db.batch();

        const productsData = querySnapshot.docs.map((doc) => doc.data());
        const a = [];
        productsData.map((item) => {
          if (item.HoTenNhanVien == tenHienThi) {
            a.push(item);
            setLichKham(a)
          } else {
          }
        });

        querySnapshot.forEach((doc) => {
          const item = doc.data();
          if (item.HoTenNhanVien === tenHienThi) {
            var ngayDenKhamArray = item.NgayDenKham.split("-");
            var ngayDenKham = new Date(
              ngayDenKhamArray[2],
              ngayDenKhamArray[1] - 1,
              ngayDenKhamArray[0]
            );

            var ngayHienTai = new Date();
            if (item.trangThaiCuocHen !== "Hoàn thành" && !item.trangThaiCuocHen) {
              if (ngayDenKham < ngayHienTai) {
                batch.update(data.doc(doc.id), { trangThaiCuocHen: "Quá hẹn" });
              } else if (ngayDenKham > ngayHienTai) {
                batch.update(data.doc(doc.id), { trangThaiCuocHen: "Đang chờ" });
              }
            }
          }
        });

        return batch.commit();
      })
      .then(() => {
        console.log("Cập nhật thành công");
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchTaiKhoanNhanVien = useMemo(() => fetchTenNhanVien, [lichKham || check]);

  useEffect(() => {
    memoizedFetchTaiKhoanNhanVien();
  }, [lichKham.length]);

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Vui lòng chọn ngày!',
      },
    ],
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
    memoizedFetchTaiKhoanNhanVien();
  };


  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
  };

  const handleCapNhatDoc = (item) => {
    setIsModalCapNhatOpen(true);
    setSelectedProduct(item);
  }

  const handleOkCapNhat = () => {
    setLoading(true);
    const batch = db.batch();

    const newProductData = {
      ...form.getFieldsValue(),
    };

    const updatedProductData = {
      ...selectedProduct,
      trangThaiCuocHen: newProductData.trangThaiCuocHen
    }

    const existingProductRef = db.collection("LichHenDaPhanCong").where('createdAt', '==', selectedProduct.createdAt).limit(1);

    existingProductRef.get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          if (firstDoc) {
            const existingProduct = firstDoc.data();

            firstDoc.ref.update(updatedProductData)
              .then(() => {
                console.log("Document successfully updated!");
                memoizedFetchTaiKhoanNhanVien();
                setIsModalCapNhatOpen(false);
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

    setLoading(false);
    setIsModalOpen(false);
    form.resetFields();
    memoizedFetchTaiKhoanNhanVien();
  }

  const handleCancelCapNhat = () => {
    setIsModalCapNhatOpen(false);
  }

  return (
    <>
      <div className='AllLichTrinh'>
        <h2 className='tittle'>Tất cả lịch hẹn</h2>
        <div className='danhSachLichHen__admin'>

          <Row>
            {lichKham.map((item) => (
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
                  title="Thông báo!"
                  onOk={() => handleOkCapNhat(item.createdAt)}
                  onCancel={handleCancelCapNhat}
                  visible={isModalCapNhatOpen}
                  confirmLoading={loading}
                  footer={[
                    <Button key="back" onClick={handleCancelCapNhat}>
                      Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOkCapNhat}>
                      Đồng ý
                    </Button>,
                  ]}
                >
                  <Space wrap>
                    <Form form={form} layout='vertical'>

                      <Form.Item
                        label='Trạng thái'
                        name='trangThaiCuocHen'
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn trạng thái!',
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
                          options={[
                            { value: 'Hoàn thành', label: 'Hoàn thành' },
                          ]}
                        />
                      </Form.Item>
                    </Form>
                  </Space>
                </Modal>
                {
                  item.HoTen && (
                    <div className='lich__admin__item1'>
                      <Badge.Ribbon className='badge'
                        text={`${item.trangThaiCuocHen}`}
                        color="red"
                      >
                        <div className='lich__admin__name1'>
                          {/* <h3>Trạng thái: {item.trangThaiCuocHen}</h3> */}
                          <h3>Họ tên: {item.HoTen}</h3>
                          <h3>Giới tính: {item.GioiTinh}</h3>
                          <h3>Ngày sinh: {item.NgaySinh}</h3>
                          <h3>Ngày sinh: {item.SoDienThoai}</h3>
                          <h3>Thời gian khám: {item.ThoiGianKham}</h3>
                          <h3>Ngày đến khám: {item.NgayDenKham}</h3>
                          <h3>Tình trạng bệnh: {item.TinhTrangBenh}</h3>
                        </div>
                        <Button type="primary" className='btn_PhanCong2' onClick={() => handleCapNhatDoc(item)}>Cập nhật trạng thái</Button>
                        {/* <button className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</button> */}
                      </Badge.Ribbon>
                    </div>


                  )
                }

              </Col>
            ))}
          </Row>
        </div>
      </div >
    </>
  )
}

export default LichHenStaff;