import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { TiMediaPause } from "react-icons/ti";
import { FaConciergeBell } from "react-icons/fa";
import { FaBellSlash } from "react-icons/fa";
import { HiMiniBellAlert } from "react-icons/hi2";
import { FaBell } from "react-icons/fa";
import SelectTime from "./SelectTime";
import bellSound from "../../public/countdown-sounds/cash-register.mp3";
import doneBell from "../../public/countdown-sounds/done-bell.mp3";
import memeBell from "../../public/countdown-sounds/meme-bell.mp3";
import Draggable, { DraggableCore } from "react-draggable";

const BottomTime = () => {
  const [seconds, setSeconds] = useState(0);
  const [inputTime, setInputTime] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isBegan, setIsBegan] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
      if (audio) {
        playSound();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const playSound = () => {
    audio.play();
  };

  const handleStart = () => {
    setIsActive(true);
    setIsBegan(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setInputTime("");
    setIsBegan(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Draggable>
      <div className="fixed z-50 w-full h-36 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-16 left-1/2 dark:bg-gray-700 dark:border-gray-600 cursor-grabbing">
        <div>
          <FaConciergeBell
            className="absolute text-white cursor-pointer scale-150 right-24 top-8"
            onClick={() => setAudio(new Audio(bellSound))}
          />
          <FaBellSlash
            className="absolute text-white cursor-pointer scale-150 right-10 top-8"
            onClick={() => setAudio(null)}
          />
          <HiMiniBellAlert
            className="absolute text-white cursor-pointer scale-150 right-10 top-20"
            onClick={() => setAudio(new Audio(doneBell))}
          />
          <FaBell
            className="absolute text-white cursor-pointer scale-150 right-24 top-20"
            onClick={() => setAudio(new Audio(memeBell))}
          />
        </div>

        <SelectTime setSeconds={setSeconds} setInputTime={setInputTime} />
        <div className="h-full max-w-lg items-center justify-center">
          <div>
            <div className="col-span-1 mx-2 text-center text-8xl dark:text-white mt-1 mb-1 ml-5">
              {formatTime(seconds)}
            </div>
          </div>

          <div className="flex gap-3 items-center justify-center mt-1 ml-5">
            <button
              className="w-6 h-6 px-1 rounded-md bg-green-500 text-white dark:bg-green-700"
              onClick={handleStart}
              disabled={!seconds}
            >
              {isActive || !isBegan ? (
                <FaPlay />
              ) : (
                <TiMediaPause className="scale-150" />
              )}
            </button>
            <button
              className="w-6 h-6 px-1 rounded-md bg-red-500 text-white dark:bg-red-700"
              onClick={handleStop}
              disabled={!isActive}
            >
              <FaStop />
            </button>
            <button
              className="w-6 h-6 px-1 rounded-md bg-yellow-500 text-white dark:bg-yellow-700"
              onClick={handleReset}
              disabled={isActive && seconds > 0}
            >
              <GrPowerReset />
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default BottomTime;
