import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Stopwatch from "../components/Stopwatches/StopWatch";
import CountdownTimer from "../components/Countdowns/CountdownTimer";
import InfiniteCanvas from "../components/Canvas/InfiniteCanvas";
import MiniTools from "../components/MiniTools/MiniTools";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CreateGoal = () => {
  const [countdownTimers, setCountdownTimers] = useState([]);
  const [stopWatchTimers, setStopWatchTimers] = useState([]);
  const [infiniteCanvas, setInfiniteCanvas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionCountdown, setPositionCountdown] = useState({ x: 0, y: 0 });
  const [positionStopWatch, setPositionStopWatch] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const userToolsRef = collection(db, "tools");
    const q = query(
      userToolsRef,
      where("uid", "==", uid),
      where("removedAt", "==", null)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const countdowns = data.filter((tool) => tool.type === "countdown");
    const stopwatches = data.filter((tool) => tool.type === "stopwatch");
    const canvases = data.filter((tool) => tool.type === "canvas");
    setCountdownTimers(countdowns);
    setStopWatchTimers(stopwatches);
    setInfiniteCanvas(canvases);
  };

  const handleAddCountdownTimer = async () => {
    if (countdownTimers.length > 9) {
      toast.error("You can't add more than 10!");
    } else {
      const newTimer = {
        type: "countdown",
        createdAt: Date.now(),
        uid: user.uid,
        removedAt: null,
        positionCountdown,
      };
      const docRef = await addDoc(collection(db, "tools"), newTimer);
      setCountdownTimers([...countdownTimers, { id: docRef.id, ...newTimer }]);
    }
  };

  const handleAddStopWatchTimer = async () => {
    if (stopWatchTimers.length > 9) {
      toast.error("You can't add more than 10!");
    } else {
      const newTimer = {
        type: "stopwatch",
        createdAt: Date.now(),
        uid: user.uid,
        removedAt: null,
        positionStopWatch,
      };
      const docRef = await addDoc(collection(db, "tools"), newTimer);
      setStopWatchTimers([...stopWatchTimers, { id: docRef.id, ...newTimer }]);
    }
  };

  const handleAddInfiniteCanvas = async () => {
    if (infiniteCanvas.length > 9) {
      toast.error("You can't add more than 10!");
    } else {
      const newCanvas = {
        type: "canvas",
        createdAt: Date.now(),
        uid: user.uid,
        removedAt: null,
        position,
      };
      const docRef = await addDoc(collection(db, "tools"), newCanvas);
      setInfiniteCanvas([...infiniteCanvas, { id: docRef.id, ...newCanvas }]);
    }
  };

  const handleRemoveCountdownTimer = async (id) => {
    await deleteDoc(doc(db, "tools", id));
    setCountdownTimers(countdownTimers.filter((timer) => timer.id !== id));
  };

  const handleRemoveStopWatchTimer = async (id) => {
    await deleteDoc(doc(db, "tools", id));
    setStopWatchTimers(stopWatchTimers.filter((timer) => timer.id !== id));
  };

  const handleRemoveInfiniteCanvas = async (id) => {
    await deleteDoc(doc(db, "tools", id));
    setInfiniteCanvas(infiniteCanvas.filter((timer) => timer.id !== id));
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="dark:bg-gray-900 antialiased h-screen w-full">
      {countdownTimers.map((timer, index) => (
        <React.Fragment key={timer.id}>
          <CountdownTimer
            tabTotal={index}
            onRemove={() => handleRemoveCountdownTimer(timer.id)}
            positionCountdown={positionCountdown}
            setPositionCountdown={setPositionCountdown}
          />
        </React.Fragment>
      ))}

      {stopWatchTimers.map((timer, index) => (
        <React.Fragment key={timer.id}>
          <Stopwatch
            tabTotal={index}
            onRemove={() => handleRemoveStopWatchTimer(timer.id)}
            positionStopWatch={positionStopWatch}
            setPositionStopWatch={setPositionStopWatch}
          />
        </React.Fragment>
      ))}

      {infiniteCanvas.map((timer, index) => (
        <React.Fragment key={timer.id}>
          <InfiniteCanvas
            tabTotal={index}
            onRemove={() => handleRemoveInfiniteCanvas(timer.id)}
            timerID={timer.id}
            position={position}
            setPosition={setPosition}
          />
        </React.Fragment>
      ))}

      <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed bg-gray-700 cursor-pointer w-1/3 h-1/3 rounded-full flex">
        <div className="m-auto">
          <button type="button" onClick={handleModalToggle}>
            <img
              src="/logo-w.png"
              className="w-72 h-72 rounded-full bg-gray-500 p-8"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0"
            tabIndex="-1"
          >
            <div className="text-center">
              <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute bg-gray-800 cursor-pointer rounded-lg flex p-12">
                <div className="relative w-full">
                  <button
                    className="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-100"
                    onClick={handleModalToggle}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <span className="text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    Tools
                  </span>
                  <div className="flex flex-wrap justify-center gap-5 mt-5">
                    <div
                      onClick={handleAddCountdownTimer}
                      className="transition transform hover:scale-110"
                    >
                      <MiniTools URL={"/tools/countdown-timer.jpg"} />
                    </div>
                    <div
                      onClick={handleAddStopWatchTimer}
                      className="transition transform hover:scale-110"
                    >
                      <MiniTools URL={"/tools/stopwatch.jpg"} />
                    </div>
                    <div
                      onClick={handleAddInfiniteCanvas}
                      className="transition transform hover:scale-110"
                    >
                      <MiniTools URL={"/tools/white-board.jpg"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateGoal;
