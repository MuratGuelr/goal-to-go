import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaPen, FaEraser } from "react-icons/fa";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { motion } from "framer-motion";
import { RxOpacity } from "react-icons/rx";
import { MdOpacity } from "react-icons/md";
import { FaRegWindowMinimize } from "react-icons/fa";

const InfiniteCanvas = ({
  onRemove,
  tabTotal,
  timerID,
  position,
  setPosition,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [eraserMode, setEraserMode] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [changeOpacity, setChangeOpacity] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(385);
  const [canvasHeight, setCanvasHeight] = useState(460);
  const nodeRef = useRef(null);

  const handleResize = ({ size }) => {
    const { width, height } = size;
    setCanvasWidth(width);
    setCanvasHeight(height);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchNotes(timerID.toString());
        fetchUserPreferences(timerID.toString());
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const docRef = doc(db, user.uid, timerID.toString());
      const unsubscribe = onSnapshot(docRef, (doc) => {
        const data = doc.data();
        if (data) {
          setNotes(data.notes || []);
          setPosition(data.position || { x: 0, y: 0 });
          drawSavedNotes(data.notes || []);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const fetchNotes = async (user) => {
    const docRef = doc(db, user.uid, timerID.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setNotes(data.notes || []);
      setPosition(data.position || { x: 0, y: 0 });
      drawSavedNotes(data.notes || []);
    }
  };

  const fetchUserPreferences = async () => {
    const docRef = doc(db, "Preferences", timerID.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data) {
        setColor(data.color);
        setLineWidth(data.lineWidth);
      }
    }
  };

  const saveUserPreferences = async () => {
    const docRef = doc(db, "Preferences", timerID.toString());
    await setDoc(docRef, { color, lineWidth }, { merge: true });
  };

  useEffect(() => {
    if (user) {
      saveUserPreferences(timerID.toString());
    }
  }, [color, lineWidth, user, timerID.toString()]);

  const drawSavedNotes = (notesData) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    notesData.forEach((note) => {
      ctx.beginPath();
      const points = note.points;
      const firstPoint = points[0];
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        ctx.lineTo(point.x, point.y);
        ctx.lineWidth = point.lineWidth || 3;
        ctx.strokeStyle = point.color || "#000000";
        ctx.stroke();
      }
    });
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    const currentColor = eraserMode ? "#FFFFFF" : color;
    setNotes((prevNotes) => [
      ...prevNotes,
      {
        points: [
          { x: offsetX, y: offsetY, lineWidth: lineWidth, color: currentColor },
        ],
      },
    ]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    const lastNote = notes[notes.length - 1];
    const newNotes = [...notes];
    const currentColor = eraserMode ? "#FFFFFF" : color;
    setPosition({ x: offsetX, y: offsetY });
    newNotes[newNotes.length - 1] = {
      points: [
        ...lastNote.points,
        { x: offsetX, y: offsetY, lineWidth: lineWidth, color: currentColor },
      ],
    };
    setNotes(newNotes);

    ctx.beginPath();
    ctx.moveTo(
      lastNote.points[lastNote.points.length - 1].x,
      lastNote.points[lastNote.points.length - 1].y
    );
    ctx.lineTo(offsetX, offsetY);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = currentColor;
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (user) {
      const docRef = doc(db, user.uid, timerID.toString());
      setDoc(docRef, { notes, position }, { merge: true })
        .then(() => {})
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const clearCanvas = () => {
    setNotes([]);
    if (user) {
      const docRef = doc(db, user.uid, timerID.toString());
      setDoc(docRef, { notes: [] }, { merge: true });
    }
  };

  const handleLineWidthChange = (e) => {
    const size = e.target.value;
    setLineWidth(size);
    if (eraserMode) {
      setColor("#FFFFFF");
    }
  };

  const handleRemove = async () => {
    if (user) {
      const docRef = doc(db, user.uid, timerID.toString());
      const prefDocRef = doc(db, "Preferences", timerID.toString());

      try {
        await deleteDoc(docRef);
        await deleteDoc(prefDocRef);
        onRemove();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
    if (user) {
      const docRef = doc(db, user.uid, timerID.toString());
      setDoc(docRef, { position: { x: data.x, y: data.y } }, { merge: true })
        .then(() => {})
        .catch((error) => {
          toast.error(error);
        });
    }
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
        position={position}
        onStop={handleStop}
      >
        <div
          ref={nodeRef}
          className={`fixed z-90 border border-gray-500 shadow-lg bg-gray-700 rounded-tr-lg rounded-bl-lg flex ${
            changeOpacity ? "bg-opacity-50" : "bg-opacity-100"
          }`}
        >
          <ResizableBox
            width={385}
            height={minimized ? 39 : 460}
            minConstraints={[385, 460]}
            maxConstraints={[1920, 1080]}
            className="relative"
            onResize={handleResize}
          >
            <div>
              <div
                className={`handle bg-purple-800 text-white p-2 flex justify-between items-center cursor-grabbing ${
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
                  <span className="bg-purple-100 text-purple-500 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200 mr-2">
                    {tabTotal + 1}
                  </span>
                  <span className="text-sm">White Board</span>
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
                    onClick={handleRemove}
                  >
                    <span className="w-5 hover:text-slate-300">X</span>
                  </button>
                </div>
              </div>

              <div className={minimized ? "invisible" : ""}>
                <div className="m-auto mt-5 absolute">
                  <input
                    type="range"
                    value={lineWidth}
                    onChange={handleLineWidthChange}
                    min="1"
                    max="20"
                    className="h-2 w-28 bg-gray-800 rounded-lg appearance-none cursor-pointer dark:bg-gray-200 ml-8 mt-8"
                  />
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300 ml-2">
                    {lineWidth}
                  </span>
                </div>
                <div className="flex">
                  <div className="m-auto mt-5">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseOut={endDrawing}
                      width={canvasWidth - 50}
                      height={canvasHeight - 140}
                      className="rounded-lg mt-4 border border-gray-300 bg-white cursor-crosshair m-auto"
                    />

                    <div className="text-center mt-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="ml-2 mr-5 mt-2"
                      />

                      <button
                        onClick={() => setEraserMode(!eraserMode)}
                        className={`px-4 py-2 rounded-md text-white ${
                          eraserMode
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-purple-500 hover:bg-purple-600"
                        }`}
                      >
                        {eraserMode ? <FaEraser /> : <FaPen />}
                      </button>
                      <button
                        onClick={clearCanvas}
                        className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 ml-3"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    </motion.div>
  );
};

export default InfiniteCanvas;
