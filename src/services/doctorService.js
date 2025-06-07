import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
 // Backend API'nin temel URL'si
const FLASK_AI_URL = 'https://burn-flask-ai.onrender.com/'; // Flask AI API'nin Railway URL'si

// Flask AI servisinden tahmin al
export const sendImageToAI = async (imageFile, height, weight) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('height_cm', height);
    formData.append('weight_kg', weight);

    const response = await axios.post(FLASK_AI_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Flask AI tahmin hatası:", error);
    throw error;
  }
};

// Doktorları getirme
export const getDoctors = async () => {
  return await axios.get(`${API_BASE_URL}/doctor`);
};

// Doktorları status'e göre getirme
export const getDoctorsByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctor/status`, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors by status:", error);
    return [];
  }
};

// Doktor bilgilerini güncelleme
export const updateDoctor = async (doctorID, doctorData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/doctor/${doctorID}`, doctorData);
    console.log("Update Response:", response);

    if (response.status === 200 || response.status === 204) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Güncelleme başarısız!" };
    }
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, message: "Sunucu hatası!" };
  }
};

// Admin'e bağlı doktorları getir
export const getDoctorsByAdmin = async (adminId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctor/assigned/${adminId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors by admin:", error);
    return [];
  }
};

// Doktoru silme
export const deleteDoctor = async (doctorID) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/doctor/${doctorID}`);
    return response.status === 204
      ? { success: true }
      : { success: false, message: "Delete failed!" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Server error!" };
  }
};
