import React from "react";

const SelectTime = ({ setSeconds }) => {
  return (
    <div className="flex ml-5 -mt-2 scale-75 absolute">
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li>
          <button
            type="button"
            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
            onClick={() => setSeconds(900)}
          >
            15 min
          </button>
        </li>
        <li>
          <button
            type="button"
            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
            onClick={() => setSeconds(1800)}
          >
            30 minutes
          </button>
        </li>
        <li>
          <button
            type="button"
            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
            onClick={() => setSeconds(2700)}
          >
            45 minutes
          </button>
        </li>
        <li>
          <button
            type="button"
            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
            onClick={() => setSeconds(3600)}
          >
            1 hour
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SelectTime;
