import React from "react";
import { FaPlay, FaStop, FaRegWindowMinimize } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import "react-resizable/css/styles.css";
import { RxOpacity } from "react-icons/rx";

const MiniStopWatch = () => {
  return (
    <div className="border border-gray-500 drop-shadow-2xl bg-gray-700 rounded-tr-lg rounded-bl-lg bg-opacity-100  w-60 scale-90 h-full">
      <div>
        <div className="bg-red-700 text-white p-2 flex justify-between items-center rounded-tr-lg  cursor-grabbing bg-opacity-100">
          <div className="w-4 h-4 flex cursor-pointer ">
            <RxOpacity className="text-white text-lg" />
          </div>
          <div>
            <span className="text-sm">Stopwatch</span>
          </div>
          <div className="flex space-x-2">
            <button className="w-4 h-4 flex justify-center">
              <FaRegWindowMinimize size={12} />
            </button>
            <button className="w-4 h-4 flex justify-center items-center">
              <span className="w-5 hover:text-slate-300">X</span>
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
        </div>
      </div>
    </div>
  );
};

export default MiniStopWatch;
