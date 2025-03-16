import PropTypes from "prop-types"; 
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as MykanApi from "../services/api-service";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = useCallback(async () => {
    try {
      const board = await MykanApi.getBoard();
      const tasks = await MykanApi.listTasks();
      setColumns(board.columns || []);
      setTasks(tasks || []);
    } catch (error) {
      console.error("Error loading board:", error);
    }
  }, []);
  

  const addTask = async (taskData) => {
    
    try {
      const { title, dueDate, priority, columnId } = taskData;
  
      if (!title || !columnId) {
        throw new Error("El título, el ID de la columna y el board son obligatorios");
      }
  
      // Llamar a la API para crear la tarea
      const newTask = await MykanApi.createTask({
        title,
        dueDate,
        priority,
        columnId,
      });
  
      // Actualizar el estado del tablero con la nueva tarea
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTask = await MykanApi.updateTask(taskId, updates);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  return (
    <BoardContext.Provider value={{ columns, tasks, loadBoard, addTask, updateTask }}>
      {children}
    </BoardContext.Provider>
  );
};


BoardProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useBoard = () => useContext(BoardContext);
