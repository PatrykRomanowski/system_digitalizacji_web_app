import React from "react";

import { useNavigate } from "react-router-dom";

import "./loginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate("/");
  };

  const goToRegisterPageHandler = () => {
    navigate("/register");
  };

  return (
    <div>
      <div>This is login page!!!!</div>
      <button onClick={goBackHandler}>Wróć</button>
      <button onClick={goToRegisterPageHandler}>zarejestruj się!</button>
    </div>
  );
};

export default LoginPage;
