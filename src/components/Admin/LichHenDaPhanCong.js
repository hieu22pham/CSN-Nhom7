import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../firebase/config";
import { Row, Col, Button } from "antd";
import "./QuanLyLichTrinh.css"
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from 'react-router-dom';

function LichHenDaPhanCong() {
  const navigate = useNavigate([])
  const { pathTenNhanVien2, setPathTenNhanVien2, setTenNhanVien } =
    React.useContext(AuthContext);
  const [danhSachNhanVien, setDanhSachNhanVien] = useState([]);

  const fetchDanhSachNhanVienCoLichTrinh = () => {
    const dsLichTrinh = db.collection("LichHenDaPhanCong");
    dsLichTrinh
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());

        const a = [];
        data.forEach((item) => {
          if (item.HoTenNhanVien && !a.includes(item.HoTenNhanVien)) {
            a.push(item.HoTenNhanVien);
          }
        })

        setDanhSachNhanVien(a);
        console.log(danhSachNhanVien);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  };

  const memoizedFetchDanhSachNhanVienCoLichTrinh = useMemo(() => fetchDanhSachNhanVienCoLichTrinh, [danhSachNhanVien]);
  useEffect(() => {
    memoizedFetchDanhSachNhanVienCoLichTrinh();
  }, [danhSachNhanVien.length]);

  const handleXemNhanVien = (item) => {
    var result = item;

    setTenNhanVien(result)
    result = result
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Loại bỏ dấu cách
    result = result.replace(/\s/g, "");
    setPathTenNhanVien2(result)
    navigate(`/admin/LichHen/DaPhanCong/${result}`);
  }

  return (
    <>
      <div className='AllLichTrinh'>
        <h2 className='tittle'>Danh sách nhân viên:</h2>
        <div className='danhSachLichHen__admin'>
          <Row>
            {danhSachNhanVien.map((item) => (
              <Col key={item} span="8">
                <div className='border'>
                  <div className='nhanVien__admin'>
                    {
                      item && (
                        <div>
                          <h3>{item}</h3>
                          <Button type="primary" onClick={() => handleXemNhanVien(item)}>Xem chi tiết</Button>
                          {/* <button className='btn_delete' onClick={() => handleDeleteDoc(item)}>Xóa</button>  */}
                        </div>
                      )
                    }
                  </div>
                </div>

              </Col>
            ))}
          </Row>
        </div>
      </div >
    </>
  )
}

export default LichHenDaPhanCong;