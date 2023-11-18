import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Space, Button, Avatar, Menu, Dropdown } from 'antd';
import "./styles.css"

export default function Home() {
  const navigate = useNavigate([]);

  const handleHome = () => {
    navigate("/");
  }

  const handleDatLichKham = () => {
    navigate("/DatLichKham");
  }

  return (
    <div>
      <header className='header'>
        <div className='header-top'>
          <p >ĐC: Số 10 đường Phạm Hùng, Cầu Giấy, Hà Nội | ĐT : 0987654321</p>
        </div>
        <div className='header-main'>
          <div className='menu'>
            <ul>
              <li onClick={handleHome}>Trang chủ</li>
              <li onClick={handleDatLichKham}>Đặt lịch khám</li>
            </ul>
          </div>
        </div>
      </header>

      <Row>
        <Col span={24}>
          <Outlet />
        </Col>
      </Row>
    </div >
  );

}