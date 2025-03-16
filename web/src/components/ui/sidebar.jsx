import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { useBoard } from "../../contexts/board-context";
import Dailytasks from "../../components/task/daily-tasks";
import * as MykanApi from "../../services/api-service"
import { useTheme } from "../../contexts/dark-context";

ChartJS.register(ArcElement, Tooltip);

const Sidebar = () => {
  const { tasks } = useBoard();
  const { theme } = useTheme()
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, todo: 0 });

  const fetchStats = async () => {
    try {
      const data = await MykanApi.getTaskStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [tasks]);

  // Calcular el porcentaje de tareas completadas
  const totalTasks = stats.completed + stats.inProgress + stats.todo;
  const completedPercentage = totalTasks > 0 ? (stats.completed / totalTasks) * 100 : 0;

  // Datos para el gráfico de medio donut (solo tareas completadas)
  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        label: "Tasks",
        data: [stats.completed, totalTasks - stats.completed],
        backgroundColor: ["#8079db", "#B9A8D2"], // Morado principal y terciario
        hoverBackgroundColor: ["#981AE2", "#B9A8D2"],
        borderWidth: 0, // Elimina el borde del gráfico
        circumference: 180, // Medio círculo (180 grados)
        rotation: -90, // Rota el gráfico para que comience desde la parte superior
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico se ajuste al contenedor
    animation: {
      animateRotate: false, // Desactiva la animación de rotación
      animateScale: false, // Desactiva la animación de escala
    },
    hover: {
      mode: "nearest", // Cambia el comportamiento del hover
      intersect: true, // Activa la intersección con el gráfico
    },
    plugins: {
      legend: {
        display: false, // Oculta la leyenda
      },
      tooltip: {
        enabled: false,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`; // Personaliza el texto del tooltip
          },
        },
      },
    },
  };

  return (
    <div>
    <div>
      <Dailytasks />
    </div>

    {/* Contenedor del progreso del proyecto */}
    <div
      className={`w-64 p-6 mr-2 rounded-lg shadow-lg border ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } mt-3`}
    >
      <h2
        className={`text-xl text-center font-roboto-condensed font-bold mb-4 mt-4 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Project Progress
      </h2>

      {/* Gráfico de medio donut */}
      <div className="mb-1 h-35 relative">
        <Doughnut data={data} options={options} />
      </div>

      {/* Porcentaje y texto "Tasks Completed" */}
      <div className="text-center mb-6 font-roboto-condensed">
        <span className="text-3xl text-[#981AE2]">
          {completedPercentage.toFixed(0)}%
        </span>
        <p className="text-sm text-[#981AE2] mt-1">Tasks Completed</p>
      </div>

      {/* Sección con el número de tareas */}
      <div className="space-y-3">
        {/* To Do */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#3C36B9]"></div>
            <span
              className={`text-sm font-light ${
                theme === "dark" ? "text-gray-200" : "text-[#3C36B9]"
              }`}
            >
              To Do
            </span>
          </div>
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {stats.todo}
          </span>
        </div>

        {/* Completed */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#981AE2]"></div>
            <span
              className={`text-sm font-light ${
                theme === "dark" ? "text-gray-200" : "text-[#981AE2]"
              }`}
            >
              Completed
            </span>
          </div>
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {stats.completed}
          </span>
        </div>

        {/* In Progress */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#B9A8D2]"></div>
            <span
              className={`text-sm font-light ${
                theme === "dark" ? "text-gray-200" : "text-[#B9A8D2]"
              }`}
            >
              In Progress
            </span>
          </div>
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {stats.inProgress}
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Sidebar;