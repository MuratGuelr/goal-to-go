import React from "react";

const AvatarProfile = ({ url = "/default-avatar.svg", bigClass }) => {
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
        src={url}
      />
    </div>
  );
};

export default AvatarProfile;
