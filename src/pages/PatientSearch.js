// PatientSearch.js
import React, { useEffect, useState } from "react";
import {
 
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaEye,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Eğer useLocation kullanılmıyorsa sadece useNavigate kalsın
//import "./PatientSearch.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PatientSearch = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const navigate = useNavigate();

  // ... (useEffect fetchPatients ve filterPatients aynı kalır) ...
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/Patient`);
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Hastalar alınırken bir hata oluştu: ${response.status} - ${errorData || response.statusText}`);
        }
        const data = await response.json();
        const validPatients = Array.isArray(data) ? data : [];
        setPatients(validPatients);
        setFilteredPatients(validPatients);
      } catch (error) {
        console.error("Fetch patients error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = patients.filter((patient) =>
      patient.name?.toLowerCase().includes(lowerSearchTerm) ||
      patient.patientID?.toString().includes(searchTerm)
    );
    setFilteredPatients(filtered);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  }, [searchTerm, patients]);


  const indexOfLastPatient = currentPage * recordsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - recordsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const handleView = (patientId) => navigate(`/view-patient/${patientId}`);

  const handleDelete = async (patientId) => {
    const patientToDelete = patients.find(p => p.patientID === patientId);
    if (window.confirm(`"${patientToDelete?.name || 'Bu hasta'}" adlı hastayı silmek istediğinize emin misiniz?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Patient/${patientId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Hasta silinirken bir hata oluştu: ${response.status} - ${errorData || response.statusText}`);
        }
        // Silme sonrası filteredPatients'ı da güncellemek önemli
        const updatedPatients = patients.filter((patient) => patient.patientID !== patientId);
        setPatients(updatedPatients);
        // setFilteredPatients(updatedFilteredPatients); // Bu satır yerine, searchTerm ve patients useEffect'i zaten filteredPatients'ı güncelleyecektir.

        // Eğer silinen kayıt son sayfadaki tek kayıtsa ve sayfa sayısı azalıyorsa,
        // mevcut sayfayı bir azaltmak gerekebilir.
        const newTotalPages = Math.ceil((filteredPatients.length - 1) / recordsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
            setCurrentPage(1); // Hiç kayıt kalmazsa
        }


        alert("Hasta başarıyla silindi.");
      } catch (error) {
        console.error("Delete patient error:", error);
        setError(error.message);
        alert(`Hata: ${error.message}`);
      }
    }
  };

  const totalPages = Math.ceil(filteredPatients.length / recordsPerPage);

  // Sayfa değiştirme fonksiyonları
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  useEffect(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        html, body {
          display: flex;
          height: 100%;
          margin: 40px auto;
          padding: 30px;
          background-color:  #ecf0f1;
          font-family: sans-serif;
        }

        .patient-search-container {
          padding: 20px;
          background-color: #ecf0f1;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          max-width: 1200px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .patient-search-container h2 {
          text-align: center;
          color: #333;
          margin-bottom: 25px;
          font-size: 1.8em;
        }

        .controls-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #ecf0f1;
          border-radius: 6px;
        }

        .search-input {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1em;
          width: 40%;
          transition: border-color 0.2s ease-in-out;
        }

        .search-input:focus {
          border-color: #d7e9ff;
          outline: none;
        }

        .records-per-page-selector {
          display: flex;
          align-items: center;
        }

        .records-per-page-selector label {
          margin-right: 8px;
          font-size: 0.9em;
          color: #555;
        }

        .records-per-page-selector select {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .patients-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background-color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .patients-table th, .patients-table td {
          border: 1px solid #e0e0e0;
          padding: 12px 15px;
          text-align: left;
          font-size: 0.95em;
        }

        .patients-table th {
          background-color: #7ba9db;
          color: white;
          font-weight: 600;
        }

        .patients-table tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .patients-table tbody tr:hover {
          background-color: #e9ecef;
        }

        .loading-text, .error-text, .no-records-text {
          text-align: center;
          padding: 20px;
          font-size: 1.1em;
        }

        .error-text {
          color: #d9534f;
          background-color: #f2dede;
          border: 1px solid #ebccd1;
          border-radius: 4px;
        }

        .no-records-text {
          color: #777;
        }

        .action-button-group {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85em;
          font-weight: 500;
          transition: background-color 0.2s ease-in-out, transform 0.1s ease;
          text-decoration: none;
          color: white;
        }

        .action-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .action-button:active {
          transform: translateY(0px);
        }

        .view-button {
          background-color: #5bc0de;
        }

        .view-button:hover {
          background-color: #31b0d5;
        }

        .delete-button {
          background-color: #d9534f;
        }

        .delete-button:hover {
          background-color: #c9302c;
        }

        .pagination {
          display: flex;
          border: 2px solid red;
          padding: 20px;
          margin-top: 20px;
          background-color: yellow;
        }

        .pagination-button {
          border: 1px solid blue;
          padding: 10px;
          margin: 5px;
          color: black;
          font-size: 16px;
        }

        .page-info {
          border: 1px solid green;
          padding: 10px;
          color: black;
        }

        .back-button {
          position: absolute;
          top: 10px;
          left: 30px;
          background-color: #7ba9db;
          color: white;
          border: none;
          padding: 12px 10px;
          width: 100px;
          font-size: 15px;
          border-radius: 6px;
          cursor: pointer;
        }

        .back-button:hover,
        .back-button:focus,
        .back-button:active {
          background-color: #7ba9db;
          color: white;
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }, []);
  return (
     <div className="page-wrapper">
    <button className="back-button" onClick={() => navigate("/menu-page")}>
      ← Geri
    </button>
    <div className="patient-search-container">
      <h2>Hasta Kayıtları</h2>
      <div className="controls-container">
        <input
          type="text"
          placeholder="Hasta adına veya ID'ye göre ara"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <div className="records-per-page-selector">
          <label htmlFor="recordsPerPage">Sayfa Başına Kayıt: </label>
          <select
            id="recordsPerPage"
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(parseInt(e.target.value));
              setCurrentPage(1); // Sayfa başına kayıt değiştiğinde ilk sayfaya dön
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option> {/* Daha fazla seçenek eklenebilir */}
          </select>
        </div>
      </div>

      {loading && <p className="loading-text">Yükleniyor...</p>}
      {error && <p className="error-text">{error}</p>}
      
      {!loading && !error && (
        <>
          <table className="patients-table">
            {/* ... (thead ve tbody aynı kalır) ... */}
             <thead>
              <tr>
                <th>ID</th>
                <th>Hasta Adı</th>
                <th>Yaş</th>
                <th>Cinsiyet</th>
                <th>Yanık Nedeni</th>
                <th>Hastaneye Geliş</th>
                <th>Yanık Oluşma</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr key={patient.patientID}>
                    <td>{patient.patientID}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.burnCause || "N/A"}</td>
                    <td>{patient.hospitalArrivalDate ? new Date(patient.hospitalArrivalDate).toLocaleDateString('tr-TR') : "N/A"}</td>
                    <td>{patient.burnOccurrenceDate ? new Date(patient.burnOccurrenceDate).toLocaleDateString('tr-TR') : "N/A"}</td>
                    <td>
                      <div className="action-button-group">
                        <button 
                          className="action-button view-button"
                          onClick={() => handleView(patient.patientID)}
                          title="Görüntüle"
                        >
                          <FaEye /> <span className="button-text">Görüntüle</span>
                        </button>
                        <button 
                          className="action-button delete-button"
                          onClick={() => handleDelete(patient.patientID)}
                          title="Sil"
                        >
                          <FaTrashAlt /> <span className="button-text">Sil</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-records-text">
                    {searchTerm ? "Aramanızla eşleşen hasta bulunamadı." : "Gösterilecek hasta kaydı yok."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

       

          {/* GÜNCELLENMİŞ PAGINATION */}
          {filteredPatients.length > recordsPerPage && totalPages > 1 && ( // BU KOŞULU KONTROL EDİN!
            <div className="pagination">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                aria-label="İlk Sayfa"
                className="pagination-button"
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                aria-label="Önceki Sayfa"
                className="pagination-button"
              >
                <FaAngleLeft />
              </button>
              <span className="page-info">
                Sayfa {totalPages > 0 ? currentPage : 0} / {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                aria-label="Sonraki Sayfa"
                className="pagination-button"
              >
                <FaAngleRight />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                aria-label="Son Sayfa"
                className="pagination-button"
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default PatientSearch;