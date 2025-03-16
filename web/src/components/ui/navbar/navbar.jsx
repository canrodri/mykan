import { useState } from "react";
import TaskForm from "../../task/task-form";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/logo-mykan.png";
import { useTheme } from "../../../contexts/dark-context";

function Navbar() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Barra de navegación */}
      <nav className={`flex justify-between items-center ${
        theme === "dark" ? "dark:bg-gray-800" : "bg-[#8079db]"
      } p-4 shadow-md rounded-xl mx-2 mt-1`}>
        {/* Logo */}
        <div className="text-xl font-bold text-white dark:text-gray-200">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        {/* Contenedor para los botones (derecha) */}
        <div className="flex items-center space-x-2">
          {/* Botón para cambiar el tema */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl text-white ${
            theme === "dark" ? "dark:bg-gray-700 dark:hover:bg-gray-600" : "bg-[#8079db] hover:bg-[#7420d8]"}`}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* Botón para abrir el formulario de nueva tarea */}
          <button
            onClick={() => setShowTaskForm(true)}
            className={` px-4 py-2 rounded-lg  transition duration-300 text-white
            ${theme === "dark" ? " dark:bg-gray-700  dark:hover:bg-gray-600" : "bg-[#8079db] hover:bg-[#7420d8]" }` }
          >
            + New Task
          </button>
        </div>
      </nav>

      {/* Formulario de nueva tarea (modal) */}
      {showTaskForm && (
        <div className={ `fixed inset-0 flex items-center justify-center z-50 ${
        theme === "dark" ? "dark:backdrop-blur-[6px]" : "backdrop-blur-[6px]"}`
      }>

          <div className={`relative p-6 rounded-lg shadow-lg w-96 ${
          theme === "dark" ? "dark:bg-gray-800" : "bg-gray-200"}`
          }>
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => setShowTaskForm(false)}
              className="absolute top-2 right-2 px-2 py-1 text-gray-800 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>

            {/* Título del modal */}
            <h2 className={`text-lg mb-5 mt-5 text-center ${
          theme === "dark" ? "dark:text-gray-400" : "text-black"}`
          }>
              Create New Task
            </h2>

            {/* Formulario de tarea */}
            <TaskForm onTaskAdded={() => setShowTaskForm(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;