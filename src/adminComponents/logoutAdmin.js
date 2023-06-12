import React, { useState, useEffect } from "react";
import { auth2 } from "../firebase";

import styles from "./logoutAdmin.module.css";

const LogoutAdmin = () => {
  const [logoutResult, setLogoutResult] = useState(null);

  const handleLogout = async () => {
    try {
      await auth2.signOut();
      setLogoutResult("success");
    } catch (err) {
      console.log("błąd wylogowania!");
      setLogoutResult("failure");
    }
  };

  const handleCloseModal = () => {
    setLogoutResult(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div>
      {logoutResult === "success" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Wylogowano pomyślnie</h2>
            </div>
            <div className={styles.modalBody}>
              <div>Zostałeś wylogowany.</div>
            </div>
            <span className={styles.close} onClick={handleCloseModal}>
              OK
            </span>
          </div>
        </div>
      )}
      {logoutResult === "failure" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Błąd wylogowania</h2>
            </div>
            <div className={styles.modalBody}>
              <div>Wylogowanie nie powiodło się.</div>
            </div>
            <span className={styles.close} onClick={handleCloseModal}>
              OK
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutAdmin;
