import React, { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaStop,
  FaConciergeBell,
  FaBellSlash,
  FaBell,
  FaWindowMinimize,
  FaWindowMaximize,
  FaWindowClose,
} from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { TiMediaPause } from "react-icons/ti";
import { HiMiniBellAlert } from "react-icons/hi2";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import SelectTime from "./SelectTime";
import bellSound from "../../public/countdown-sounds/cash-register.mp3";
import doneBell from "../../public/countdown-sounds/done-bell.mp3";
import memeBell from "../../public/countdown-sounds/meme-bell.mp3";
import startNotification from "../../public/notification-sound/start-notification.mp3";
import stopNotification from "../../public/notification-sound/stop-notification.mp3";
import Draggable from "react-draggable";
import { toast } from "react-toastify";

const BottomTime = () => {
  const [seconds, setSeconds] = useState(0);
  const [inputTime, setInputTime] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isBegan, setIsBegan] = useState(false);
  const [audio, setAudio] = useState(null);
  const [userDetails, setUserDetails] = useState("");
  const [activeBell, setActiveBell] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [closeApp, setCloseApp] = useState(false);
  const [maxed, setMaxed] = useState(false);
  const nodeRef = useRef(null);

  const startNotificationSound = new Audio(startNotification);
  const stopNotificationSound = new Audio(stopNotification);

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
    toast.success("The timer has started!");
    startNotificationSound.play();
  };

  const handleStop = () => {
    setIsActive(false);
    toast.success("The timer has stopped!");
    stopNotificationSound.play();
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setUserDetails(doc.data());
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Draggable nodeRef={nodeRef}>
      {closeApp ? (
        <div
          ref={nodeRef}
          className={
            minimized
              ? `fixed z-50 w-10 bg-gray-700 border border-gray-200 rounded-full shadow-lg  cursor-grabbing h-2 bottom-10 left-8`
              : `fixed z-50 w-10 bg-gray-700 border border-gray-200 rounded-full shadow-lg  cursor-grabbing top-3/4 left-8 ${
                  maxed ? "w-1/3 h-1/3" : ""
                }`
          }
        >
          <div className="bg-blue-800 text-white p-2 flex justify-between items-center rounded-full">
            <div className="flex space-x-2">
              <button
                className="w-6 h-6 flex justify-center items-center bg-red-500 rounded-full"
                onClick={() => {
                  setCloseApp(false);
                  setMinimized(false);
                }}
              >
                <FaWindowClose size={10} />
              </button>
            </div>
          </div>
          <div
            className={`flex-1 p-4 flex flex-col items-center justify-center ${
              minimized ? "invisible" : ""
            } ${maxed ? "scale-125 mt-12" : ""}`}
          >
            <SelectTime
              setSeconds={setSeconds}
              setInputTime={setInputTime}
              maxed={maxed}
            />
            <div
              className={`text-8xl text-center text-gray-800 dark:text-white mt-2 mb-4 ${
                maxed ? "text-8xl font-extrabold mt-8 mb-5" : ""
              }`}
            >
              {formatTime(seconds)}
            </div>

            <div className="flex gap-3">
              <button
                className={`w-8 h-8 flex justify-center items-center bg-green-500 text-white rounded-full ${
                  maxed ? " w-20 h-20 mt-2" : ""
                }`}
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
                className={`w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-md ${
                  maxed ? " w-20 h-20 mt-2" : ""
                }`}
                onClick={handleStop}
                disabled={!isActive}
              >
                <FaStop />
              </button>
              <button
                className={`w-8 h-8 flex justify-center items-center bg-yellow-500 text-white rounded-md ${
                  maxed ? " w-20 h-20 mt-2" : ""
                }`}
                onClick={handleReset}
                disabled={isActive && seconds > 0}
              >
                <GrPowerReset />
              </button>
            </div>
            <div
              className={`relative flex space-x-4 mt-4 ${
                maxed ? "mt-8 scale-125" : ""
              }`}
            >
              <FaConciergeBell
                className={
                  activeBell === bellSound
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(bellSound);
                  setAudio(new Audio(bellSound));
                }}
              />

              <HiMiniBellAlert
                className={
                  activeBell === doneBell
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(doneBell);
                  setAudio(new Audio(doneBell));
                }}
              />
              <FaBell
                className={
                  activeBell === memeBell
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(memeBell);
                  setAudio(new Audio(memeBell));
                }}
              />
              <FaBellSlash
                className={
                  activeBell === null
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(null);
                  setAudio(null);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={nodeRef}
          className={
            minimized
              ? `fixed z-50 w-72 bg-gray-700 border border-gray-200 rounded-lg shadow-lg  cursor-grabbing h-11 bottom-10 left-8`
              : `fixed z-50 w-72 bg-gray-700 border border-gray-200 rounded-lg shadow-lg  cursor-grabbing top-3/4 left-8 ${
                  maxed ? "w-1/3 h-1/3" : ""
                }`
          }
        >
          <div className="bg-blue-800 text-white p-2 flex justify-between items-center rounded-t-lg">
            <span className="text-sm">{userDetails.username}'s Timer App</span>
            <div className="flex space-x-2">
              <button className="w-4 h-4 flex justify-center items-center bg-yellow-500 rounded-full">
                <FaWindowMinimize
                  size={10}
                  onClick={
                    minimized
                      ? () => setMinimized(false)
                      : () => setMinimized(true)
                  }
                />
              </button>
              <button className="w-4 h-4 flex justify-center items-center bg-green-500 rounded-full">
                <FaWindowMaximize
                  size={10}
                  onClick={maxed ? () => setMaxed(false) : () => setMaxed(true)}
                />
              </button>
              <button
                className="w-4 h-4 flex justify-center items-center bg-red-500 rounded-full"
                onClick={() => {
                  setCloseApp(true);
                  setMinimized(true);
                }}
              >
                <FaWindowClose size={10} />
              </button>
            </div>
          </div>
          <div
            className={`flex-1 p-4 flex flex-col items-center justify-center ${
              minimized ? "invisible" : ""
            } ${maxed ? "scale-125 mt-12" : ""}`}
          >
            <SelectTime
              setSeconds={setSeconds}
              setInputTime={setInputTime}
              maxed={maxed}
            />
            <div
              className={`text-8xl text-center text-gray-800 dark:text-white mt-2 mb-4 ${
                maxed ? "text-8xl font-extrabold mt-8 mb-5" : ""
              }`}
            >
              {formatTime(seconds)}
            </div>

            <div className="flex gap-3">
              <button
                className={`w-8 h-8 flex justify-center items-center bg-green-500 text-white rounded-md ${
                  maxed ? " w-20 h-20 mt-2" : ""
                }`}
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
                className={`w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-md ${
                  maxed ? " w-20 h-20 mt-2" : ""
                }`}
                onClick={handleStop}
                disabled={!isActive}
              >
                <FaStop />
              </button>
              <button
                className={`w-8 h-8 flex justify-center items-center bg-yellow-500 text-white rounded-md ${
                  maxed ? " w-20 h-20 mt-2" : ""
                }`}
                onClick={handleReset}
                disabled={isActive && seconds > 0}
              >
                <GrPowerReset />
              </button>
            </div>
            <div
              className={`relative flex space-x-4 mt-4 ${
                maxed ? "mt-8 scale-125" : ""
              }`}
            >
              <FaConciergeBell
                className={
                  activeBell === bellSound
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(bellSound);
                  setAudio(new Audio(bellSound));
                }}
              />

              <HiMiniBellAlert
                className={
                  activeBell === doneBell
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(doneBell);
                  setAudio(new Audio(doneBell));
                }}
              />
              <FaBell
                className={
                  activeBell === memeBell
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(memeBell);
                  setAudio(new Audio(memeBell));
                }}
              />
              <FaBellSlash
                className={
                  activeBell === null
                    ? "text-gray-300 cursor-pointer"
                    : "text-gray-600 cursor-pointer hover:text-gray-400"
                }
                onClick={() => {
                  setActiveBell(null);
                  setAudio(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BottomTime;
