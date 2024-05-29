import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const ListImages = () => {
  const [images, setImages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [userUid, setUserUid] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setUserDetails(doc.data());
            setUserUid(user.uid);
          } else {
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userDetails) {
      const storage = getStorage();
      const storageRef = ref(storage, userUid);

      listAll(storageRef)
        .then((res) => {
          const promises = res.items.map((itemRef) => getDownloadURL(itemRef));
          Promise.all(promises)
            .then((urls) => {
              setImages(urls);
            })
            .catch((error) => {
              console.error("Error getting download URLs:", error);
            });
        })
        .catch((error) => {
          console.error("Error listing images:", error);
        });
    }
  }, [userDetails]);

  return (
    <div className="flex gap-5">
      {images.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`User ${index + 1} image`}
          className="h-14 cursor-pointer hover:ring"
        />
      ))}
    </div>
  );
};

export default ListImages;
