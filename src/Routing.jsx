import React from "react";
import { Routes, Route } from "react-router-dom";
import Form from "./components/form/Form";
import Elevator from "./components/elevator/Elevator";

export default function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/Elevator/:capacity/:floors" element={<Elevator />} />
      </Routes>
    </div>
  );
}
