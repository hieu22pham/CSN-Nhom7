import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
// import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useAuth } from '../Context/AuthProvider';
const { Option } = Select;

function LichTrinhStaff() {
  const { check, setCheck } =
    React.useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [lichKham, setLichKham] = useState([]);

  const [productsCate, setProductsCate] = useState([]);
  const [DanhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [form] = Form.useForm();
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const { user: { uid } } = useContext(AuthContext);
  const { tenHienThi, setTenHienThi } =
    React.useContext(AuthContext);

  const fetchTenNhanVien = () => {
    const messagesRef = db.collection("LichTrinhCongViec");
    messagesRef
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        const a = [];
        productsData.map((item) => {
          if (item.HoTenNhanVien == tenHienThi) {
            a.push(item);
            setLichKham(a)
            console.log(lichKham)
          } else {
            // navigate("/");
            console.log(tenHienThi)
          }
        });
        console.log(lichKham);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchTaiKhoanNhanVien = useMemo(() => fetchTenNhanVien, [lichKham || check]);

  useEffect(() => {
    memoizedFetchTaiKhoanNhanVien();
  }, [lichKham.length]);

  // const handleDeleteDoc = (item) => {
  //   setIsModalOpen(true);
  //   setSelectedProduct(item);
  // };

  // const handleOkDelete = () => {
  //   setLoading(true);
  //   const batch = db.batch();

  //   deleteDocument("LichKham", selectedProduct.createdAt);
  //   // const categoryRef = db.collection(cate.category).doc(selectedProduct.createdAt);
  //   // batch.delete(categoryRef);

  //   // const productsRef = db.collection("products").doc(selectedProduct.createdAt);
  //   // batch.delete(productsRef);
  //   setLoading(false);
  //   setIsModalOpen(false);
  //   memoizedFetchTaiKhoanNhanVien();
  // };


  // const handleCancelDelete = () => {
  //   setIsModalOpen(false);
  // };

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
        <h2 className='tittle'>Tất cả lịch trình</h2>
        <div className='productsCate__admin'>
          <Row>
            {lichKham.map((item) => (
              <Col key={item.id} span="8">
                {/* <Modal
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
                ></Modal> */}
                {item.HoTenNhanVien && (
                  <div className='productsCate__admin__item'>
                    <div className='productsCate__admin_name'>
                      <h3>{item.HoTenNhanVien}</h3>
                      <h3>{item.NgayLamViec}</h3>
                    </div>
                    {/* <button className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</button> */}
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

export default LichTrinhStaff;