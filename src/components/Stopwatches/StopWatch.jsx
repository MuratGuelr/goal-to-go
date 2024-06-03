import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaStop, FaRegWindowMinimize } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { TiMediaPause } from "react-icons/ti";
import Draggable from "react-draggable";
import { toast } from "react-toastify";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { RxOpacity } from "react-icons/rx";
import { MdOpacity } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const Stopwatch = ({ onRemove, tabTotal }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBegan, setIsBegan] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [changeOpacity, setChangeOpacity] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleStart = () => {
    setIsActive(true);
    setIsBegan(true);
    toast.success("The stopwatch has started!");
  };

  const handleStop = () => {
    setIsActive(false);
    toast.success("The stopwatch has stopped!");
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setIsBegan(false);
    toast.success("The stopwatch has reset!");
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <motion.div
      ref={nodeRef}
      className={`fixed z-50 border border-gray-500 drop-shadow-2xl bg-gray-700 rounded-tr-lg rounded-bl-lg flex ${
        changeOpacity ? "bg-opacity-50" : "bg-opacity-100"
      }`}
      initial={{ opacity: 0, y: 500, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 20 }}
      exit={{ opacity: 0, y: 0, x: 20 }}
    >
      <Draggable nodeRef={nodeRef} bounds="parent" handle=".handle">
        <div
          ref={nodeRef}
          className={`fixed z-90 border border-gray-500 drop-shadow-2xl bg-gray-700 rounded-tr-lg rounded-bl-lg flex ${
            changeOpacity ? "bg-opacity-50" : "bg-opacity-100"
          }`}
        >
          <ResizableBox
            width={240}
            height={minimized ? 39 : 240}
            minConstraints={[220, 240]}
            maxConstraints={[600, 600]}
            className="relative"
          >
            <div>
              <div
                className={`handle bg-red-700 text-white p-2 flex justify-between items-center cursor-grabbing ${
                  changeOpacity ? "bg-opacity-50" : "bg-opacity-100"
                }`}
              >
                <div className="w-4 h-4 flex cursor-pointer ">
                  {changeOpacity ? (
                    <RxOpacity
                      className="text-white text-lg"
                      onClick={() => setChangeOpacity(false)}
                    />
                  ) : (
                    <MdOpacity
                      className="text-white text-lg"
                      onClick={() => setChangeOpacity(true)}
                    />
                  )}
                </div>
                <div>
                  <span className="bg-red-400 text-black text-xs font-medium px-2 py-0.5 rounded-full  dark:text-black mr-2">
                    {tabTotal + 1}
                  </span>
                  <span className="text-sm">Stopwatch</span>
                </div>
                <div className="flex space-x-2">
                  <button className="w-4 h-4 flex justify-center">
                    <FaRegWindowMinimize
                      size={12}
                      className="hover:text-slate-300"
                      onClick={
                        minimized
                          ? () => setMinimized(false)
                          : () => setMinimized(true)
                      }
                    />
                  </button>
                  <button
                    className="w-4 h-4 flex justify-center items-center"
                    onClick={onRemove}
                  >
                    <span className="w-5 hover:text-slate-300">X</span>
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {!minimized && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div
                      className={`flex-1 p-4 flex flex-col items-center justify-center ${
                        minimized ? "invisible" : ""
                      }`}
                    >
                      <div className="text-8xl text-center text-gray-800 dark:text-white mt-2 mb-4">
                        {formatTime(seconds)}
                      </div>

                      <div className="flex gap-3">
                        <button
                          className={`w-8 h-8 flex justify-center items-center bg-green-500 text-white rounded-md`}
                          onClick={handleStart}
                        >
                          {isActive ? (
                            <TiMediaPause className="scale-150" />
                          ) : (
                            <FaPlay />
                          )}
                        </button>
                        <button
                          className="w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-md"
                          onClick={handleStop}
                          disabled={!isActive}
                        >
                          <FaStop />
                        </button>
                        <button
                          className={`w-8 h-8 flex justify-center items-center bg-yellow-500 text-white rounded-md`}
                          onClick={handleReset}
                          disabled={isActive}
                        >
                          <GrPowerReset />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    </motion.div>
  );
};

export default Stopwatch;
