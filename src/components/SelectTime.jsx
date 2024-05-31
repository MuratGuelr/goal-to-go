import React, { useState } from "react";

const SelectTime = ({ setSeconds, maxed }) => {
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);

  return (
    <div className={maxed ? "scale-100 -mb-5 mt-3" : "scale-75"}>
      <ul className="text-sm text-gray-700 dark:text-gray-200 flex gap-5">
        <li>
          <button
            type="button"
            className={
              isActive
                ? "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-200"
                : "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-400"
            }
            role="menuitem"
            onClick={() => {
              setSeconds(900);
              setIsActive(true);
              setIsActive2(false);
              setIsActive3(false);
              setIsActive4(false);
            }}
          >
            15 min
          </button>
        </li>
        <li>
          <button
            type="button"
            className={
              isActive2
                ? "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-200"
                : "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-400"
            }
            role="menuitem"
            onClick={() => {
              setSeconds(1800);
              setIsActive(false);
              setIsActive2(true);
              setIsActive3(false);
              setIsActive4(false);
            }}
          >
            30 min
          </button>
        </li>
        <li>
          <button
            type="button"
            className={
              isActive3
                ? "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-200"
                : "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-400"
            }
            role="menuitem"
            onClick={() => {
              setSeconds(2700);
              setIsActive(false);
              setIsActive2(false);
              setIsActive3(true);
              setIsActive4(false);
            }}
          >
            45 min
          </button>
        </li>
        <li>
          <button
            type="button"
            className={
              isActive4
                ? "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-200"
                : "text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white p-1 rounded-md dark:text-gray-400"
            }
            role="menuitem"
            onClick={() => {
              setSeconds(3600);
              setIsActive(false);
              setIsActive2(false);
              setIsActive3(false);
              setIsActive4(true);
            }}
          >
            1 hrs
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SelectTime;
