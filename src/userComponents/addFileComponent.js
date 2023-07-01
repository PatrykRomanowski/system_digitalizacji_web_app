import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { myStorage, firebaseRealtime } from "../firebase";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

import styles from "./addFileComponent.module.css";
import { set, ref as refFirebaseRealtime, push } from "firebase/database";

const AddFileComponent = () => {
  const [files, setFiles] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [subTitlesOption, setSubtitlesOption] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [sendButtonDisabled, setSendButtonDisabled] = useState(true);
  const [modalButtonDisabled, setModalButtonDisabled] = useState(true);
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [receiptDescription, setReceiptDescription] = useState("");
  const [receiptValue, setReceiptValue] = useState(0);

  const activeIdUser = useSelector((state) => state.userStatus.userId);
  const discSpacesUse = useSelector((state) => state.userStatus.discSpacesUse);
  const allocatedDiscSpace = useSelector(
    (state) => state.userStatus.allocatedDiscSpace
  );

  const docCategories = useSelector((state) => state.userStatus.docCategories);
  const reciperCategories = useSelector(
    (state) => state.userStatus.recipesCategories
  );

  useEffect(() => {
    // walidowanie przycisku

    if (selectedOption && files[0]) {
      setSendButtonDisabled(false);
    } else {
      setSendButtonDisabled(true);
    }
  }, [files, selectedOption]);

  useEffect(() => {
    if (selectedOption === "books") {
      setModalButtonDisabled(true);
      if (bookAuthor && bookDescription && bookTitle) {
        setModalButtonDisabled(false);
      }
    } else if (selectedOption === "document") {
      setModalButtonDisabled(true);
      if (documentDescription) {
        setModalButtonDisabled(false);
      }
    } else if (selectedOption === "receipt") {
      setModalButtonDisabled(true);
      if (receiptValue && receiptDescription) {
        setModalButtonDisabled(false);
      }
    }
  }, [
    bookAuthor,
    bookTitle,
    bookDescription,
    receiptValue,
    receiptDescription,
    documentDescription,
  ]);

  const documentDescriptionHandler = (event) => {
    setDocumentDescription(event.target.value);
  };

  const receiptDescriptionHandler = (event) => {
    setReceiptDescription(event.target.value);
  };

  const receiptValueHandler = (event) => {
    setReceiptValue(event.target.value);
  };

  const booksDescriptionHandler = (event) => {
    setBookDescription(event.target.value);
  };

  const booksAuthorHandler = (event) => {
    setBookAuthor(event.target.value);
  };

  const booksTitleHandler = (event) => {
    setBookTitle(event.target.value);
  };

  const receiptCategoryComponent = reciperCategories.map((item) => {
    return <option value={item}>{item}</option>;
  });

  const docCategoryComponent = docCategories.map((item) => {
    return <option value={item}>{item}</option>;
  });

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubTitleOptionChange = (event) => {
    setSubtitlesOption(event.target.value);
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      // check file type and extension here
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        console.log(`Plik ${file.name} ma niepoprawny typ lub rozszerzenie`);
        return;
      }

      console.log(acceptedFiles);
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.filter((file) => !prevFiles.includes(file)),
      ]);
    });

    rejectedFiles.forEach((file) => {
      console.log(`Plik ${file.name} został odrzucony`);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const getFileSize = (file) => {
    // funkcja odczytująca rozmiar każdego pliku i przekształcająca go na Mb
    const fileSizeInBytes = file.size;
    const fileSizeInMb = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMb;
  };
  const uploadFiles = async () => {
    let preRefDataBase;
    let preRefRealtimeDatabase;

    const fileSizes = files.map((file) => getFileSize(file)); // odczytanie rozmiaru dla każdego pliku
    const totalSizeInBytes = fileSizes.reduce(
      (acc, currentSize) => acc + currentSize,
      0
    ); // suma wszystkich plików w bajtach
    const totalSizeInMB = totalSizeInBytes / (1024 * 1024); // przeliczenie na megabajty
    console.log("Total Size (MB):", totalSizeInMB);

    const firebaseRealtimeRef2 = refFirebaseRealtime(firebaseRealtime);

    if (selectedOption === "books") {
      preRefDataBase = `users/${activeIdUser}/books/`;
      preRefRealtimeDatabase = `users/${activeIdUser}/books/`;
    } else {
      preRefDataBase = `users/${activeIdUser}/${selectedOption}/${subTitlesOption}/`;
      preRefRealtimeDatabase = `users/${activeIdUser}/${selectedOption}/${subTitlesOption}/`;
    }
    const uniqueKey = push(firebaseRealtimeRef2).key;

    let data = {};
    if (selectedOption === "books") {
      data = {
        author: bookAuthor,
        title: bookTitle,
        description: bookDescription,
      };
    } else if (selectedOption === "document") {
      data = {
        description: documentDescription,
      };
    } else if (selectedOption === "receipt") {
      data = {
        description: receiptDescription,
        value: receiptValue,
      };
    }

    try {
      for (const file of files) {
        const refDataBase = `${preRefDataBase}/${uniqueKey}/${file.name}/`;
        const refRealtimeDatabase = `${preRefRealtimeDatabase}/${uniqueKey}/`;
        const childRef = ref(myStorage, refDataBase);
        const firebaseRealtimeRef = refFirebaseRealtime(
          firebaseRealtime,
          refRealtimeDatabase
        );

        await uploadBytes(childRef, file);
        const url = await getDownloadURL(childRef);

        await set(firebaseRealtimeRef, data);
        console.log(`Plik ${file.name} został przesłany. URL: ${url}`);
      }

      console.log("Opisy zostały dodane");
      setFiles([]);
    } catch (error) {
      console.log("Wystąpił błąd podczas przesyłania plików:", error);
    }
  };

  return (
    <div className={styles.addFileContainer}>
      <div className={styles.selectDocumentType}>
        <p className={styles.inputDocumentTypeDescription}>Wybierz kategorię</p>
        <select
          className="inputStyle"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="">Wybierz...</option>
          <option value="books">KSIĄŻKI</option>
          <option value="document">DOKUMENTY</option>
          <option value="receipt">PARAGONY</option>
        </select>
      </div>

      {selectedOption === "receipt" ? (
        <div className={styles.selectDocumentType}>
          <p className={styles.inputDocumentTypeDescription}>
            Wybierz podkategorię
          </p>
          <select onChange={handleSubTitleOptionChange} className="inputStyle">
            {receiptCategoryComponent}
          </select>
        </div>
      ) : selectedOption === "document" ? (
        <div className={styles.selectDocumentType}>
          <p className={styles.inputDocumentTypeDescription}>
            Wybierz podkategorię
          </p>
          <select onChange={handleSubTitleOptionChange} className="inputStyle">
            {docCategoryComponent}
          </select>
        </div>
      ) : null}

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
        style={{
          marginTop: "10px",
          borderWidth: isDragActive ? "2px" : "1px",
          borderColor: isDragActive ? "green" : "grey",
          borderStyle: "dashed",
          borderRadius: "5px",
          padding: "80px",
          backgroundColor: "lightgrey",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Upuść pliki tutaj...</p>
        ) : (
          <div>
            <p className="dropText">
              Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać plik
            </p>
            <p className="dropText">
              Akceptowane typy plików: .jpeg, .jpg, .png
            </p>
          </div>
        )}
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
      <button
        disabled={sendButtonDisabled}
        className={styles.uploadFileButton}
        onClick={openModal}
      >
        Wyslij
      </button>
      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            {selectedOption === "books" && (
              <div>
                <div className={styles.inputContainer}>
                  <p className={styles.textInfo}>Dodaj opis</p>
                  <input
                    type="text"
                    value={bookDescription}
                    onChange={booksDescriptionHandler}
                    className={styles.inputModal}
                  ></input>
                </div>
                <div className={styles.inputContainer}>
                  <p className={styles.textInfo}>autor</p>
                  <input
                    type="text"
                    value={bookAuthor}
                    onChange={booksAuthorHandler}
                    className={styles.inputModal}
                  ></input>
                </div>
                <div className={styles.inputContainer}>
                  <p className={styles.textInfo}>tytuł </p>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={booksTitleHandler}
                    className={styles.inputModal}
                  ></input>
                </div>
              </div>
            )}

            {selectedOption === "document" && (
              <div>
                <div className={styles.inputContainer}>
                  <p className={styles.textInfo}>Dodaj opis</p>
                  <input
                    type="text"
                    value={documentDescription}
                    onChange={documentDescriptionHandler}
                    className={styles.inputModal}
                  ></input>
                </div>
              </div>
            )}

            {selectedOption === "receipt" && (
              <div>
                <div className={styles.inputContainer}>
                  <p className={styles.textInfo}>Dodaj opis</p>
                  <input
                    type="text"
                    value={receiptDescription}
                    onChange={receiptDescriptionHandler}
                    className={styles.inputModal}
                  ></input>
                </div>
                <div className={styles.inputContainer}>
                  <p className={styles.textInfo}>Wartość</p>
                  <input
                    type="text"
                    value={receiptValue}
                    onChange={receiptValueHandler}
                    className={styles.inputModal}
                  ></input>
                </div>
              </div>
            )}

            <button
              disabled={modalButtonDisabled}
              className={styles.modalButton}
              onClick={uploadFiles}
            >
              Wyslij
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFileComponent;
