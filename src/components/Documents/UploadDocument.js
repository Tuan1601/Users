import React, { useState, useEffect } from 'react';
import { uploadDocument, getAllSubjects } from '../../services/api';
import Sidebar from '../Dashboard/Sidebar';
import '../../styles/documents.scss';

const UploadDocument = () => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    subject_id: '',
    file: null,
  });
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách môn học:', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormState({ ...formState, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', formState.file);
    formData.append('title', formState.title);
    formData.append('description', formState.description);
    formData.append('subject_id', formState.subject_id);

    try {
      await uploadDocument(formData);
      setMessage('Tài liệu đã được tải lên thành công!');
      setFormState({ title: '', description: '', subject_id: '', file: null });
    } catch (error) {
      setMessage('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="documents">
      <Sidebar />
      <div className="main-content">
        <h1>Tải tài liệu mới</h1>
        <form onSubmit={handleSubmit}>
          <input
          className='title'
            type="text"
            name="title"
            placeholder="Tên tài liệu"
            value={formState.title}
            onChange={handleChange}
            required
          />
          <textarea
          className='dexcription'
            name="description"
            placeholder="Mô tả tài liệu"
            value={formState.description}
            onChange={handleChange}
            required
          />
          <select
          className='subject_id'
            name="subject_id"
            value={formState.subject_id}
            onChange={handleChange}
            required
          >
            <option value="">Chọn môn học</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <input className='file' type="file" onChange={handleFileChange} required />
          <button className='submit' type="submit">Tải lên</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default UploadDocument;
