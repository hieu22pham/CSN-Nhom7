import React from 'react';
import { Row, Col } from 'antd';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Route } from 'react-router-dom';

export default function Admin() {
  return (
    <div>

      <Row>
        <Col span={6}>
          <Sidebar />
        </Col>
        <Col span={18}>
          <Outlet />
        </Col>
      </Row>
    </div>
  );
}