import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function DateTimePickerComponent() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(null);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState("");
  const [fetchedAlarmData, setFetchedAlarmData] = useState(null); // Trạng thái để lưu JSON nhận từ API

  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
  };

  // Hàm để gọi API và lấy dữ liệu JSON
  const fetchAlarmData = () => {
    return fetch("https://your-app-name.vercel.app/api/get-alarm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedDateTime }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFetchedAlarmData(data);
        console.log("Fetched Alarm Data:", data);
      })
      .catch((error) => {
        console.error("Error fetching alarm data:", error);
      });
  };

  const setAlarm = () => {
    setAlarmTime(new Date(selectedDateTime)); // Lưu thời gian báo thức dưới dạng Date
    setAlarmTriggered(false);
    setAlarmMessage(""); // Reset thông báo

    // Gọi API khi cài đặt báo thức
    fetchAlarmData();
  };

  useEffect(() => {
    const checkAlarm = () => {
      const now = new Date();
      if (
        alarmTime &&
        now.getHours() === alarmTime.getHours() &&
        now.getMinutes() === alarmTime.getMinutes() &&
        !alarmTriggered
      ) {
        setAlarmMessage("Wake up!"); // Hiển thị thông báo khi đến phút đã đặt
        setAlarmTriggered(true); // Đánh dấu báo thức đã kích hoạt
      }
    };

    let intervalId;

    if (alarmTime && !alarmTriggered) {
      intervalId = setInterval(checkAlarm, 1000); // Kiểm tra mỗi giây nhưng chỉ so sánh phút
    }

    return () => clearInterval(intervalId); // Xóa hẹn giờ khi component bị unmount
  }, [alarmTime, alarmTriggered]);

  const handleDismissAlarm = () => {
    setAlarmMessage("");
    setAlarmTime(null); // Reset thời gian báo thức
    setAlarmTriggered(false); // Cho phép đặt lại báo thức
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <DateTimePicker
          label="Select time"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
          renderInput={(params) => <TextField {...params} />}
          ampm
        />
        <Button
          variant="contained"
          color="primary"
          onClick={setAlarm}
          disabled={alarmTime !== null && !alarmTriggered} // Vô hiệu hóa khi đã cài đặt
        >
          Set Alarm
        </Button>
        {alarmMessage && (
          <div>
            <Typography variant="h6" color="error">
              {alarmMessage}
            </Typography>
            <Button variant="outlined" onClick={handleDismissAlarm}>
              OK
            </Button>
          </div>
        )}
        {false && fetchedAlarmData && (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            Fetched JSON: {JSON.stringify(fetchedAlarmData)}
          </Typography>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default DateTimePickerComponent;
