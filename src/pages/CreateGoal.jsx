import React, { useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import MiniCountdownTimer from "../components/MiniCountdownTimer";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Stopwatch from "../components/StopWatch";
import MiniStopWatch from "../components/MiniStopWatch";

const CreateGoal = () => {
  const [countdownTimers, setCountdownTimers] = useState([]);
  const [stopWatchTimers, setStopWatchTimers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCountdownTimer = () => {
    if (countdownTimers.length > 9) {
      toast.error("You can't add more than 10!");
    } else {
      setCountdownTimers([...countdownTimers, { id: Date.now() }]);
    }
  };

  const handleAddStopWatchTimer = () => {
    if (stopWatchTimers.length > 9) {
      toast.error("You can't add more than 10!");
    } else {
      setStopWatchTimers([...stopWatchTimers, { id: Date.now() }]);
    }
  };

  const handleRemoveCountdownTimer = (id) => {
    setCountdownTimers(countdownTimers.filter((timer) => timer.id !== id));
  };

  const handleRemoveStopWatchTimer = (id) => {
    setStopWatchTimers(stopWatchTimers.filter((timer) => timer.id !== id));
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
          />
        </React.Fragment>
      ))}

      {stopWatchTimers.map((timer, index) => (
        <React.Fragment key={timer.id}>
          <Stopwatch
            tabTotal={index}
            onRemove={() => handleRemoveStopWatchTimer(timer.id)}
          />
        </React.Fragment>
      ))}

      <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed bg-gray-700 cursor-pointer w-1/3 h-1/3 rounded-full flex">
        <div className="m-auto">
          <button
            data-modal-target="popup-modal"
            data-modal-toggle="popup-modal"
            type="button"
            onClick={handleModalToggle}
          >
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
            id="popup-modal"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0"
            tabIndex="-1"
          >
            <div className="text-center">
              <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute bg-gray-800 cursor-pointer p-5 rounded-lg flex w-2/4">
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
                  <span className="text-7xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    Tools
                  </span>
                  <div className="flex flex-wrap justify-center align-middle mt-4 ">
                    <div
                      onClick={handleAddCountdownTimer}
                      className="transition transform hover:scale-110"
                    >
                      <MiniCountdownTimer />
                    </div>
                    <div
                      onClick={handleAddStopWatchTimer}
                      className="transition transform hover:scale-110"
                    >
                      <MiniStopWatch />
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
