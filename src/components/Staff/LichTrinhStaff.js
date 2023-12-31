import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
// import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useAuth } from '../Context/AuthProvider';
import "./style.css"

const { Option } = Select;

function LichTrinhStaff() {
  const { check, setCheck } =
    React.useContext(AuthContext);
  const [lichKham, setLichKham] = useState([]);
  const { user: { uid } } = useContext(AuthContext);
  const { tenHienThi, setTenHienThi } =
    React.useContext(AuthContext);

  const fetchTenNhanVien = () => {
    const data = db.collection("LichTrinhCongViec");
    data
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
                {item.HoTenNhanVien && (
                  <div className='lich__admin__item'>
                    <div className='lich__admin__name'>
                      <h3>{item.HoTenNhanVien}</h3>
                      <h3>Tên công việc: {item.tenCongViec}</h3>
                      <h3>Ca làm việc: {item.caLamViec}</h3>
                      <h3>Ngày làm việc: {item.NgayLamViec}</h3>
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