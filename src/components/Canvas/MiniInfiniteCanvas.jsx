import { MdDelete } from "react-icons/md";
import { FaEraser } from "react-icons/fa";
import { RxOpacity } from "react-icons/rx";
import { FaRegWindowMinimize } from "react-icons/fa";

const InfiniteCanvas = () => {
  return (
    <div className="fixed z-90 border border-gray-500 shadow-lg bg-gray-700 rounded-tr-lg rounded-bl-lg flex">
      <div>
        <div className="handle bg-purple-800 text-white p-2 flex justify-between items-center cursor-grabbing">
          <div className="w-4 h-4 flex cursor-pointer">
            <RxOpacity className="text-white text-lg" />
          </div>

          <div>
            <span className="bg-purple-100 text-purple-500 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200 mr-2">
              {1}
            </span>
            <span className="text-sm">White Board</span>
          </div>
          <div className="flex space-x-2">
            <button className="w-4 h-4 flex justify-center">
              <FaRegWindowMinimize size={12} className="hover:text-slate-300" />
            </button>
            <button className="w-4 h-4 flex justify-center items-center">
              <span className="w-5 hover:text-slate-300">X</span>
            </button>
          </div>
        </div>

        <div>
          <div className="m-auto mt-5 absolute">
            <input
              type="range"
              min="1"
              max="20"
              className="h-2 w-28 bg-gray-800 rounded-lg appearance-none cursor-pointer dark:bg-gray-200 ml-8 mt-8"
            />
            <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300 ml-2"></span>
          </div>
          <div className="flex">
            <div className="m-auto mt-5">
              <canvas className="rounded-lg mt-4 border border-gray-300 bg-white cursor-crosshair m-auto" />

              <div className="text-center mt-2">
                <input type="color" className="ml-2 mr-5 mt-2" />

                <button className="px-4 py-2 rounded-md text-white">
                  <FaEraser />
                </button>
                <button className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 ml-3">
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteCanvas;
