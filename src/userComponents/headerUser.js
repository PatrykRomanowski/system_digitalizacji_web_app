import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./headerUser.module.css";

const HeaderUser = ({ onClickNav }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/logoutUser");
  };

  const onClickNavHandler = (data) => {
    if (onClickNav) {
      onClickNav(data);
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerText}>User Panel</div>
      <div className={styles.navContainer}>
        <button
          onClick={() => {
            onClickNavHandler("addFile");
          }}
          className={styles.navButton}
        >
          Dodaj pliki
        </button>
        <button
          onClick={() => {
            onClickNavHandler("showFile");
          }}
          className={styles.navButton}
        >
          Przeglądaj pliki
        </button>
        <button
          onClick={() => {
            onClickNavHandler("showSettings");
          }}
          className={styles.navButton}
        >
          Ustawienia
        </button>
      </div>
      <button onClick={logoutHandler} className={styles.logoutButton}>
        Wyloguj
      </button>
    </div>
  );
};
export default HeaderUser;
