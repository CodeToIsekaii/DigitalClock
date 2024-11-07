import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function DateTimePickerComponent() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(null);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState("");

  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
  };

  const setAlarm = () => {
    setAlarmTime(new Date(selectedDateTime)); // Lưu thời gian báo thức dưới dạng Date
    setAlarmTriggered(false);
    setAlarmMessage(""); // Reset thông báo
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
      </div>
    </LocalizationProvider>
  );
}

export default DateTimePickerComponent;
