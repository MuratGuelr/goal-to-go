import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AvatarProfile from "./AvatarProfile";
import { auth, db } from "../firebase/firebase";
import { getDoc, doc } from "firebase/firestore";

const Navbar = () => {
  const [userDetails, setUserDetails] = useState(null);

  const [loggedIn, setLoggedIn] = useState("");

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
      } else {
        setLoggedIn("User is not logged in!");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const isLinkActive = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 ml-3"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 ml-3";

  return (
    <nav className="bg-blue-600 border-b border-blue-600">
      <div className="mx-auto max-w-7x1 px-2 sm:px-6 lg:px8">
        <div className="flex h-20 items-center justify-between">
          <NavLink className="flex flex-shrink-0 items-center" to="/">
            <img src="/logo-w.png" className="h-10 w-auto" alt="logo" />
            <span className="hidden md:block text-white text-2xl font-bold ml-3 ">
              Goal To Go{" "}
            </span>
          </NavLink>
          <div className="md:ml-auto">
            <div className="flex items-center">
              <NavLink to="/" className={isLinkActive}>
                Home
              </NavLink>
              {userDetails && (
                <NavLink to="create-goal" className={isLinkActive}>
                  Create Goal
                </NavLink>
              )}

              {!userDetails && (
                <>
                  <NavLink to="login" className={isLinkActive}>
                    Login
                  </NavLink>
                  <NavLink to="sign-up" className={isLinkActive}>
                    Sign up
                  </NavLink>
                </>
              )}
              {userDetails && (
                <NavLink to="/profile">
                  {userDetails.profilePicture && (
                    <AvatarProfile url={userDetails.profilePicture} />
                  )}
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
