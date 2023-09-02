import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./startPage.module.css";
import backgroundImage from "./img/title.jpg";

const StartPage = () => {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div
      className={styles.title_page_container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.title_text}>PRZECHOWAJ SWOJE DANE BEZPIECZNIE</div>
      <button className={styles.homePage_btn} onClick={goToLoginPage}>
        Zaczynamy
      </button>
    </div>
  );
};

export default StartPage;
