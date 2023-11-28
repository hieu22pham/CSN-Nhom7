import React from 'react';
import { Row, Col } from 'antd';
import SidebarStaff from './SidebarStaff';
import { Outlet } from 'react-router-dom';
import { Route } from 'react-router-dom';

export default function Staff() {
  return (
    <div>

      <Row>
        <Col span={6}>
          <SidebarStaff />
        </Col>
        <Col span={18}>
          <Outlet />
        </Col>
      </Row>
    </div>
  );
}