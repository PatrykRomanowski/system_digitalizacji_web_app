import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { myStorage } from "../firebase";
import { firebaseRealtime } from "../firebase";

import { ref, get, remove, update } from "firebase/database";
import { listAll, ref as refStorage, deleteObject } from "firebase/storage";

import styles from "./showUser.module.css";

const ShowUser = () => {
  const allUsers = useSelector((state) => state.adminStatus.allUsers);

  const [allBarsWithUsers, setAllBarsWithUsers] = useState();
  const [sortUserNameValue, setSortUserNameValeu] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showModalForDeleteItem, setShowModalForDeleteItem] = useState(false);

  const showModalHandler = () => {
    // event.stopPropagation();

    setShowModal(true);
  };

  const deleteItem = async (props, event) => {
    event.stopPropagation();
    console.log("delete item");

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

      const updateData = { diskSpaceUsed: 0, isActive: false };
      await update(refForRealtimeDatabase, updateData);
    } catch (err) {
      console.log(err);
    }
  };

  const closeModalHandler = () => [setShowModal(false)];

  const sortUserNameValueHandler = () => {};

  useEffect(() => {
    const showAllItem = allUsers.map((user) => {
      if (user.isActive) {
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
