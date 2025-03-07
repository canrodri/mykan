import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

function TaskForm({ onTaskAdded, columns }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      dueDate: "",
      priority: "low",
      columnName: columns.length > 0 ? columns[0].title : "", // Valor predeterminado para columnId
    },
  });

  const onSubmit = (data) => {
    if (!data.columnName) {
      alert("Please select a column"); // Validación adicional
      return;
    }
    onTaskAdded(data); // Enviar los datos del formulario
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md mb-4 w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Add New Task</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium">Task Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            {...register("dueDate", { required: "Date is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select
            {...register("priority", { required: "Priority is required" })}
            className="w-full p-2 border rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Column</label>
          <select
            {...register("columnName", { required: "Column is required" })}
            className="w-full p-2 border rounded-md"
          >
            {columns.map((column) => (
              <option key={column.title} value={column.title}>
                {column.name}
              </option>
            ))}
          </select>
          {errors.columnName && <p className="text-red-500 text-sm">{errors.columnName.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

TaskForm.propTypes = {
  onTaskAdded: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
};
export default TaskForm;