import React from "react";
import {
  FaPlay,
  FaStop,
  FaConciergeBell,
  FaBellSlash,
  FaBell,
  FaRegWindowMinimize,
} from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { HiMiniBellAlert } from "react-icons/hi2";
import { RxOpacity } from "react-icons/rx";

const MiniCountdownTimer = () => {
  return (
    <div className="border border-gray-500 drop-shadow-2xl bg-gray-700 rounded-tr-lg rounded-bl-lg bg-opacity-100  w-60 scale-90">
      <div>
        <div className="bg-blue-800 text-white p-2 flex justify-between items-center rounded-tr-lg  cursor-grabbing bg-opacity-100">
          <div className="w-4 h-4 justify-center cursor-pointer">
            <RxOpacity className="text-white text-lg" />
          </div>
          <span className="text-sm">Countdown Timer</span>
          <div className="flex space-x-2">
            <button className="w-4 h-4 flex justify-center">
              <FaRegWindowMinimize size={12} />
            </button>
            <button className="w-4 h-4 flex justify-center items-center">
              <span className="w-5">X</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <div className="text-8xl text-center text-gray-800 dark:text-white mt-2 mb-4">
            0:00
          </div>

          <div className="flex gap-3">
            <button className="w-8 h-8 flex justify-center items-center bg-green-500 text-white rounded-md">
              <FaPlay />
            </button>
            <button className="w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-md">
              <FaStop />
            </button>
            <button className="w-8 h-8 flex justify-center items-center bg-yellow-500 text-white rounded-md">
              <GrPowerReset />
            </button>
          </div>
          <div className="relative flex space-x-4 mt-4">
            <FaConciergeBell className="text-gray-300 cursor-pointer" />

            <HiMiniBellAlert className="text-gray-300 cursor-pointer" />
            <FaBell className="text-gray-300 cursor-pointer" />
            <FaBellSlash className="text-gray-300 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCountdownTimer;
