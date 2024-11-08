import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function DateTimePickerComponent() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(null);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState("");
  const [fetchedAlarmData, setFetchedAlarmData] = useState(null);

  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
  };

  const formatDateTimeForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year};${month};${day};${hours};${minutes};${seconds}`;
  };

  const fetchAlarmData = () => {
    return fetch("https://seahorse-app-x47e7.ondigitalocean.app/get-alarm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: formatDateTimeForApi(selectedDateTime),
      }),
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
    setAlarmTime(new Date(selectedDateTime));
    setAlarmTriggered(false);
    setAlarmMessage("");

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
        setAlarmMessage("Wake up!");
        setAlarmTriggered(true);
      }
    };

    let intervalId;

    if (alarmTime && !alarmTriggered) {
      intervalId = setInterval(checkAlarm, 1000);
    }

    return () => clearInterval(intervalId);
  }, [alarmTime, alarmTriggered]);

  const handleDismissAlarm = () => {
    setAlarmMessage("");
    setAlarmTime(null);
    setAlarmTriggered(false);
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
          disabled={alarmTime !== null && !alarmTriggered}
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
