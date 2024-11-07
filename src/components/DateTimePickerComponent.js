import React, { useState } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function DateTimePickerComponent() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label="Select time"
        value={selectedDateTime}
        onChange={handleDateTimeChange}
        renderInput={(params) => <TextField {...params} />}
        ampm // Hiển thị định dạng AM/PM, bỏ đi nếu bạn muốn 24h
      />
    </LocalizationProvider>
  );
}

export default DateTimePickerComponent;
