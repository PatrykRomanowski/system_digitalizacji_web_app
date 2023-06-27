import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { myStorage } from "../firebase";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

import styles from "./addFileComponent.module.css";

const AddFileComponent = () => {
  const [files, setFiles] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const activeIdUser = useSelector((state) => state.userStatus.userId);
  const activeUserEmail = useSelector((state) => state.userStatus.userEmail);

  const docCategories = useSelector((state) => state.userStatus.docCategories);
  const reciperCategories = useSelector(
    (state) => state.userStatus.recipesCategories
  );

  const receiptCategoryComponent = reciperCategories.map((item) => {
    return <option value={item}>{item}</option>;
  });

  const docCategoryComponent = docCategories.map((item) => {
    return <option value={item}>{item}</option>;
  });

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
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

  const uploadFiles = () => {
    files.forEach((file) => {
      const childRef = ref(myStorage, `users/${activeIdUser}/${file.name}`);

      uploadBytes(childRef, file)
        .then(() => {
          getDownloadURL(childRef).then((url) => {
            console.log(`Plik ${file.name} został przesłany. URL: ${url}`);
          });
        })
        .catch((error) => {
          console.log(
            `Wystąpił błąd podczas przesyłania pliku ${file.name}: ${error}`
          );
        });
    });

    setFiles([]);
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
          <select className="inputStyle"> {receiptCategoryComponent}</select>{" "}
        </div>
      ) : selectedOption === "document" ? (
        <div className={styles.selectDocumentType}>
          <p className={styles.inputDocumentTypeDescription}>
            Wybierz podkategorię
          </p>
          <select className="inputStyle"> {docCategoryComponent} </select>{" "}
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
      <button className={styles.uploadFileButton} onClick={uploadFiles}>
        Wyslij
      </button>
    </div>
  );
};

export default AddFileComponent;
