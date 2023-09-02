import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { myStorage } from "../firebase";
import { firebaseRealtime } from "../firebase";

import { ref, get, remove, update } from "firebase/database";
import { listAll, ref as refStorage, deleteObject } from "firebase/storage";

import { adminActions } from "../storage/admin-context";

import styles from "./showUser.module.css";

const ShowUser = () => {
  const allUsers = useSelector((state) => state.adminStatus.allUsers);

  const [allBarsWithUsers, setAllBarsWithUsers] = useState();
  const [sortUserNameValue, setSortUserNameValeu] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showModalForDeleteItem, setShowModalForDeleteItem] = useState(false);
  const [userInfoItem, setUserInfoItem] = useState();
  const [additionalModalComponent, setAdditionalModal] = useState(null);
  const [openAdditionalModal, setOpenAdditionalModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(1024);
  const [actualUserId, setActualUserId] = useState();
  const [sendMessage, setSendMessage] = useState("");
  const [sendIsSuccess, setSendIsSuccess] = useState(false);
  const [statusBarIsActive, setStatusBarIsActive] = useState();
  const [userForDelete, setUserForDelete] = useState();

  const dispatch = useDispatch();

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value);
    setSliderValue(newValue);
  };

  useEffect(() => {
    console.log("XD");
    const setAdditionalModal2 = (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.h2Modal}>
              Wybierz ilość danych przydzielonych użytkownikowi
            </h2>
          </div>
          <input
            type="range"
            value={sliderValue}
            min={1024}
            max={8192}
            step={1024}
            onChange={handleSliderChange}
            className={styles.slider}
          />
          <div className={styles.textInfo}> {sliderValue} MB</div>
          <div className={styles.buttonsContainer}>
            <div
              className={styles.modalButton}
              onClick={() => changeAllocatedDiskSpace(actualUserId)}
            >
              ZMIEŃ
            </div>
            <div className={styles.modalButton} onClick={closeModalHandler2}>
              WRÓĆ
            </div>
          </div>
        </div>
      </div>
    );

    setAdditionalModal(setAdditionalModal2);
  }, [sliderValue]);

  const showHiddenStatusBar = () => {
    setTimeout(() => {
      setStatusBarIsActive(true);
    }, 1000); // Po 3 sekundach zmień sendIsSuccess na true (symulacja sukcesu)
    setTimeout(() => {
      setStatusBarIsActive(false);
    }, 4000);
  };

  const changeAllocatedDiskSpace = async (props) => {
    console.log(props);
    const actualRef = `/users/${props}`;
    const realtimeDatabaseFolderRef = ref(firebaseRealtime, actualRef);

    const itemToSend = { allocatedDiskSpace: sliderValue };
    console.log(props);
    try {
      await update(realtimeDatabaseFolderRef, itemToSend);
      dispatch(
        adminActions.changeDataForUser({
          itemId: props,
          allocadedSpaceUsed: sliderValue,
        })
      );
      dispatch(adminActions.addNewTotalDiskUsed());
      setSendMessage("Dane zostały zmienione");
      setSendIsSuccess(true);
      showHiddenStatusBar();
    } catch (err) {
      console.log(err);
      setSendMessage("Nie udało się zmienić danych");
      setSendIsSuccess(false);
      showHiddenStatusBar();
    }
  };

  const additionalModal = (props) => {
    setActualUserId(props);
    console.log(props);
    const setAdditionalModal2 = (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.h2Modal}>
              Wybierz ilość danych przydzielonych użytkownikowi
            </h2>
          </div>
          <input
            type="range"
            value={sliderValue}
            min={1024}
            max={8192}
            step={1024}
            onChange={handleSliderChange}
            className={styles.slider}
          />
          <div className={styles.textInfo}> {sliderValue} MB</div>
          <div className={styles.buttonsContainer}>
            <div
              className={styles.modalButton}
              onClick={() => changeAllocatedDiskSpace(props)}
            >
              ZMIEŃ
            </div>
            <div className={styles.modalButton} onClick={closeModalHandler2}>
              WRÓĆ
            </div>
          </div>
        </div>
      </div>
    );

    setAdditionalModal(setAdditionalModal2);
  };

  const closeModalHandler2 = () => {
    setAdditionalModal(null);
    setOpenAdditionalModal(false);
  };

  const showModalHandler = (props) => {
    console.log(props);

    const userInfoItem = (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Dane użytkownika {props.email}</h2>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.dataContainer}>
              <p className={styles.textInfo}>Id użytkownika: </p>
              <p className={styles.dataText}>{props.itemId}</p>
            </div>
            <div className={styles.dataContainer}>
              <p className={styles.textInfo}>Przestrzeń zarezerwowana: </p>
              <p className={styles.dataText}>{props.allocatedDiskSpace} MB</p>
            </div>
            <div className={styles.dataContainer}>
              <p className={styles.textInfo}>Przestrzeń użyta: </p>
              <p className={styles.dataText}>
                {props.diskSpaceUsed.toFixed(3)} MB
              </p>
            </div>

            <div className={styles.dataContainer}>
              <p className={styles.textInfo}>Użytkownik jest adminem: </p>
              <p className={styles.dataText}>{props.isAdmin ? "TAK" : "NIE"}</p>
            </div>
            <div className={styles.dataContainer}>
              <p className={styles.textInfo}>Użytkownik jest zablokowany:</p>
              <p className={styles.dataText}>
                {props.isActive ? "NIE" : "TAK"}
              </p>
            </div>
            <div className={`${styles.dataContainer}`}>
              <p
                onClick={() => additionalModal(props.itemId)}
                className={`${styles.buttonChangeAllocatedSpace} ${styles.textInfo}`}
              >
                Kliknij tu
              </p>
              <p className={styles.textInfo}>
                Aby zwiększyć dane użytkownikowi
              </p>
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <div className={styles.modalButton} onClick={closeModalHandler}>
              OK
            </div>
          </div>
        </div>
      </div>
    );

    setUserInfoItem(userInfoItem);
    setOpenAdditionalModal(true);
    // event.stopPropagation();

    setShowModal(true);
  };

  const showDeleteModal = (props, event) => {
    // okienko potwierdzenia chęci usunięcia użytkownika
    event.stopPropagation();

    setShowModalForDeleteItem(true);
    setUserForDelete(props);
  };

  const closeDeleteModal = () => {
    setShowModalForDeleteItem(false);
  };

  const modalToDeleteItem = (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.h2Modal}>
            Czy napewno chcesz usunąć użytkownika?
          </h2>
        </div>
        <div className={styles.buttonsContainer}>
          <div className={styles.modalButton} onClick={() => deleteItem()}>
            TAK
          </div>
          <div className={styles.modalButton} onClick={closeDeleteModal}>
            NIE
          </div>
        </div>
      </div>
    </div>
  );

  const deleteItem = async () => {
    // event.stopPropagation();
    console.log("delete item");

    const props = userForDelete;
    const actualRef = `/users/${props.itemId}`;
    const storageFolderRef = refStorage(myStorage, actualRef);

    const listResult = await listAll(storageFolderRef);
    console.log(listResult);

    try {
      const deletePromises = listResult.prefixes.map(async (prefix) => {
        // usuwanie ze storage
        const prefixListResult = await listAll(prefix);
        const deletePrefixPromises = prefixListResult.prefixes.map(
          async (innerPrefix) => {
            const innerPrefixListResult = await listAll(innerPrefix);
            const deleteInnerPrefixPromises =
              innerPrefixListResult.prefixes.map(async (deepInnerPrefix) => {
                const deepInnerPrefixListResult = await listAll(
                  deepInnerPrefix
                );
                const deleteDeepInnerPrefixPromises =
                  deepInnerPrefixListResult.items.map(async (itemRef) => {
                    await deleteObject(itemRef);
                    console.log("Usunięto plik:", itemRef.name);
                  });
                await Promise.all(deleteDeepInnerPrefixPromises); // Usunięcie wszystkich plików w najgłębszym podfolderze
              });
            await Promise.all(deleteInnerPrefixPromises); // Usunięcie wszystkich plików w wewnętrznym podfolderze
          }
        );
        await Promise.all(deletePrefixPromises); // Usunięcie wszystkich plików w podfolderze
      });
      await Promise.all(deletePromises); // Usunięcie wszystkich plików w podfolderach

      const refForDocumentsInRealtimeDatabase = ref(
        firebaseRealtime,
        `/users/${props.itemId}/document/`
      );
      const refForBooksInRealtimeDatabase = ref(
        firebaseRealtime,
        `/users/${props.itemId}/books/`
      );
      const refForReceiptInRealtimeDatabase = ref(
        firebaseRealtime,
        `/users/${props.itemId}/receipt/`
      );

      const refForRealtimeDatabase = ref(
        firebaseRealtime,
        `/users/${props.itemId}`
      );

      await remove(refForDocumentsInRealtimeDatabase);
      await remove(refForBooksInRealtimeDatabase);
      await remove(refForReceiptInRealtimeDatabase);

      const updateData = {
        diskSpaceUsed: 0,
        isActive: false,
        allocatedDiskSpace: 0,
      };
      await update(refForRealtimeDatabase, updateData);
      setSendMessage("Użytkownik został usunięty poprawnie");
      setSendIsSuccess(true);
      showHiddenStatusBar();
      setShowModalForDeleteItem(false);
      dispatch(
        adminActions.deleteUser({
          itemId: props.itemId,
        })
      );
    } catch (err) {
      console.log(err);
      setSendMessage("Nie udało się usunąć użytkownika");
      setSendIsSuccess(false);
      showHiddenStatusBar();
      setShowModalForDeleteItem(false);
    }
  };

  const closeModalHandler = () => [setShowModal(false)];

  const sortUserNameValueHandler = (event) => {
    setSortUserNameValeu(event.target.value);
  };

  useEffect(() => {
    if (allUsers) {
      const showAllItem = allUsers.map((user) => {
        if (user.isActive) {
          return (
            <div
              onClick={() => showModalHandler(user)}
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
                  deleteItem(
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
        } else {
          return;
        }
      });

      setAllBarsWithUsers(showAllItem);
      setAdditionalModal(null);
    }
  }, []);

  useEffect(() => {
    if (allUsers) {
      const showAllItem = allUsers.map((user) => {
        if (user.isActive) {
          return (
            <div
              onClick={() => showModalHandler(user)}
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
                  showDeleteModal(
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
        } else {
          return;
        }
      });

      if (sortUserNameValue) {
        const showAllItemSort = allUsers.map((user) => {
          if (user.isActive && user.email.includes(sortUserNameValue)) {
            return (
              <div
                onClick={() => showModalHandler(user)}
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
                    deleteItem(
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
          } else {
            return;
          }
        });
        setAllBarsWithUsers(showAllItemSort);
      } else {
        setAllBarsWithUsers(showAllItem);
      }
      setAdditionalModal(null);
    }
  }, [allUsers, sortUserNameValue]);

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
      {showModal ? userInfoItem : null}
      {openAdditionalModal ? additionalModalComponent : null}
      {showModalForDeleteItem ? modalToDeleteItem : null}
      <div
        className={`${styles.statusBar} ${
          sendIsSuccess ? styles.successStatusBar : styles.errorStatusBar
        } ${statusBarIsActive ? "" : styles.statusBarHidden}`}
      >
        {sendMessage}
      </div>
    </div>
  );
};

export default ShowUser;
