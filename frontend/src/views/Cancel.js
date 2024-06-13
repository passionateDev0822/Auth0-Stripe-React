// src/Cancel.js
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../App";

const Cancel = () => {
  const navigate = useNavigate();
  const setToastMessage = useContext(ToastContext);

  useEffect(() => {
    setToastMessage("Checkout was canceled.");
    navigate("/products");
  }, [navigate, setToastMessage]);

  return null; // No need to render anything
};

export default Cancel;
