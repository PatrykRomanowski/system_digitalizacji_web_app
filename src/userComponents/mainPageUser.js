import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import HeaderUser from "./headerUser";
import SettingUserComponent from "./settingUserComponent";
import ShowFileComponent from "./showFileComponent";
import AddFileComponent from "./addFileComponent";

import ShowReceiptCategory from "./fileCategory/showReceiptCategory";
import ShowDocumentCategory from "./fileCategory/showDocumentCategory";
import ShowBookCategory from "./fileCategory/showBookCategory";

import styles from "./mainPageUser.module.css";

const MainPageUser = () => {
  const [actualPage, setActualPage] = useState(
    useSelector((state) => state.navStatus.actualCategory)
  );

  const userIsActive = useSelector((state) => state.userStatus.isActive);
  const navigate = useNavigate();

  const goToLogout = () => {
    console.log("logout");
    navigate("/logoutUser");
  };

  const onClickNav = (data) => {
    console.log(data);
    console.log(userIsActive);
    if (data === "addFile") {
      setActualPage("addFile");
    } else if (data === "showFile") {
      setActualPage("showFile");
    } else if (data === "showSettings") {
      setActualPage("showSettings");
    }
  };

  const logoutHandler = () => {
    navigate("/logoutUser");
  };

  const setCategoryHandler = (props) => {
    setActualPage(props);
  };

  const setShowFileCategoryHandler = (props) => {
    setActualPage("showFile");
    console.log(userIsActive);
  };

  let pageComponent;

  if (actualPage === "addFile") {
    pageComponent = <AddFileComponent />;
  } else if (actualPage === "showFile") {
    pageComponent = <ShowFileComponent checkCategory={setCategoryHandler} />;
  } else if (actualPage === "showSettings") {
    pageComponent = <SettingUserComponent />;
  } else if (actualPage === "documentCategory") {
    pageComponent = (
      <ShowDocumentCategory setShowFileCategory={setShowFileCategoryHandler} />
    );
  } else if (actualPage === "receiptCategory") {
    pageComponent = (
      <ShowReceiptCategory setShowFileCategory={setShowFileCategoryHandler} />
    );
  } else if (actualPage === "bookCategory") {
    pageComponent = (
      <ShowBookCategory setShowFileCategory={setShowFileCategoryHandler} />
    );
  }

  return (
    <div>
      <HeaderUser onClickNav={onClickNav} logoutHandler={logoutHandler} />
      <div>{pageComponent}</div>
      {!userIsActive ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p className={styles.textInfo}>
              Twoje konto jest zablokowane, a dane usunięte. <br /> Skontaktuj
              się z obsługą serwisu
            </p>

            <button className={styles.modalButton} onClick={() => goToLogout()}>
              OK{" "}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MainPageUser;
