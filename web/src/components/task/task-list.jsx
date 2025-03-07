import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import TaskItem from "./task-item";
import * as MykanAPI from "../../services/api-service";

function TaskList({ column, tasks, onTaskMove }) {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: async (item) => {
      try {
        await MykanAPI.update(item.id, { columnId: column._id });
        onTaskMove();
      } catch (error) {
        console.error("Error moving task:", error);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const filteredTasks = tasks.filter((task) => task.columnId === column._id.toString());

  return (
    <div 
      ref={drop}
      className={`flex-1 min-w-[300px] p-4 bg-white rounded shadow 
        ${isOver ? "ring-2 ring-blue-500" : ""}`}
    >
      <h2 className="text-lg font-bold mb-2">{column.name}</h2>
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
        {filteredTasks.length === 0 && <p className="text-gray-500">No tasks</p>}
      </div>
    </div>
  );
}

TaskList.propTypes = {
  column: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTaskMove: PropTypes.func.isRequired,
};

export default TaskList;
