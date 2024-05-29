import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const AvatarProfile = ({ url, bigClass }) => {
  const defaultImage = "/default-avatar.svg";
  const [userDetails, setUserDetails] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setUserDetails(doc.data());
          } else {
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <img
        id="avatarButton"
        type="button"
        data-dropdown-toggle="userDropdown"
        data-dropdown-placement="bottom-start"
        className={
          bigClass
            ? "w-38 h-38 rounded ml-3 border-2 border-blue-900 bg-white"
            : "w-12 h-12 rounded-full cursor-pointer ml-3 border-2 border-blue-900 bg-white hover:border-white transition-all scale-110"
        }
        src={userDetails.profilePicture}
      />
    </div>
  );
};

export default AvatarProfile;
