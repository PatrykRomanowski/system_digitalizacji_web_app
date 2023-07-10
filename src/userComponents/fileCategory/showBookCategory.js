import React from "react";

import styles from "./showBookCategory.module.css";

const ShowBookCategory = (props) => {
  const setShowFileCategory = () => {
    props.setShowFileCategory();
  };

  return (
    <div>
      <button onClick={setShowFileCategory}>
        WRÓĆ DO WSZYSTKICH KATEGORII
      </button>
      <div>This is Book category</div>
    </div>
  );
};

export default ShowBookCategory;
