import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useBoard } from "../../contexts/board-context";
import { useTheme } from "../../contexts/dark-context"; // Importa el contexto del tema

function TaskForm({ onTaskAdded }) {
  const { columns, addTask } = useBoard();
  const { theme } = useTheme(); // Obtén el tema actual

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      dueDate: "",
      columnId: columns[0]?._id || "",
      priority: "low", // Prioridad por defecto
    },
  });

  const onSubmit = async (data) => {
    try {
      const column = columns.find((col) => col._id === data.columnId);
      if (!column) {
        throw new Error("Columna no encontrada");
      }

      const taskData = {
        title: data.title,
        dueDate: data.dueDate,
        priority: data.priority,
        columnId: data.columnId,
      };

      console.log("Datos enviados al backend:", taskData);
      await addTask(taskData); // Agregar la tarea
      reset(); // Reiniciar el formulario
      if (onTaskAdded) onTaskAdded(); // Llamar al callback si existe
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again."); // Notificar al usuario
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`p-6 rounded-lg shadow-lg border ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Campo de Título */}
      <label
        htmlFor="title"
        className={`block text-sm font-semibold ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }focus:ring-2 focus:ring-[#8079db]`}
      >
        Title
      </label>
      <input
        {...register("title", { required: "Title is required" })}
        id="title"
        type="text"
        className={`border ${
          theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-200" : "border-gray-300 bg-white text-gray-800"
        } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#8079db]`}
        aria-invalid={errors.title ? "true" : "false"}
      />
      {errors.title && (
        <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
      )}

      {/* Campo de Fecha de Vencimiento */}
      <label
        htmlFor="dueDate"
        className={`block text-sm font-semibold ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        } focus:ring-2 focus:ring-[#8079db] mt-4`}
      >
        Due Date
      </label>
      <input
        {...register("dueDate")}
        id="dueDate"
        type="date"
        className={`border ${
          theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-200" : "border-gray-300 bg-white text-gray-800"
        } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#8079db]`}
      />

      {/* Campo de Prioridad */}
      <label
        htmlFor="priority"
        className={`block text-sm font-semibold ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        } focus:ring-2 focus:ring-[#8079db] mt-4`}
      >
        Priority
      </label>
      <select
        {...register("priority")}
        id="priority"
        className={`border ${
          theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-200" : "border-gray-300 bg-white text-gray-800"
        } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#8079db]`}
      >
         <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Campo de Columna */}
      <label
        htmlFor="columnId"
        className={`block text-sm font-semibold ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        } focus:ring-2 focus:ring-[#8079db] mt-4`}
      >
        Column
      </label>
      <select
        {...register("columnId", { required: "Column is required" })}
        id="columnId"
        className={`border ${
          theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-200" : "border-gray-300 bg-white text-gray-800"
        } p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#8079db]`}
      >
        {columns.map((column) => (
          <option key={column._id} value={column._id}>
            {column.title}
          </option>
        ))}
      </select>

      {/* Botón de Envío */}
      <button
        type="submit"
        className={`bg-[#8079db] text-white font-semibold p-2 rounded-md mt-6 w-full hover:bg-[#5f4fb3] transition-colors ${
          theme === "dark" ? "hover:bg-[#4c3d8f]" : "hover:bg-[#5f4fb3]"
        }`}
      >
        Add Task
      </button>
    </form>
  );
}

TaskForm.propTypes = {
  onTaskAdded: PropTypes.func,
};

export default TaskForm;