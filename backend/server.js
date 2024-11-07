const express = require("express");
const app = express();
const PORT = 5000;

// Để cho phép CORS (cho phép các ứng dụng React truy cập API này)
const cors = require("cors");
app.use(cors());

// Tạo endpoint để trả về JSON chỉ bao gồm selectedDateTime và alarmSetTime
app.get("/api/get-alarm", (req, res) => {
  const alarmData = {
    selectedDateTime: new Date().toISOString(), // Thời gian hiện tại khi set alarm
    alarmSetTime: new Date().toISOString(), // Thời gian được lưu lại khi người dùng nhấn set alarm
  };
  res.json(alarmData);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
