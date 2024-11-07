import "./App.css";
import React from "react";
import DateTimePickerComponent from "./components/DateTimePickerComponent";

function App() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <DateTimePickerComponent />
    </div>
  );
}

export default App;
