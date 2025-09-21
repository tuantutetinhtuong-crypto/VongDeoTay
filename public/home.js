import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDol7-MQcpI9QRFTyzeWrDP1WyC4or8WE4",
  authDomain: "vongdeotay-84e31.firebaseapp.com",
  databaseURL: "https://vongdeotay-84e31-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vongdeotay-84e31",
  storageBucket: "vongdeotay-84e31.firebasestorage.app",
  messagingSenderId: "358205950024",
  appId: "1:358205950024:web:5809eb9ad24c107a5a307d",
  measurementId: "G-HXW17M4DNQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Dữ liệu mẫu cho demo
const userProfile = {
  name: "Nguyễn Văn A",
  age: 32,
  gender: "Nam",
  height: 170,
  weight: 68,
  avatar: "assets/avatar-default.png"
};
const healthHistory = [
  { time: "2025-09-20 10:00", heart: 80, bp: "120/80", spo2: 98 },
  { time: "2025-09-20 10:05", heart: 82, bp: "121/81", spo2: 98 },
  { time: "2025-09-20 10:10", heart: 85, bp: "122/82", spo2: 97 },
  { time: "2025-09-20 10:15", heart: 90, bp: "125/85", spo2: 97 },
  { time: "2025-09-20 10:20", heart: 87, bp: "124/83", spo2: 98 },
  { time: "2025-09-20 10:25", heart: 83, bp: "123/82", spo2: 98 }
];

// Tính BMI
function calcBMI(weight, height) {
  if (!weight || !height) return "--";
  const bmi = weight / ((height / 100) ** 2);
  return bmi ? bmi.toFixed(1) : "--";
}

// Lời khuyên tự động
function getAdvice(heart, bp, spo2) {
  if (heart > 100) return "Nhịp tim cao, bạn nên nghỉ ngơi và theo dõi thêm.";
  if (heart < 60) return "Nhịp tim thấp, hãy kiểm tra lại sức khỏe.";
  if (spo2 < 95) return "Chỉ số SpO₂ thấp, hãy hít thở sâu và kiểm tra lại.";
  if (bp.split("/")[0] > 140 || bp.split("/")[1] > 90) return "Huyết áp cao, nên thư giãn và đo lại sau ít phút.";
  if (bp.split("/")[0] < 90 || bp.split("/")[1] < 60) return "Huyết áp thấp, hãy nghỉ ngơi và uống nước.";
  return "Chỉ số sức khỏe của bạn đang ở mức tốt. Hãy duy trì lối sống lành mạnh!";
}

// Cảnh báo sức khỏe
function getAlert(heart, bp, spo2) {
  if (heart > 120 || heart < 50 || spo2 < 92) return "Cảnh báo: Chỉ số sức khỏe bất thường! Hãy liên hệ bác sĩ ngay.";
  if (bp.split("/")[0] > 160 || bp.split("/")[1] > 100) return "Cảnh báo: Huyết áp rất cao! Cần đi khám ngay.";
  if (bp.split("/")[0] < 80 || bp.split("/")[1] < 50) return "Cảnh báo: Huyết áp rất thấp! Cần nghỉ ngơi và theo dõi.";
  return "";
}

// Hiển thị thông tin cá nhân
function renderProfile() {
  document.getElementById("profileName").innerText = userProfile.name;
  document.getElementById("profileAge").innerText = userProfile.age;
  document.getElementById("profileGender").innerText = userProfile.gender;
  document.getElementById("profileHeight").innerText = userProfile.height;
  document.getElementById("profileWeight").innerText = userProfile.weight;
  document.getElementById("profileBMI").innerText = calcBMI(userProfile.weight, userProfile.height);
  document.getElementById("userAvatar").src = userProfile.avatar;
}

// Hiển thị lịch sử đo
function renderHistory() {
  const tbody = document.getElementById("historyTableBody");
  tbody.innerHTML = "";
  healthHistory.slice().reverse().forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.time}</td>
      <td>${row.heart}</td>
      <td>${row.bp}</td>
      <td>${row.spo2}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Hiển thị dữ liệu hiện tại
function renderCurrent() {
  const last = healthHistory[healthHistory.length - 1];
  document.getElementById("heartRate").innerText = last.heart + " bpm";
  document.getElementById("bloodPressure").innerText = last.bp + " mmHg";
  document.getElementById("spo2").innerText = last.spo2 + " %";
  document.getElementById("adviceBox").innerText = getAdvice(last.heart, last.bp, last.spo2);

  // Cảnh báo
  const alertMsg = getAlert(last.heart, last.bp, last.spo2);
  const alertSection = document.getElementById("alertSection");
  if (alertMsg) {
    alertSection.style.display = "flex";
    document.getElementById("alertMessage").innerText = alertMsg;
  } else {
    alertSection.style.display = "none";
  }
}

// Biểu đồ nhịp tim 
function renderChart() {
  const ctx = document.getElementById("myChart").getContext("2d");
  // Xóa chart cũ nếu có
  if (window.myChartInstance) {
    window.myChartInstance.destroy();
  }
  window.myChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: healthHistory.map(row => row.time.split(" ")[1]),
      datasets: [{
        label: "Nhịp tim (bpm)",
        data: healthHistory.map(row => row.heart),
        borderColor: "#ef5350",
        backgroundColor: "rgba(239,83,80,0.08)",
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: "#ef5350",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#1976d2",
            font: { size: 15, weight: "bold" }
          }
        }
      },
      scales: {
        x: {
          grid: { color: "#e3f0ff" },
          ticks: { color: "#1976d2", font: { size: 13 } }
        },
        y: {
          beginAtZero: false,
          grid: { color: "#e3f0ff" },
          ticks: { color: "#1976d2", font: { size: 13 } }
        }
      }
    }
  });
}

// Nhật ký sức khỏe
function setupNote() {
  const noteKey = "healthNote";
  const textarea = document.getElementById("healthNote");
  const saveBtn = document.getElementById("saveNoteBtn");
  const msg = document.getElementById("noteSavedMsg");

  // Load note
  textarea.value = localStorage.getItem(noteKey) || "";

  saveBtn.addEventListener("click", () => {
    localStorage.setItem(noteKey, textarea.value);
    msg.innerText = "Đã lưu nhật ký!";
    setTimeout(() => msg.innerText = "", 2000);
  });
}

// Cập nhật thông tin cá nhân (demo)
function setupEditProfile() {
  document.getElementById("editProfileBtn").addEventListener("click", () => {
    const name = prompt("Nhập họ tên:", userProfile.name);
    if (name) userProfile.name = name;
    const age = prompt("Nhập tuổi:", userProfile.age);
    if (age) userProfile.age = age;
    const gender = prompt("Nhập giới tính:", userProfile.gender);
    if (gender) userProfile.gender = gender;
    const height = prompt("Nhập chiều cao (cm):", userProfile.height);
    if (height) userProfile.height = height;
    const weight = prompt("Nhập cân nặng (kg):", userProfile.weight);
    if (weight) userProfile.weight = weight;
    renderProfile();
  });
}

// Đăng xuất
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

// Điều hướng navbar
function setupNavbar() {
  const navBtns = {
    navCurrent: "currentSection",
    navHistory: "historySection",
    navChart: "chartSection",
    navNote: "noteSection",
    navProfile: "profileSection"
  };
  Object.keys(navBtns).forEach(btnId => {
    document.getElementById(btnId).addEventListener("click", () => {
      // Đổi active cho nút
      Object.keys(navBtns).forEach(id => {
        document.getElementById(id).classList.remove("active");
        document.getElementById(navBtns[id]).classList.remove("active");
      });
      document.getElementById(btnId).classList.add("active");
      document.getElementById(navBtns[btnId]).classList.add("active");
      // Ẩn cảnh báo khi chuyển tab khác
      if (btnId !== "navCurrent") document.getElementById("alertSection").style.display = "none";
      if (btnId === "navCurrent") renderCurrent();
      if (btnId === "navChart") renderChart();
    });
  });
}

// Xử lý đăng nhập và render dữ liệu
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("userGreeting").innerText = `Xin chào, ${userProfile.name}!`;
    document.getElementById("userEmail").innerText = user.email;

    renderProfile();
    renderCurrent();
    renderHistory();
    renderChart();
    setupNavbar();
    setupNote();
    setupEditProfile();

    // Mặc định hiện tại
    document.getElementById("navCurrent").classList.add("active");
    document.getElementById("currentSection").classList.add("active");
  } else {
    window.location.href = "login.html";
  }
});