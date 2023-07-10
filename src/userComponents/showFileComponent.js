import React from "react";

import booksBackground from "../img/books.jpg";
import documentsBackground from "../img/documents.jpg";
import receiptBackground from "../img/receipts.jpg";

import styles from "./showFileComponent.module.css";
const ShowFileComponent = (props) => {
  const checkCategoryHandler = (nameCategory) => {
    props.checkCategory(nameCategory);
  };

  return (
    <div className={styles.componentContainer}>
      <div className={styles.showFileTitle}>Wybierz kategorię</div>
      <div className={styles.categoryContainer}>
        <div
          onClick={() => checkCategoryHandler("bookCategory")}
          className={styles.bookCategory}
          style={{
            backgroundImage: `url(${booksBackground})`,
            backgroundSize: "cover",
          }}
        >
          <div className={styles.photoCategoryDescription}>KSIĄŻKI</div>
        </div>

        <div
          onClick={() => checkCategoryHandler("documentCategory")}
          className={styles.bookCategory}
          style={{
            backgroundImage: `url(${documentsBackground})`,
            backgroundSize: "cover",
          }}
        >
          <div className={styles.photoCategoryDescription}>DOKUMENTY</div>
        </div>

        <div
          onClick={() => checkCategoryHandler("receiptCategory")}
          className={styles.bookCategory}
          style={{
            backgroundImage: `url(${receiptBackground})`,
            backgroundSize: "cover",
          }}
        >
          <div className={styles.photoCategoryDescription}>PARAGONY</div>
        </div>
      </div>
    </div>
  );
};

export default ShowFileComponent;
