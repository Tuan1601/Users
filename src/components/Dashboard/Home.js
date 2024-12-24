import React, { useEffect, useState } from 'react';
import { getDocuments } from '../../services/api'; // Sử dụng getDocuments đã sửa
import Sidebar from './Sidebar';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import axios from 'axios';
import '../../styles/dashboard.scss';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const documentsPerPage = 4; 

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getDocuments(); 
        setDocuments(data); 
        setFilteredDocuments(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy tài liệu:', error);
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []); 

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/documents/download/${id}`, {
        responseType: 'blob',
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `document-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Lỗi khi tải tài liệu:', error);
    }
  };

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    setSearchTerm(keyword);

    if (keyword.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter((doc) =>
        doc.title.toLowerCase().includes(keyword) || doc.description.toLowerCase().includes(keyword)
      );
      setFilteredDocuments(filtered);
    }
    setCurrentPage(1); 
  };

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Đang tải tài liệu...</div>;
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <h1>Trang chủ</h1>
        <h2>Danh sách tài liệu</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {selectedDocument ? (
          <div className="document-viewer">
            <h3>{selectedDocument.title}</h3>
            <Document
              file={`http://localhost:3000/uploads/${selectedDocument.file_name}`}
              onLoadError={(error) => console.error('Error while loading document:', error)}
            >
              <Page pageNumber={1} />
            </Document>
            <button onClick={() => setSelectedDocument(null)}>Quay lại</button>
          </div>
        ) : (
          <>
            <ul>
              {currentDocuments.length > 0 ? (
                currentDocuments.map((doc) => (
                  <li key={doc.id}>
                    <h3>{doc.title}</h3>
                    <p>{doc.description}</p>
                    <button onClick={() => handleDownload(doc.id)}>Tải về</button>
                    <button onClick={() => handleDocumentClick(doc)}>Xem trước</button>
                  </li>
                ))
              ) : (
                <p>Không có tài liệu nào phù hợp.</p>
              )}
            </ul>
            <div className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
