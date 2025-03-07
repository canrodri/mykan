import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskForm from "../../components/task/task-form";
import TaskList from "../../components/task/task-list";
import * as MykanApi from "../../services/api-service";

function KanbanBoard() {
  const [columns] = useState([
    { name: "To Do", id: "to-do" },
    { name: "In Progress", id: "in-progress" },
    { name: "Completed", id: "completed" },
  ]);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = async () => {
    try {
      const data = await MykanApi.list();
      console.log("Datos del tablero:", data);

      const tasks = data?.columns?.flatMap((column) => column.tasks || []) || [];
      setTasks(tasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const addTask = async (taskData) => {
    try {
      const columnName = taskData.columnName;
      if (!columnName) throw new Error("No column selected");

      await MykanApi.createCard(columnName, taskData);
      console.log("Tarea creada con éxito");
      
      await loadBoard();
      setShowTaskForm(false);
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col min-h-screen p-6">
        {showTaskForm && <TaskForm onTaskAdded={addTask} columns={columns} />}

        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          {showTaskForm ? "Cancel" : "Add Task"}
        </button>

        <div className="flex space-x-4 overflow-x-auto">
          {columns.map((column) => (
            <TaskList
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.columnName === column.id)}
              onTaskMove={loadBoard}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
