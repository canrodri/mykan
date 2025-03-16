import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

const profile = () => http.get("/users/me");

const register = (user) => http.post("/users", user);

const login = (user) => http.post("/sessions", user);

// Funciones de Tareas
const createTask = (task) => http.post("/tasks", task);
const listTasks = () => http.get("/tasks");
const updateTask = (taskId, updates) => http.put(`tasks/${taskId}`, updates);
const completeTask = (taskId) => http.put(`tasks/${taskId}/complete`);
const deleteTask = (taskId) => http.delete(`tasks/${taskId}`);
const moveTask = (taskId, newColumnId) => http.put(`/tasks/${taskId}/move`, { columnId: newColumnId }); 
const getTaskStats = () => http.get("/tasks/stats");

// Funciones de Board
const createColumn = (column) => http.post("/columns", column);
const createCard = (columnId, taskData) => http.post(`columns/${columnId}/cards`, taskData);
const getBoard = () => http.get("/board");
const updateColumn = (columnId, updates) => http.put(`columns/${columnId}`, updates);
const deleteColumn = (columnId) => http.delete(`columns/${columnId}`);

export {
  login,
  profile,
  register,
  createTask,
  listTasks,
  updateTask,
  completeTask,
  deleteTask,
  moveTask,
  getTaskStats,
  createColumn,
  createCard,
  getBoard,
  updateColumn,
  deleteColumn,
};
