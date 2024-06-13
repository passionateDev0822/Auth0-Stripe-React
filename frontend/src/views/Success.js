// src/Success.js
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../App";

const Success = () => {
  const navigate = useNavigate();
  const setToastMessage = useContext(ToastContext);

  useEffect(() => {
    setToastMessage("Checkout was successful!");
    navigate("/products");
  }, [navigate, setToastMessage]);

  return null; // No need to render anything
};

export default Success;
