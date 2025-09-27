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
// ===== Nhật ký sức khỏe: Lưu + Xem + Xóa =====
function setupNote() {
  const textarea = document.getElementById("healthNote");
  const saveBtn = document.getElementById("saveNoteBtn");
  const msg = document.getElementById("noteSavedMsg");
  const noteList = document.getElementById("noteList");
  const clearBtn = document.getElementById("clearNotesBtn");

  const KEY_SINGLE = "healthNote";     // key cũ (1 ghi chú)
  const KEY_ARRAY  = "healthNotes";    // key mới (danh sách ghi chú)

  // --- Migrate dữ liệu cũ (nếu có) sang mảng ---
  try {
    const old = localStorage.getItem(KEY_SINGLE);
    const hasArray = localStorage.getItem(KEY_ARRAY);
    if (old && !hasArray) {
      const migrated = [{
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        text: old,
        ts: Date.now()
      }];
      localStorage.setItem(KEY_ARRAY, JSON.stringify(migrated));
      localStorage.removeItem(KEY_SINGLE);
    }
  } catch (_) { /* ignore */ }

  // --- Helpers ---
  const loadNotes = () => {
    try {
      const raw = localStorage.getItem(KEY_ARRAY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveNotes = (notes) => {
    localStorage.setItem(KEY_ARRAY, JSON.stringify(notes));
  };

  const fmt = (ts) => {
    // format thời gian: DD/MM/YYYY HH:mm
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const renderNotes = () => {
    const notes = loadNotes().sort((a,b) => b.ts - a.ts); // mới nhất lên đầu
    noteList.innerHTML = "";

    if (notes.length === 0) {
      noteList.innerHTML = `<li style="text-align:center;color:#777;">Chưa có nhật ký nào.</li>`;
      return;
    }

    notes.forEach(n => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="note-meta">
          <span>🕒 ${fmt(n.ts)}</span>
          <div class="note-actions">
            <button class="btn-note" data-action="load" data-id="${n.id}" title="Tải vào ô nhập để chỉnh sửa">Nạp vào ô</button>
            <button class="btn-note btn-delete" data-action="delete" data-id="${n.id}" title="Xóa ghi chú này">Xóa</button>
          </div>
        </div>
        <div class="note-text">${escapeHtml(n.text || "")}</div>
      `;
      noteList.appendChild(li);
    });
  };

  // Escape cơ bản để hiển thị an toàn
  const escapeHtml = (s) =>
    (s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  // --- Sự kiện: Lưu ghi chú mới (thêm vào danh sách) ---
  saveBtn.addEventListener("click", () => {
    const text = (textarea.value || "").trim();
    if (!text) {
      msg.innerText = "Vui lòng nhập nội dung trước khi lưu.";
      msg.style.color = "#e65100";
      setTimeout(() => (msg.innerText = ""), 1800);
      return;
    }
    const notes = loadNotes();
    notes.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text,
      ts: Date.now()
    });
    saveNotes(notes);
    textarea.value = ""; // clear ô nhập sau khi lưu
    msg.innerText = "Đã lưu nhật ký!";
    msg.style.color = "#43a047";
    setTimeout(() => (msg.innerText = ""), 1800);
    renderNotes();
  });

  // --- Sự kiện: Click trên danh sách (nạp/xóa) ---
  noteList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    const notes = loadNotes();

    if (action === "delete") {
      const next = notes.filter(n => n.id !== id);
      saveNotes(next);
      renderNotes();
      return;
    }

    if (action === "load") {
      const found = notes.find(n => n.id === id);
      if (found) {
        textarea.value = found.text || "";
        // gợi ý: người dùng có thể sửa và bấm Lưu để tạo bản ghi mới
      }
    }
  });

  // --- Sự kiện: Xóa toàn bộ ---
  clearBtn.addEventListener("click", () => {
    const notes = loadNotes();
    if (notes.length === 0) return;
    const ok = confirm("Bạn có chắc muốn xóa TẤT CẢ nhật ký đã lưu?");
    if (!ok) return;
    localStorage.removeItem(KEY_ARRAY);
    renderNotes();
  });

  // Hiển thị lần đầu
  renderNotes();
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