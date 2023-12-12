import React, { useEffect, useState } from 'react';
import { Avatar, Menu, Dropdown } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import {
  UnorderedListOutlined,
  InsertRowBelowOutlined,
  InsertRowAboveOutlined
} from "@ant-design/icons"
import { auth } from '../../firebase/config';
import { AuthContext } from '../Context/AuthProvider';

export default function SidebarAdmin() {
  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);

  const navigate = useNavigate([])

  const handleMenuClick = (e) => {
    if (e.key === 'profile') {
    } else if (e.key === 'settings') {
    } else if (e.key === 'logout') {
      handleLogout();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Thông tin cá nhân</Menu.Item>
      <Menu.Item key="settings">Cài đặt</Menu.Item>
      <Menu.Item key="logout">Đăng xuất</Menu.Item>
    </Menu>
  );

  const items = [
    {
      label: <Link to="/admin/user">Tài khoản nhân viên</Link>,
      icon: <UnorderedListOutlined />,
      key: "/admin/user",
    }, {
      label: <Link to="/admin/LichHen">Danh sách lịch hẹn</Link>,
      icon: <InsertRowBelowOutlined />,
      key: "/admin/LichHen",
    }, {
      label: <Link to="/admin/LichTrinh">Lịch trình công việc</Link>,
      icon: <InsertRowAboveOutlined />,
      key: "/admin/LichTrinh",
    },
  ];

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <div >
      <div className='accountAdmin__info'>
        <Dropdown overlay={menu} trigger={['click']}>
          <Avatar size="large" className='account__avatar' src="data:image/jpeg;base64,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">
            {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
      <div className='menuHome'>
        <Menu theme="light" mode="inline" items={items} defaultSelectedKeys={["/"]} defaultOpenKeys={["menu-1"]} />
      </div>
    </div >
  );
}