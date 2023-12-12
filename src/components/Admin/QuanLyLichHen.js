import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Button, Form, Modal, Input, Image, Space, Select, DatePicker } from 'antd';
import { addDocument } from '../Service/AddDocument';
import { db } from '../../firebase/config';
import { Col, Row } from 'antd';
import { deleteDocument } from '../Service/AddDocument';
import "./QuanLyLichTrinh.css"
import { AuthContext } from '../Context/AuthProvider';
import { useAuth } from '../Context/AuthProvider';

function QuanLyLichHen() {
  const { lichKham, setlichKham, check, setCheck } =
    React.useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLichHen, setSelectedLichHen] = useState([]);

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


  const memoizedFetchLichKhamData = useMemo(() => fetchLichKhamData, [danhSachLichHen]);

  useEffect(() => {
    memoizedFetchLichKhamData();
  }, [lichKham.length || check]);

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
                {item.HoTen && (
                  <div className='lich__admin__item'>
                    <div className='lich__admin__name'>
                      <h3>{item.HoTen}</h3>
                      <h3>{item.NgayDenKham}</h3>
                    </div>
                    <button className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</button>
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