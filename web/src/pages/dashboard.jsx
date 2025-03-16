import { useCallback, useEffect, useState } from "react";
import KanbanBoard from "../components/kanban/kanban-board";
import TasksDueToday from "../components/task/task-due-today";
import Navbar from "../components/ui/navbar/navbar";
import Sidebar from "../components/ui/sidebar";
import * as MykanApi from "../services/api-service";
import { useTheme } from "../contexts/dark-context"; 

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const { theme } = useTheme(); 

  console.log("Dashboard: Component rendered");

  useEffect(() => {
    console.log("Dashboard: useEffect triggered");

    const fetchTasks = async () => {
      try {
        const data = await MykanApi.listTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Función para actualizar las tareas
  const updateTasks = useCallback(async () => {
    try {
      const data = await MykanApi.listTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Navbar />
      <div
        className={`flex overflow-hidden space-x-6 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex-1 flex flex-col space-y-6">
          <div className="flex space-x-6">
            <TasksDueToday tasks={tasks} updateTasks={updateTasks} />
          </div>
          <KanbanBoard />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default Dashboard;