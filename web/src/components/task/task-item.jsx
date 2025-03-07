import { useDrag } from "react-dnd";
import PropTypes from "prop-types";

// Asignar un color de fondo según la prioridad
function getPriorityClass(priority) {
  switch (priority) {
    case "high":
      return "bg-red-500 text-white"; // Rojo para alta prioridad
    case "medium":
      return "bg-yellow-500 text-white"; // Amarillo para media prioridad
    case "low":
      return "bg-green-500 text-white"; // Verde para baja prioridad
    default:
      return "";
  }
}

function TaskItem({ task }) {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task._id, column: task.column }, // Enviar columna con la tarea
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-4 rounded shadow cursor-move mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">Due: {task.dueDate || "No date"}</p>

      {/* Mostrar el ícono de prioridad */}
      <span
        className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getPriorityClass(task.priority)}`}
      >
        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} {/* Capitalizar primera letra */}
      </span>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    priority: PropTypes.string.isRequired,
    column: PropTypes.string.isRequired, // Ahora las tareas también tienen la columna asignada
  }).isRequired,
};

export default TaskItem;
