import React from "react";

import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate("/");
  };

  return (
    <div>
      <div>This is login page!!!!</div>
      <button onClick={goBackHandler}>Wróć</button>
    </div>
  );
};

export default LoginPage;
