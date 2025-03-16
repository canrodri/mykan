import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { useBoard } from "../../contexts/board-context";
import * as MykanApi from "../../services/api-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNavicon, faAngleDoubleDown, faAngleDoubleUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/dark-context";

function TaskItem({ task, targetColumnId }) {
  const { loadBoard } = useBoard();
  const { theme } = useTheme();


  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleMove = async () => {
    console.log("Task ID:", task._id); 
    console.log("New Column ID:", targetColumnId); 

    if (!task._id || !targetColumnId) {
      console.error("Task ID or Column ID is undefined");
      return;
    }

    try {
      await MykanApi.moveTask(task._id, targetColumnId); 
      await loadBoard(); // Recarga el tablero después de mover
    } catch (error) {
      console.error("Error moving task:", error.response?.data || error.message);
      alert("Failed to move task: " + (error.response?.data?.message || error.message));
    }
  };

   // Función para eliminar la tarea
   const handleDelete = async () => {
    if (!task._id) {
      console.error("Task ID is undefined");
      return;
    }

    try {
      await MykanApi.deleteTask(task._id); // Llama a la API para eliminar la tarea
      await loadBoard(); // Recarga el tablero después de eliminar
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
      alert("Failed to delete task: " + (error.response?.data?.message || error.message));
    }
  };


// Función para formatear la fecha en DD/MM/YYYY
const formatDueDate = (date) => {
  return new Date(date).toLocaleDateString("es-ES");
};

// Función para determinar la prioridad
const getPriorityIcon = (priority) => {
  switch (priority) {
    case "high":
      return <FontAwesomeIcon icon={faAngleDoubleUp} className="text-red-500" title="High Priority" />;
    case "medium":
      return <FontAwesomeIcon icon={faNavicon} className="text-yellow-500" title="Medium Priority" />;
    case "low":
    default:
      return <FontAwesomeIcon icon={faAngleDoubleDown} className="text-green-500" title="Low Priority" />;
  }
};

return (
  <div
      ref={drag}
      className={`p-5 rounded shadow-lg my-2 flex justify-between items-center ${
        isDragging ? "opacity-50" : ""
      } ${
        theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <div>
        <p className="font-roboto">{task.title}</p>
        {task.dueDate && (
          <p className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Due Date: {formatDueDate(task.dueDate)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {getPriorityIcon(task.priority)}

        {/* Botón de eliminar (papelera) */}
        <button
          onClick={handleDelete}
          className={`${
            theme === "dark" ? "text-gray-300 hover:text-red-500" : "text-[#c4d7dd] hover:text-red-700"
          } focus:outline-none`}
          title="Delete Task"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}
TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    priority: PropTypes.oneOf(["low", "medium", "high"]).isRequired,
  }).isRequired,
  targetColumnId: PropTypes.string.isRequired, 
};

export default TaskItem; 