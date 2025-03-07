import { useState } from "react";
import TaskForm from "../../task/task-form";

function Navbar() {
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center bg-[#555974] p-4 shadow-md">
        <div className="text-xl font-bold text-white">Logo</div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-[radial-gradient(circle,_at_center,_rgb(70,60,80)_0%,_rgb(116,32,216)_35%)] 
            px-4 py-2 rounded hover:bg-[#7420d8] transition duration-300 text-white"
        >
          + New Task
        </button>
      </nav>

   {/* add task from navbar */}
      {showTaskForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create New Task</h2>
            <TaskForm onTaskAdded={() => setShowTaskForm(false)} />
            <button
              onClick={() => setShowTaskForm(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
