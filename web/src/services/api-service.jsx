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
const create = (task) => http.post("/tasks", task);
const list = () => http.get("/board");
const update = (taskId, updates) => http.put(`tasks/${taskId}`, updates);
const complete = (taskId) => http.put(`tasks/${taskId}/complete`);
const deleteTask = (taskId) => http.delete(`tasks/${taskId}`);

// Funciones de Board
const createColumn = (column) => http.post("/columns", column);
const createCard = (columnName, taskData) =>
  http.post(`columns/${columnName}/cards`, taskData);
const getBoard = () => http.get("/board");
const updateColumn = (columnId, updates) =>
  http.put(`columns/${columnId}`, updates);
const deleteColumn = (columnId) => http.delete(`columns/${columnId}`);

export {
  login,
  profile,
  register,
  create,
  list,
  update,
  complete,
  deleteTask,
  createColumn,
  createCard,
  getBoard,
  updateColumn,
  deleteColumn,
};
