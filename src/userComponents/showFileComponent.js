import React from "react";

import booksBackground from "../img/books.jpg";
import documentsBackground from "../img/documents.jpg";
import receiptBackground from "../img/receipts.jpg";

import styles from "./showFileComponent.module.css";
const ShowFileComponent = () => {
  return (
    <div className={styles.categoryContainer}>
      <div
        className={styles.bookCategory}
        style={{
          backgroundImage: `url(${booksBackground})`,
          backgroundSize: "cover",
        }}
      ></div>

      <div
        className={styles.bookCategory}
        style={{
          backgroundImage: `url(${documentsBackground})`,
          backgroundSize: "cover",
        }}
      ></div>

      <div
        className={styles.bookCategory}
        style={{
          backgroundImage: `url(${receiptBackground})`,
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
};

export default ShowFileComponent;
