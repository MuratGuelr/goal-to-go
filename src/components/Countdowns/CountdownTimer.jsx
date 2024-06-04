import React, { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaStop,
  FaConciergeBell,
  FaBellSlash,
  FaBell,
  FaRegWindowMinimize,
} from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { TiMediaPause } from "react-icons/ti";
import { HiMiniBellAlert } from "react-icons/hi2";
import SelectTime from "./SelectTime";
import bellSound from "/countdown-sounds/cash-register.mp3";
import doneBell from "/countdown-sounds/done-bell.mp3";
import memeBell from "/countdown-sounds/meme-bell.mp3";
import startNotification from "/notification-sound/start-notification.mp3";
import stopNotification from "/notification-sound/stop-notification.mp3";
import Draggable from "react-draggable";
import { toast } from "react-toastify";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { RxOpacity } from "react-icons/rx";
import { MdOpacity } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const CountdownTimer = ({
  onRemove,
  tabTotal,
  positionCountdown,
  setPositionCountdown,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [inputTime, setInputTime] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isBegan, setIsBegan] = useState(false);
  const [audio, setAudio] = useState(null);
  const [activeBell, setActiveBell] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [user, setUser] = useState(null);
  const [changeOpacity, setChangeOpacity] = useState(false);

  const nodeRef = useRef(null);

  const startNotificationSound = new Audio(startNotification);
  const stopNotificationSound = new Audio(stopNotification);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    if (user) {
      updatePositionCountdownInFirestore(user.uid, positionCountdown);
    }
  }, [positionCountdown, user]);

  const updatePositionCountdownInFirestore = async (uid, newPosition) => {
    const userToolsRef = collection(db, "tools");
    const q = query(
      userToolsRef,
      where("uid", "==", uid),
      where("type", "==", "countdown")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      if (doc.exists()) {
        await updateDoc(doc.ref, {
          positionCountdown: newPosition,
        });
      } else {
        console.error("Belge bulunamadı!");
      }
    });
  };

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

  const getPosition = (e, data) => {
    setPositionCountdown({ x: data.x, y: data.y });
  };

  return (
    <motion.div
      ref={nodeRef}
      className={`fixed z-50 border border-gray-500 shadow-lg bg-gray-700 rounded-tr-lg rounded-bl-lg flex ${
        changeOpacity ? "bg-opacity-50" : "bg-opacity-100"
      }`}
      initial={{ opacity: 0, y: 500, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 20 }}
      exit={{ opacity: 0, y: 0, x: 20 }}
    >
      <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        handle=".handle"
        position={positionCountdown}
        onStop={getPosition}
      >
        <div
          ref={nodeRef}
          className={`fixed z-90 border border-gray-500 shadow-lg bg-gray-700 rounded-tr-lg rounded-bl-lg flex ${
            changeOpacity ? "bg-opacity-50" : "bg-opacity-100"
          }`}
        >
          <ResizableBox
            width={270}
            height={minimized ? 39 : 320}
            minConstraints={[270, 320]}
            maxConstraints={[600, 600]}
            className="relative"
          >
            <div>
              <div
                className={`handle bg-blue-800 text-white p-2 flex justify-between items-center cursor-grabbing ${
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
                  <span className="bg-blue-100 text-blue-500 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200 mr-2">
                    {tabTotal + 1}
                  </span>
                  <span className="text-sm">Countdown Timer</span>
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
                    <div className="flex-1 p-4 flex flex-col items-center justify-center">
                      {!isActive && (
                        <SelectTime
                          setSeconds={setSeconds}
                          setInputTime={setInputTime}
                        />
                      )}

                      <div className="text-8xl text-center text-gray-800 dark:text-white mt-2 mb-4">
                        {formatTime(seconds)}
                      </div>

                      <div className="flex gap-3">
                        <button
                          className={`w-8 h-8 flex justify-center items-center bg-green-500 text-white rounded-md`}
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
                          className="w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-md"
                          onClick={handleStop}
                          disabled={!isActive}
                        >
                          <FaStop />
                        </button>
                        <button
                          className={`w-8 h-8 flex justify-center items-center bg-yellow-500 text-white rounded-md`}
                          onClick={handleReset}
                          disabled={isActive && seconds > 0}
                        >
                          <GrPowerReset />
                        </button>
                      </div>
                      <div className="relative flex space-x-4 mt-4">
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

export default CountdownTimer;
