import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//import "./MenuPage.css";
import { FaUserCircle } from "react-icons/fa";
import api from "../api/axiosConfig";

const MenuPage = () => {
  const [doctorName, setDoctorName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
    navigate = ("/");
    return;
    }


    api
      .get("api/doctor/name", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDoctorName(response.data.name);
      })
      .catch((error) => {
      console.error("Doktor adı alınamadı:", error);
            // Token geçersiz veya başka hata varsa temizle ve login'e yönlendir
      localStorage.removeItem("token");
      localStorage.removeItem("isDoctorLoggedIn");
      navigate = ("/");
      });
  }, [navigate]);

    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);
  
    const handleLogout = (role) => {
      localStorage.removeItem("token");
      if (role === "admin") {
        setIsAdminLoggedIn(false);
        localStorage.setItem("isAdminLoggedIn", "false");
        navigate("/login/admin");
      } else {
        setIsDoctorLoggedIn(false);
        localStorage.setItem("isDoctorLoggedIn", "false");
        navigate("/login/doctor");
      }
    };
 useEffect(() => {
     if (!document.getElementById("menu-page-style")) {
       const style = document.createElement("style");
       style.id = "menu-page-style";
       style.innerHTML = `
      .menu-page-container {
        display: flex;
        height: 100vh;
        background-color: #ecf0f1; /* sağ alan*/
        font-family: Arial, sans-serif;
        position: relative;
      }

      .sidebar {
        width: 220px;
        background-color: #E0E0E0; /*menu*/
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        padding-top: 30px;
        box-sizing: border-box;
      }

      .menu {
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-left: 20px;
      }

      .menu-item {
        color: black;
        font-size: 18px;
        text-decoration: none;
        padding: 12px 0;
        cursor: pointer;
        border-left: 4px solid transparent;
        transition: border-color 0.3s ease, background-color 0.3s ease;
      }

      .divider {
        border: none;
        height: 1px;
        background-color:black;; /* Açık mavi çizgi */
        margin: 0 20px 0 20px;
      }

      .menu-item:hover {
        border-left: 4px solid #7ba9db; /* Hoverda mavi çizgi vurgusu */
        background-color: #BDBDBD;
      }

      .content {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .welcome-box {
        position: absolute;
        top: 50px;
        left: 250px;
        background-color: #CFD8DC; /* hoşgeldiniz*/
        padding: 10px 60px;
        border-radius: 8px;
        color: black;
        text-align: absolute;
        font-size: 30px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        user-select: none;
        border: 0px solid ;
      }
        
      .info-box {
        position: absolute;
        top: 150px;
        left: 250px;
        padding: 5px 10px;
        background-color: #ecf0f1;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        border-radius: 5px;   
        font-size: 12px;
        color: black;
        text-align: left; /* Yazıyı sola hizalar */

      }  

      /* Profil kısmı sağ üst */
      .profile-section {
        position: absolute;
        top: 20px;
        right: 20px;
        color: white;
        cursor: pointer;
      }

      .profile-icon {
        font-size: 36px;
        color: #7ba9db;
      }

      .dropdown-menu {
        position: absolute;
        top: 40px;
        right: 0;
        background-color: white;
        border: 1px solid #7ba9db;
        border-radius: 6px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
        z-index: 999;
        padding: 10px;
        min-width: 160px;
      }

      .dropdown-item {
        padding: 8px 12px;
        color: #1976D2;
        font-weight: bold;
      }

      .doctor-name {
        font-size: 16px;
        margin-left: 8px;
        color: black;
      }
      .logout-button {
        position: absolute;
        top: 70px;
        right: 10px;
        background-color: #f44336;
        color: white;
        width: 80px;
        height: 50px;
        padding: 5px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        border-radius: 5px;
      }

      .logout-button:hover {
        background-color: #e53935; /* Red tone on hover */
      }

            `;
            document.head.appendChild(style);
          }
   }, []);

  return (
    <div className="menu-page-container">
        <button className="logout-button" onClick={() => handleLogout("doctor")}>
         Çıkış Yap
        </button>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="menu">
          <Link to="/add-patient" className="menu-item">Hasta Yanık Ekleme Formu</Link>
          <hr className="divider" />
          <Link to="/patient-records" className="menu-item">Hasta Kayıtları</Link>
          <hr className="divider" />
          <Link to="/doctor-forum" className="menu-item">Doktor Forumu</Link>
          <hr className="divider" />
          <Link to="/notifications" className="menu-item">Bildirimler</Link>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <div className="welcome-box">Yanık Ön Tanı ve Karar Destek Platformu</div>
        <div className="info-box">
          {/* Buraya istediğin metni yazabilirsin */}
          <p> SİSTEMİ NASIL KULLANIRIM?</p>
          <p>💻 Yapay Zekâ ile Yanık Analizi</p>
          <p>Hastalarınıza ait yanık fotoğraflarını sisteme yükleyin.
            Sistem, bu görselleri yapay zekâ yardımıyla analiz eder ve yanığın derinliğini belirler ve yüzey alanını 
            hesaplar. Bu sayede hızlı ve etkili bir değerlendirme yapabilirsiniz. 
            Bunun için sayfanın solunda, menüde bulunan  "Hasta Yanık Ekleme Formu" sayfasında bulunan formu kullanmalısınız.
            Formdaki bilgileri eksiksiz doldurduktan sonra sayfanın altındaki "Kaydet" butona basarak bilgileri sisteme yüklemelisiniz.
            Hasta bilgilerini form aracılığıyla başarılı bir şekilde sisteme yükledikten sonra yapay zeka 
            sonuçlarına ulaşabilmek için "Hasta Kayıtları" sayfasında ilgili hastanın kaydının yanında bulunan 
            "görüntüle" butonuna bastıktan sonra karşınıza çıkan sayfadaki
            "Yapay Zekaya Danış" butonuna basmanız gerekmektedir. Karşınıza çıkan sayfada "Yapay Zekaya Sor" butonuna
            bastıktan sonra yapay zeka sonuçlarına ulaşabilirsiniz. Dilerseniz "Onaylıyorum" butonuna basarak 
            sonuçların doğruluğuna onay vererek Yapay zeka modelimizin gelişimine katkı sağlayabilirniz.</p>
            <p>📝Hasta Kaydı</p>
            <p>Yanık fotoğrafını yüklediğiniz tüm hastaların bilgileri, sistemde kayıt altında tutulur.
            Bununla birlikte, bir hastanın her gelişi için sistem üzerinden ayrı bir ziyaret kaydı oluşturabilirsiniz.
            Bu sayede hastanın tüm süreçlerini adım adım takip edebilir, geçmişe yönelik bilgilere kolayca ulaşabilirsiniz.
            Sayfanın solunda, menüde bulunan "Hasta Kayıtları" sayfasında ilgili hastanın kaydınının yanında bulunan 
            "görüntüle" butonuna bastığınızda çıkacak sayfada "+" butonuna bastığınızda karşınıza çıkan formu eksiksiz doldurduktan sonra 
            "Kaydet" butona basarak hastaya özel ziyaret kaydı oluşturabilirsiniz.</p> 
            <p>💬 Doktor Forumu</p>
            <p>Bu alan, diğer doktorlarla fikir alışverişi yapabileceğiniz bir ortamdır.
             Hastaların yanık görselleri üzerinde yazılı ya da sesli yorumlar yapabilirsiniz.
             Görüşlerinizi paylaşabilir, farklı vakalar üzerine tartışabilirsiniz.
             Buraya sayfanın solunda, menüde bulunan "Doktor Forumu" sayfasına giderek ulaşabilirsiniz. Bir yanık fotoğrafını
             doktor forumunda paylaşmak için "Hasta Kayıtları" sayfasında ilgili hastanın yanında yer alan
             "görüntüle" butona bastığınızda karşınıza çıkan sayfada bulunan "Forumda Paylaş" butonunu kullanmalısınız. Bu butona bastığınızda
             ilgili hastanın yanık görseli ve bilgileri forumda diğer doktorların yorumuna açık olarak paylaşılacaktır.</p>
            <p>Ekstra Bilgi: Forumdaki paylaşımlarınıza başka bir doktor yorum yaptığında sistem size bildirim gönderir. 
               Bu bildirimleri görmek için sayfanın solunda, menüde bununan "Bildirimler" sayfasına gitmelisiniz.</p>
            <p>⚙️ Hesap Ayarları</p>
            <p>Hesap ayarları sayfasından profil bilgilerinizi kolayca güncelleyebilirsiniz.
               Adınız, e-posta adresiniz gibi bilgileri düzenleyebilir, şifrenizi değiştirebilirsiniz.
               Bunun için adınızın solunda bulunan profil logosunun üzerine geldiğinizde 
               ortaya çıkan "Hesap Ayarları" sayfasına gitmelisiniz. </p>

            <p>⏰Randevu Hatırlatma Sistemi</p>
            <p>Hastalara belirli aralıklarla kontrole gelmeleri gerektiğinde sistem otomatik olarak e-posta gönderir.</p>

            <p>🔒 Verilerin Saklanması</p>
            <p>Sisteme kaydedilen hasta bilgileri ve görseller güvenli bir şekilde saklanır.
              Bu veriler yalnızca yetkili kullanıcılar tarafından görüntülenebilir.
              Her şey hem hasta mahremiyetine hem de veri güvenliğine uygun şekilde tasarlanmıştır.</p>


        </div>
      </div>


      {/* Profile */}
      {doctorName && (
        <div
          className="profile-section"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <FaUserCircle className="profile-icon" />
          <span className="doctor-name">{doctorName}</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/account-settings" className="dropdown-item">Hesap Ayarları</Link>
              </div>
           
          )}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
