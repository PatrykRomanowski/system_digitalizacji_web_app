import React from "react";

import styles from "./showReceiptCategory.module.css";

const ShowReceiptCategory = (props) => {
  const setShowFileCategory = () => {
    props.setShowFileCategory();
  };
  return (
    <div>
      <button onClick={setShowFileCategory}>
        WRÓĆ DO WSZYSTKICH KATEGORII
      </button>
      <div>This is Receipt category</div>
    </div>
  );
};

export default ShowReceiptCategory;
