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
// ===== Nhật ký sức khỏe: Lưu + Xem (KHÔNG XOÁ) =====
function setupNote() {
  const textarea = document.getElementById("healthNote");
  const saveBtn = document.getElementById("saveNoteBtn");
  const msg = document.getElementById("noteSavedMsg");
  const noteList = document.getElementById("noteList");

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

  const escapeHtml = (s) =>
    (s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const renderNotes = () => {
    const notes = loadNotes().sort((a,b) => b.ts - a.ts); // mới nhất lên đầu
    noteList.innerHTML = "";

    if (notes.length === 0) {
      noteList.innerHTML = `<li style="text-align:center;color:#777;">Chưa có nhật ký nào.</li>`;
      return;
    }

    notes.forEach(n => {
      const li = document.createElement("li");
      li.className = "note-item";
      li.innerHTML = `
        <div class="note-meta">🕒 ${fmt(n.ts)}</div>
        <div class="note-text">${escapeHtml(n.text || "")}</div>
      `;
      // KHÔNG có nút xóa, KHÔNG có xóa tất cả
      noteList.appendChild(li);
    });
  };

  // --- Sự kiện: Lưu ghi chú mới (có xác nhận) ---
  saveBtn.addEventListener("click", () => {
    const text = (textarea.value || "").trim();
    if (!text) {
      msg.innerText = "Vui lòng nhập nội dung trước khi lưu.";
      msg.style.color = "#e65100";
      setTimeout(() => (msg.innerText = ""), 1800);
      return;
    }

    const ok = confirm("Bạn có muốn lưu nhật ký này không?");
    if (!ok) {
      msg.innerText = "Đã hủy lưu nhật ký.";
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

    textarea.value = ""; // dọn ô nhập sau khi lưu
    msg.innerText = "Đã lưu nhật ký!";
    msg.style.color = "#43a047";
    setTimeout(() => (msg.innerText = ""), 1800);
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
// Cập nhật thông tin cá nhân bằng FORM (mở tab riêng)
function setupEditProfile() {
  const editBtn = document.getElementById("editProfileBtn");
  const form = document.getElementById("profileEditForm");
  const cancelBtn = document.getElementById("cancelEditBtn");

  const sectionIds = ["profileSection","currentSection","historySection","chartSection","noteSection","profileEditSection"];

  // Helper: bật 1 section theo id
  const activateSection = (id) => {
    sectionIds.forEach(sid => {
      const sec = document.getElementById(sid);
      if (!sec) return;
      if (sid === id) sec.classList.add("active");
      else sec.classList.remove("active");
    });
    // Đồng bộ trạng thái nút navbar
    const navMap = {
      navCurrent: "currentSection",
      navHistory: "historySection",
      navChart: "chartSection",
      navNote: "noteSection",
      navProfile: "profileSection"
    };
    Object.keys(navMap).forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      if (navMap[btnId] === id) btn.classList.add("active");
      else btn.classList.remove("active");
    });
  };

  // Khi bấm nút "Cập nhật" trong tab Cá nhân -> mở form & nạp dữ liệu
  editBtn.addEventListener("click", () => {
    // Nạp sẵn dữ liệu hiện có
    document.getElementById("editName").value   = userProfile.name || "";
    document.getElementById("editAge").value    = userProfile.age || "";
    document.getElementById("editGender").value = userProfile.gender || "";
    document.getElementById("editHeight").value = userProfile.height || "";
    document.getElementById("editWeight").value = userProfile.weight || "";
    document.getElementById("editAvatar").value = userProfile.avatar || "";

    // Mở tab form
    activateSection("profileEditSection");
  });

  // Nút HỦY -> quay về tab Cá nhân, không lưu
  cancelBtn.addEventListener("click", () => {
    activateSection("profileSection");
  });

  // Submit form -> validate, lưu vào userProfile, render lại, quay về tab Cá nhân
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name   = document.getElementById("editName").value.trim();
    const age    = parseInt(document.getElementById("editAge").value, 10);
    const gender = document.getElementById("editGender").value.trim();
    const height = parseFloat(document.getElementById("editHeight").value);
    const weight = parseFloat(document.getElementById("editWeight").value);
    const avatar = document.getElementById("editAvatar").value.trim();

    // Ràng buộc tối thiểu
    if (!name || !age || !gender || !height || !weight) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    if (age < 1 || age > 120) {
      alert("Tuổi không hợp lệ (1-120).");
      return;
    }
    if (height < 50 || height > 250) {
      alert("Chiều cao không hợp lệ (50-250 cm).");
      return;
    }
    if (weight < 10 || weight > 300) {
      alert("Cân nặng không hợp lệ (10-300 kg).");
      return;
    }

    // Lưu lại hồ sơ (demo: lưu trong biến userProfile)
    userProfile.name = name;
    userProfile.age = age;
    userProfile.gender = gender;
    userProfile.height = height;
    userProfile.weight = weight;
    if (avatar) userProfile.avatar = avatar;

    // Render lại UI
    renderProfile();  // cập nhật thẻ hồ sơ & BMI
    // nếu muốn cập nhật lời chào trên navbar:
    document.getElementById("userGreeting").innerText = `Xin chào, ${userProfile.name}!`;

    // Quay về tab Cá nhân
    activateSection("profileSection");

    // Thông báo nhẹ
    setTimeout(() => alert("Đã cập nhật thông tin cá nhân."), 0);
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