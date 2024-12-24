import React, { useEffect, useState } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import axios from 'axios';
import '../../styles/profile.scss';


const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const { data } = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setProfile(data.user);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Token is expired or invalid. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login'; 
        } else {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className="profile">
      <Sidebar />
      <div className="main-content">
        <h1>Thông tin cá nhân</h1>
        {profile && (
          <div className="profile-info">
            <p><strong>Tên:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Vai trò:</strong> {profile.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
