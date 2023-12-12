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

function LichHenStaff() {
  const { check, setCheck } =
    React.useContext(AuthContext);
  const [lichKham, setLichKham] = useState([]);

  const { user: { uid } } = useContext(AuthContext);
  const { tenHienThi, setTenHienThi } =
    React.useContext(AuthContext);

  const fetchTenNhanVien = () => {
    const data = db.collection("LichKham");
    data
      .get()
      .then((querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        const a = [];
        productsData.map((item) => {
          if (item.HoTenNhanVien == tenHienThi) {
            a.push(item);
            setLichKham(a)
          } else {
          }
        });
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
        <h2 className='tittle'>Tất cả lịch hẹn</h2>
        <div className='productsCate__admin'>
          <Row>
            {lichKham.map((item) => (
              <Col key={item.id} span="8">
                {item.HoTen && (
                  <div className='lich__admin__item'>
                    <div className='lich__admin__name'>
                      <h3>{item.HoTen}</h3>
                      <h3>{item.NgayDenKham}</h3>
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

export default LichHenStaff;