// task-list.jsx
import PropTypes from "prop-types";
import { useDrop } from "react-dnd"; 
import TaskItem from "./task-item";
import { useBoard } from "../../contexts/board-context";
import * as MykanApi from "../../services/api-service";
import { useTheme } from "../../contexts/dark-context";


function TaskList({ column }) {
  const { tasks, loadBoard } = useBoard();
  const { theme } = useTheme();

  // Filtramos las tareas que pertenecen a la columna actual
  const filteredTasks = tasks.filter((task) => task.columnId === column._id);
  

  // useDrop para manejar el drop de las tareas
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK", 
    drop: (item) => handleMove(item.task, column._id), 
    collect: (monitor) => ({
      isOver: monitor.isOver(), 
    }),
  }));

  const handleMove = async (task, newColumnId) => {
    try {
      await MykanApi.moveTask(task._id, newColumnId); 
      await loadBoard();
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  return (
<div
      ref={drop}
      className={`p-4 rounded-lg shadow-xl w-1/3 border ${
        isOver ? "border-blue-500" : theme === "dark" ? "border-gray-700" : "border-gray-200"
      } ${
        theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
      }`}
    >
      <h2 className={`font-bold text-2xl font-roboto-condensed ${
        theme === "dark" ? "text-gray-200" : "text-gray-800"
      }`}>
        {column.title}
      </h2>
      {filteredTasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
}

// Validación de props
TaskList.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    _id:PropTypes.string.isRequired,
  }).isRequired,
};

export default TaskList;
