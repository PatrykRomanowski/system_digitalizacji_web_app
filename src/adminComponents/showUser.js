import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./showUser.module.css";

const ShowUser = () => {
  const allUsers = useSelector((state) => state.adminStatus.allUsers);

  const [allBarsWithUsers, setAllBarsWithUsers] = useState();
  const [sortUserNameValue, setSortUserNameValeu] = useState();
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const deleteItem = () => {
    console.log("delete item");
  };

  const closeModalHandler = () => [setShowModal(false)];

  const sortUserNameValueHandler = () => {};

  useEffect(() => {
    const showAllItem = allUsers.map((user) => {
      return (
        <div
          onClick={() => showModalHandler()}
          className={styles.itemContainer}
        >
          <div style={{ flex: "6" }}>
            <p>Nazwa użytkownika / email</p>
            <div className={styles.itemDescription}>{user.email}</div>
          </div>
          <div>
            <p>{user.isAdmin ? "admin" : "user"}</p>
            <div className={styles.itemIsUserContainer}>
              {user.isAdmin ? (
                <div className={styles.greenDot}></div>
              ) : (
                <div className={styles.redDot}></div>
              )}
            </div>
          </div>
          <div style={{ flex: "1" }}>
            <p>przydzielona przestrzeń</p>
            <div className={styles.itemCategory}>
              {user.allocatedDiskSpace} MB
            </div>
          </div>
          <div style={{ flex: "1" }}>
            <p>wykorzystana przestrzeń</p>
            <div className={styles.itemSize}>
              {typeof user.diskSpaceUsed === "number"
                ? `${user.diskSpaceUsed.toFixed(3)} MB`
                : ""}
            </div>
          </div>
          <div
            className={styles.iconContainer}
            onClick={(event) =>
              showModalHandler(
                {
                  itemId: user.itemId,
                  userSpaceUsed: user.diskSpaceUsed,
                },
                event
              )
            }
          >
            <div className={styles.icon}></div>
          </div>
        </div>
      );
    });
    setAllBarsWithUsers(showAllItem);
  }, []);

  return (
    <div>
      <div className={styles.inputContainer}>
        <div className={styles.searchInput}>
          <p>Wpisz nazwę użytkownika</p>
          <input
            type="text"
            value={sortUserNameValue}
            onChange={sortUserNameValueHandler}
            className={styles.inputModal}
          />
        </div>
      </div>
      <div className={styles.itemsContainer}>{allBarsWithUsers}</div>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Czy napewno chcesz usunąć plik</h2>
            </div>
            <div className={styles.buttonsContainer}>
              <div className={styles.buttonInsideModal} onClick={deleteItem}>
                TAK
              </div>
              <div
                className={styles.buttonInsideModal}
                onClick={closeModalHandler}
              >
                NIE
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowUser;
