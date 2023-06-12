import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { myStorage } from "../firebase";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

const AddFileComponent = () => {
  const [files, setFiles] = useState([]);

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
      const childRef = ref(myStorage, "users/xd");

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
    <div>
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
      <button className="addPhotoButton" onClick={uploadFiles}>
        Wyślij
      </button>
    </div>
  );
};

export default AddFileComponent;
