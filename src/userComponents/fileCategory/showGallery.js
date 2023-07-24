import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";

import { listAll, ref, getDownloadURL } from "firebase/storage";

import { myStorage } from "../../firebase";

import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import styles from "./showGallery.module.css";

import { useSelector, useDispatch } from "react-redux";

const ShowGallery = () => {
  const [imageList, setImageList] = useState([]);

  const activeGalleryRef = useSelector(
    (state) => state.userStatus.actualGalleryRef
  );

  const navigate = useNavigate();

  const backHandler = () => {
    navigate("/userPanel");
  };

  useEffect(() => {
    const storageRef = ref(myStorage, activeGalleryRef);

    listAll(storageRef)
      .then((res) => {
        const imageUrls = res.items.map((item) =>
          getDownloadURL(item).then((url) => ({
            original: url,
            thumbnail: url,

            originalClass: "showPhoto",
            thumbnailClass: "showPhoto-thumbnail",
          }))
        );
        Promise.all(imageUrls).then((urls) => setImageList(urls));
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(activeGalleryRef);
  return (
    <div className={styles.showPhotosContainer}>
      <button className={styles.showPhotoButton} onClick={backHandler}>
        POWRÓT
      </button>
      <div className="custom-image-gallery">
        <ImageGallery
          items={imageList}
          showThumbnails={true}
          showFullscreenButton={true}
          showPlayButton={true}
          showNav={true}
          slideInterval={2000}
          thumbnailPosition="bottom"
        />
      </div>
    </div>
  );
};

export default ShowGallery;
