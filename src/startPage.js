import React from "react";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div>
      <div>This is imagePage!!!!</div>
      <button onClick={goToLoginPage}>go to loginPage</button>
    </div>
  );
};

export default StartPage;
