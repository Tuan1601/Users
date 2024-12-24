import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile } from '../../services/api'; // Đảm bảo API đúng
import '../../styles/dashboard.scss';
// import axios from 'axios';


const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const [profile, setProfile] = useState(null);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     // try {
  //       const token = localStorage.getItem('token'); // or get it from wherever you store the token
  //       const { data } = await axios.get('http://localhost:3000/api/auth/profile', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });
  //       setProfile(data.user);}
  //     // } catch (error) {
  // //     //   if (error.response && error.response.status === 401) {
  // //     //     alert('Token is expired or invalid. Please log in again.');
  // //     //     localStorage.removeItem('token');
  // //     //     window.location.href = '/login'; // Redirect to login page
  // //     //   } else {
  // //     //     console.error('Error fetching profile:', error);
  // //     //   }
  // //     // }
  // //   };
    
  //   fetchProfile();
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      getProfile()
        .then(response => {
          setUser(response.data); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Lỗi lấy thông tin người dùng:', error);
          setError('Không thể lấy thông tin người dùng');
          setLoading(false);
        });
    } else {
      setLoading(false); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setUser(null); // Xóa thông tin người dùng trong state
    navigate('/login'); // Chuyển hướng đến trang đăng nhập
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="sidebar">
      <div className="user-info">
        {user ? (
          <>
          <p>{user.username}</p>
            <button onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
      <nav>
        <Link to="/dashboard">Trang chủ</Link>
        {user && (
          <>
            <Link to="/profile">Trang cá nhân</Link>
            <Link to="/documents/upload">Thêm tài liệu</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
