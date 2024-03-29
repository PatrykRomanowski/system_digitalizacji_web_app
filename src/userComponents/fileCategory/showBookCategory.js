import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { firebaseRealtime } from "../../firebase";
import { myStorage } from "../../firebase";
import {
  listAll,
  ref as refStorage,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

import { ref, get, remove, update } from "firebase/database";

import { navActions } from "../../storage/nav-context";
import { userActions } from "../../storage/user-context";

import useSortBooks from "../../hooks/useSortBooks";

import styles from "./showBookCategory.module.css";

const ShowBookCategory = (props) => {
  const userId = useSelector((state) => state.userStatus.userId);
  const actualSpaceUsed = useSelector(
    (state) => state.userStatus.discSpacesUse
  );

  const [allBooks, setAllBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalforDeleteItem, setShowModalForDeleteItem] = useState(false);
  const [modalButtonDisabled, setModalButtonDisabled] = useState(true);
  const [pageSelectedByUser, setPageSelectedByUser] = useState(null);
  const [filesFromSend, setFilesFromSend] = useState(false);
  const [actualRefForStorage, setActualRefForStorage] = useState("");
  const [siteCounter, setSiteCounter] = useState(null);

  const [sortTitleValue, setSortTitleValue] = useState("");
  const [sortAuthorValue, setSortAuthorValue] = useState("");

  const [allSortBooks, setAllSortBooks] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const sortFileHook = useSortBooks(); // castom hooks

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sortTitleValueHandeler = (event) => {
    setSortTitleValue(event.target.value);
  };

  const sortAuthorValueHandler = (event) => {
    setSortAuthorValue(event.target.value);
  };

  useEffect(() => {
    if (sortTitleValue && !sortAuthorValue) {
      sortFileHook.counter();
      const sortFile = allBooks.map((book) => {
        console.log(book.itemId);
        if (
          book.bookTitle.toLowerCase().includes(sortTitleValue.toLowerCase())
        ) {
          console.log(book.bookTitle);
          return (
            <div
              onClick={() => showModalHandler(book.itemId)}
              // onClick={showModalHandler}
              className={styles.bookContainer}
              key={book.itemId}
            >
              <div className={styles.bookAuthor}>{book.bookAuthor}</div>
              <div className={styles.bookTitle}>{book.bookTitle}</div>

              <img
                className={styles.titleImage}
                src={book.bookImage}
                alt="Obrazek książki"
              />
              <div
                className={styles.iconContainer}
                onClick={(event) =>
                  showModalHandlerForDeleteItem(
                    {
                      itemId: book.itemId,
                      itemSize: book.bookSize,
                    },
                    event
                  )
                }
              >
                <div className={styles.icon}></div>
              </div>
            </div>
          );
        }
        return false;
      });
      setAllSortBooks(sortFile);
    } else if (sortAuthorValue && !sortTitleValue) {
      const sortFile = allBooks.map((book) => {
        console.log(book.itemId);
        if (
          book.bookAuthor.toLowerCase().includes(sortAuthorValue.toLowerCase())
        ) {
          console.log(book.bookTitle);
          return (
            <div
              onClick={() => showModalHandler(book.itemId)}
              // onClick={showModalHandler}
              className={styles.bookContainer}
              key={book.itemId}
            >
              <div className={styles.bookAuthor}>{book.bookAuthor}</div>
              <div className={styles.bookTitle}>{book.bookTitle}</div>

              <img
                className={styles.titleImage}
                src={book.bookImage}
                alt="Obrazek książki"
              />
              <div
                className={styles.iconContainer}
                onClick={(event) =>
                  showModalHandlerForDeleteItem(
                    {
                      itemId: book.itemId,
                      itemSize: book.bookSize,
                    },
                    event
                  )
                }
              >
                <div className={styles.icon}></div>
              </div>
            </div>
          );
        }
        return false;
      });

      setAllSortBooks(sortFile);
    } else if (sortAuthorValue && sortTitleValue) {
      const sortFile = allBooks.filter((book) => {
        console.log(book.itemId);
        if (
          book.bookAuthor.toLowerCase().includes(sortAuthorValue.toLowerCase())
        ) {
          console.log(book.bookTitle);
          return book;
        }
        return false;
      });

      const additionalSortFile = sortFile.map((book) => {
        console.log(book.itemId);
        if (
          book.bookTitle.toLowerCase().includes(sortTitleValue.toLowerCase())
        ) {
          console.log(book.bookAuthor);
          return (
            <div
              onClick={() => showModalHandler(book.itemId)}
              // onClick={showModalHandler}
              className={styles.bookContainer}
              key={book.itemId}
            >
              <div className={styles.bookAuthor}>{book.bookAuthor}</div>
              <div className={styles.bookTitle}>{book.bookTitle}</div>

              <img
                className={styles.titleImage}
                src={book.bookImage}
                alt="Obrazek książki"
              />
              <div
                className={styles.iconContainer}
                onClick={(event) =>
                  showModalHandlerForDeleteItem(
                    {
                      itemId: book.itemId,
                      itemSize: book.bookSize,
                    },
                    event
                  )
                }
              >
                <div className={styles.icon}></div>
              </div>
            </div>
          );
        }
        return false;
      });
      setAllSortBooks(additionalSortFile);
    } else {
      setAllSortBooks(null);
    }
  }, [sortAuthorValue, sortTitleValue]);

  const showModalHandlerForDeleteItem = (item, event) => {
    event.stopPropagation();

    console.log(item);

    setFilesFromSend(item);
    setShowModalForDeleteItem(true);
  };

  const deleteItem = async () => {
    const item = filesFromSend;
    console.log(item);

    const actualRef = `/users/${userId}/books/${item.itemId}/`;
    const storageFolderRef = refStorage(myStorage, actualRef);
    const realtimeDatabaseFolderRef = ref(firebaseRealtime, actualRef);
    const realTimeDatabaseDiscSpaceUse = ref(
      firebaseRealtime,
      `users/${userId}`
    );

    const listResult = await listAll(storageFolderRef);

    try {
      const deletePromises = listResult.items.map(async (item) => {
        await deleteObject(item);
      });
      await Promise.all(deletePromises); // usunięcie danych ze storage
      await remove(realtimeDatabaseFolderRef);
      const sizeItems = item.itemSize;
      const newSpaceUsed = { diskSpaceUsed: actualSpaceUsed - item.itemSize };

      await update(realTimeDatabaseDiscSpaceUse, newSpaceUsed); // await deleteObject(storageFolderRef);
      dispatch(userActions.deleteItem({ sizeFiles: sizeItems }));
      console.log("Item deleted successfully");

      const updatedItems = allItems.filter((i) => i.itemId !== item.itemId);
      setAllItems(updatedItems);
    } catch (err) {
      console.error("Error deleting item:", err);
    }

    setShowModalForDeleteItem(false);
  };

  const closeModalHandler = () => {
    setShowModalForDeleteItem(false);
  };

  const showModalHandler = (props, event) => {
    // event.stopPropagation();

    setShowModal(true);
    const actualRef = `/users/${userId}/books/${props}`;
    setActualRefForStorage(actualRef);
    const actualCategory = "bookCategory";
    dispatch(navActions.setActualCategory({ actual: actualCategory }));
    dispatch(userActions.setActualGalleryRef({ xd: actualRef }));

    const storageRef = refStorage(myStorage, actualRef);
    listAll(storageRef).then((res) => {
      const imageUrls = res.items.map((item) =>
        getDownloadURL(item).then((url) => ({
          original: url,
          thumbnail: url,
          originalClass: "showPhoto",
          thumbnailClass: "showPhoto-thumbnail",
        }))
      );

      const imageLength = imageUrls.length;
      setSiteCounter(imageLength - 1);
      console.log(imageLength);
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToBookGallery = () => {
    dispatch(
      userActions.setActualSiteOfBook({ actual: pageSelectedByUser - 1 })
    );
    navigate("/showGalleryBook");
  };

  const buttonDisabledHandler = (value) => {
    if (value) {
      setModalButtonDisabled(false);
    } else {
      setModalButtonDisabled(true);
    }
  };

  const pageSelectedByUserHandler = (event) => {
    const value = event.target.value;
    const numberValue = parseInt(value);

    if (numberValue >= siteCounter) {
      setPageSelectedByUser(siteCounter);
      buttonDisabledHandler(numberValue);
    } else if (numberValue <= 0) {
      setPageSelectedByUser(0);
      buttonDisabledHandler(false);
    } else {
      setPageSelectedByUser(numberValue);
      buttonDisabledHandler(numberValue);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getBooksRef = ref(firebaseRealtime, `/users/${userId}/books`);
        const snapshot = await get(getBooksRef);
        const data = snapshot.val();

        // console.log(data);

        const books = [];

        for (const bookKey in data) {
          const book = data[bookKey];

          const getStorageRef = refStorage(
            myStorage,
            `/users/${userId}/books/${bookKey}`
          );

          const res = await listAll(getStorageRef);
          if (res.items.length > 0) {
            const firstFileRef = res.items[0];

            try {
              const url = await getDownloadURL(firstFileRef);

              books.push({
                itemId: bookKey,
                bookAuthor: book.author,
                bookTitle: book.title,
                bookDescription: book.description,
                bookSize: book.size.reduce((acc, current) => acc + current),
                bookImage: url,
              });
            } catch (error) {
              console.log("Błąd podczas pobierania URL obrazka:", error);
            }
          } else {
            console.log("w folderze nie ma plików");
          }
        }

        setAllBooks(books);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const showAllBooks = allBooks.map((book) => {
      // console.log(book);
      return (
        <div
          onClick={(event) => showModalHandler(book.itemId, event)}
          // onClick={showModalHandler}
          className={styles.bookContainer}
          key={book.itemId}
        >
          <div className={styles.bookAuthor}>{book.bookAuthor}</div>
          <div className={styles.bookTitle}>{book.bookTitle}</div>
          {/* <div className={styles.bookTitle}>{book.bookSize}</div> */}

          <img
            className={styles.titleImage}
            src={book.bookImage}
            alt="Obrazek książki"
          />
          <div
            className={styles.iconContainer}
            onClick={(event) =>
              showModalHandlerForDeleteItem(
                {
                  itemId: book.itemId,
                  itemSize: book.bookSize,
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

    setAllItems(showAllBooks);
  }, [allBooks]);

  const setShowFileCategory = () => {
    props.setShowFileCategory();
  };

  return (
    <div className={styles.bookCategoryContainer}>
      <div className={styles.inputContainer}>
        <div className={styles.searchInput}>
          <p>Wyszukaj po tytule</p>
          <input
            type="text"
            value={sortTitleValue}
            onChange={sortTitleValueHandeler}
            className={styles.inputModal}
          />
        </div>
        <div className={styles.searchInput}>
          <p>Wyszukaj po autorze</p>
          <input
            type="text"
            value={sortAuthorValue}
            onChange={sortAuthorValueHandler}
            className={styles.inputModal}
          />
        </div>
      </div>
      <div className={styles.allBooksContainer}>
        {allSortBooks === null ? allItems : allSortBooks}
      </div>

      {showModalforDeleteItem && (
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

      <button className={styles.goBackButton} onClick={setShowFileCategory}>
        WRÓĆ DO WSZYSTKICH KATEGORII
      </button>
      {showModal ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <div className={styles.inputContainerForModal}>
              <p className={styles.textInfo}>
                WYBIERZ STRONĘ OD KTÓREJ CHCESZ ZACZĄĆ
              </p>
              <input
                type="number"
                value={pageSelectedByUser}
                onChange={pageSelectedByUserHandler}
                className={styles.inputModal}
              ></input>
            </div>
            <button
              disabled={modalButtonDisabled}
              className={styles.modalButton}
              onClick={() => goToBookGallery()}
            >
              Wyświetl Książkę
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ShowBookCategory;
