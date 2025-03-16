import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/dark-context";

const TasksDueToday = ({ tasks, updateTasks }) => {
  const [status, setStatus] = useState({ loading: true, error: null });
  const [isVisible, setIsVisible] = useState(true); 
  const { theme } = useTheme();


  // Actualizar tareas cuando el componente se monta o cuando updateTasks cambia
  useEffect(() => {
    console.log("TasksDueToday: useEffect ejecutado");

    const fetchTasks = async () => {
      try {
        console.log("TasksDueToday: Obteniendo tareas...");
        await updateTasks();
        setStatus({ loading: false, error: null });
      } catch (err) {
        console.error("Error al obtener las tareas:", err);
        setStatus({ loading: false, error: "Error al cargar las tareas. Inténtalo de nuevo más tarde." });
      }
    };

    fetchTasks();
  }, [updateTasks]);

  // Ocultar la notificación después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); 
    }, 5000); 
    return () => clearTimeout(timer);
  }, []); 


  // Filtrar tareas que vencen hoy
  const today = new Date().toLocaleDateString("en-CA"); // Formato YYYY-MM-DD
  const tasksDueToday = tasks.filter((task) => task.dueDate && task.dueDate === today);


  // Mostrar mensajes de carga o error
  if (status.loading) {
    return <p className="text-gray-500">Loading tasks...</p>;
  }

  if (status.error) {
    return <p className="text-red-500">{status.error}</p>;
  }

  // Si la notificación no está visible, no renderizar nada
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
    <div
      className={`rounded-lg border p-3 shadow-lg pointer-events-auto ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <div className="flex flex-row items-center">
        {/* Ícono de advertencia */}
        <div className="px-2">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-500 text-2xl" />
        </div>
        {/* Mensaje */}
        <div className="ml-2 mr-6">
          <span className={`font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}>
            Tasks Due Today
          </span>
          <span className={`block ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            You have <span className="font-bold">{tasksDueToday.length}</span> tasks due today.
          </span>
        </div>
        {/* Botón de cierre */}
        <button
          onClick={() => setIsVisible(false)}
          className={`${
            theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
          } focus:outline-none`}
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>
      </div>
    </div>
  </div>
  );
};

TasksDueToday.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired, // ID de la tarea
      title: PropTypes.string.isRequired, // Título de la tarea
      dueDate: PropTypes.string.isRequired, // Fecha de vencimiento
      columnId: PropTypes.string.isRequired, // ID de la columna
      priority: PropTypes.oneOf(["low", "medium", "high"]).isRequired, // Prioridad de la tarea
    })
  ).isRequired,
  updateTasks: PropTypes.func.isRequired, 
};

export default TasksDueToday;