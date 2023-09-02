import React from "react";

import { useNavigate } from "react-router-dom";

import styles from "./headerAdmin.module.css";

const HeaderUser = ({ onClickNav }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/logoutAdmin");
  };

  const onClickNavHandler = (data) => {
    if (onClickNav) {
      onClickNav(data);
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerText}> Admin Panel </div>{" "}
      <div className={styles.navContainer}>
        <button
          onClick={() => {
            onClickNavHandler("showUser");
          }}
          className={styles.navButton}
        >
          Zarządzanie Użytkownikami{" "}
        </button>
        <button
          onClick={() => {
            onClickNavHandler("showSetting");
          }}
          className={styles.navButton}
        >
          Wykorzystanie danych{" "}
        </button>{" "}
      </div>{" "}
      <button onClick={logoutHandler} className={styles.logoutButton}>
        Wyloguj{" "}
      </button>{" "}
    </div>
  );
};

export default HeaderUser;
